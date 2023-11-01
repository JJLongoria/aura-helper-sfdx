import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { SFConnector } from '@aurahelper/connector';
import { CoreUtils, ExportTreeDataResult, FileChecker, FileReader, FileWriter, PathUtils } from '@aurahelper/core';
const Validator = CoreUtils.Validator;
const ProjectUtils = CoreUtils.ProjectUtils;

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'import');
const generalMessages = Messages.loadMessages('aura-helper-sfdx', 'general');

export default class Import extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');
  public static examples = messages.getMessage('examples').split(os.EOL);
  protected static flagsConfig: FlagsConfig = {
    // flag with a value (-n, --name=VALUE)
    root: flags.filepath({
      char: 'r',
      description: generalMessages.getMessage('rootFlagDescription'),
      default: './',
      required: false,
      helpValue: '<path/to/project/root>',
    }),
    file: flags.filepath({
      char: 'f',
      description: messages.getMessage('fileFlagDescription'),
      required: false,
      helpValue: '<path/to/exported/file>',
    }),
    limit: flags.number({
      char: 'l',
      description: messages.getMessage('limitFlagDescription'),
      default: 200,
      helpValue: '<recordsPerBatch>',
      min: 1,
      max: 200,
    }),
    source: flags.string({
      char: 's',
      description: messages.getMessage('sourceFlagDescription'),
      helpValue: '<usernameOrAlias>',
    }),
    query: flags.string({
      description: messages.getMessage('queryFlagDescription'),
      helpValue: 'Select ... from ...',
    }),
    progress: flags.boolean({
      char: 'p',
      description: generalMessages.getMessage('progressFlagDescription'),
    }),
    apiversion: flags.builtin(),
  };

  private importConnector: SFConnector;
  private refsByObjectType: { [key: string]: ReferenceByObject } = {};
  private recordTypeByObject: { [key: string]: RecordTypeData } = {};
  private objectsHierarchyByType: { [key: string]: ObjectHierarchyData } = {};
  private savedIdsByReference: { [key: string]: AnyJson } = {};
  private totalBatches = 0;
  private insertErrorsByBatch: { [key: string]: AnyJson } = {};

  public async run(): Promise<AnyJson> {
    this.validateProjectPath();
    if (!this.flags.source) {
      try {
        const path = Validator.validateFilePath(this.flags.file);
        if (!path.endsWith('-plan.json')) {
          throw new SfdxError(messages.getMessage('notPlanFileError'));
        }
        this.flags.file = path;
      } catch (error) {
        const err = error as Error;
        throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--file', err.message]));
      }
    } else {
      if (!this.flags.query) {
        throw new SfdxError(messages.getMessage('queryNotProvidedError'));
      }
    }
    try {
      if (!this.flags.progress) {
        this.ux.startSpinner(messages.getMessage('runningImportMessage'));
      }
      this.cleanWorkspace(PathUtils.getAuraHelperSFDXTempFilesPath() + '/import-export');
      if (this.flags.source) {
        const response = await this.startExtractingData();
        for (const data of response) {
          if (data.isPlanFile) {
            this.flags.file = data.file;
          }
        }
      }
      const planData = this.validatePlan();
      const alias = ProjectUtils.getOrgAlias(this.flags.root);
      const namespace = ProjectUtils.getOrgNamespace(this.flags.root);
      this.importConnector = new SFConnector(
        alias,
        this.flags.apiversion || ProjectUtils.getProjectConfig(this.flags.root).sourceApiVersion,
        this.flags.root,
        namespace
      );
      this.importConnector.setMultiThread();
      await this.startImportingData(planData);
      if (Object.keys(this.insertErrorsByBatch).length > 0) {
        const folder = PathUtils.getDirname(this.flags.file) + '/errors';
        if (FileChecker.isExists(folder)) {
          FileWriter.delete(folder);
        }
        FileWriter.createFolderSync(folder);
        Object.keys(this.insertErrorsByBatch).forEach((batchName) => {
          FileWriter.createFileSync(
            folder + '/' + batchName + '_errors.json',
            JSON.stringify(this.insertErrorsByBatch[batchName], null, 2)
          );
        });
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('dataNotImportedMessage', [folder]));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('dataNotImportedMessage', [folder]));
        }
        return {
          success: false,
          message: messages.getMessage('dataNotImportedMessage', [folder]),
        };
      } else {
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('importedSuccesfullyMessage'));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('importedSuccesfullyMessage'));
        }
        return {
          success: true,
          message: messages.getMessage('importedSuccesfullyMessage'),
        };
      }
    } catch (error) {
      const err = error as Error;
      throw new SfdxError(err.message);
    }
  }

  private validateProjectPath(): void {
    try {
      this.flags.root = Validator.validateFolderPath(this.flags.root);
    } catch (error) {
      const err = error as Error;
      throw new SfdxError(generalMessages.getMessage('wrongRootPathError', [this.flags.root, err.message]));
    }
    if (!FileChecker.isSFDXRootPath(this.flags.root)) {
      throw new SfdxError(generalMessages.getMessage('projectNotFoundError'));
    }
  }

  private async startExtractingData(): Promise<ExportTreeDataResult[]> {
    try {
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('startExtractingDataMessage', [this.flags.source]));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('startExtractingDataMessage', [this.flags.source]));
      }
      const connector = new SFConnector(
        this.flags.source,
        this.flags.apiversion || ProjectUtils.getProjectConfig(this.flags.root).sourceApiVersion,
        this.flags.root
      );
      const response = await connector.exportTreeData(
        this.flags.query,
        PathUtils.getAuraHelperSFDXTempFilesPath() + '/export'
      );
      return response;
    } catch (error) {
      const err = error as Error;
      throw new SfdxError(err.message);
    }
  }

  private async startImportingData(planData: ExportPlan[]): Promise<AnyJson> {
    const tempFolder = PathUtils.getAuraHelperSFDXTempFilesPath() + '/import-export';
    try {
      const planFolder = PathUtils.getDirname(this.flags.file);
      await this.loadStoredRecordTypes();
      this.createReferencesMap(planData, planFolder);
      this.resolveRecordTypeReferences(planData, planFolder);
      this.createRecordsHierarchy(planData, planFolder);
      this.createBatches(planData);
      await this.insertBatches(planData);
      if (Object.keys(this.insertErrorsByBatch).length > 0) {
        await this.cleanInsertedRecords(tempFolder);
      }
      return this.insertErrorsByBatch;
    } catch (error) {
      const err = error as Error;
      throw new SfdxError(err.message);
    }
  }

  private async loadStoredRecordTypes(): Promise<void> {
    try {
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('loadingRecordTypesMessage'));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('loadingRecordTypesMessage'));
      }
      const records = await this.importConnector.query<RecordTypeRecord>(
        'Select Id, Name, DeveloperName, SobjectType from RecordType'
      );
      for (const record of records) {
        const objType = record.SobjectType;
        if (!this.recordTypeByObject[objType]) {
          this.recordTypeByObject[record.SobjectType] = {
            sObject: record.SobjectType,
            recordTypes: {},
          };
        }
        this.recordTypeByObject[record.SobjectType].recordTypes[record.DeveloperName] = record;
      }
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('recordTypesLoadedMessage'));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('recordTypesLoadedMessage'));
      }
      return;
    } catch (error) {
      const err = error as Error;
      throw new SfdxError(err.message);
    }
  }

  private createReferencesMap(planData: ExportPlan[], planFolder: string): void {
    if (this.flags.progress) {
      this.ux.log(messages.getMessage('savingMapMessage'));
    } else {
      this.ux.setSpinnerStatus(messages.getMessage('savingMapMessage'));
    }
    for (const plan of planData) {
      for (const file of plan.files) {
        const filePath = planFolder + '/' + file;
        const fileData = JSON.parse(FileReader.readFileSync(filePath)) as FileData;
        for (const record of fileData.records) {
          if (!this.refsByObjectType[plan.sobject]) {
            this.refsByObjectType[plan.sobject] = {
              plan,
              references: [],
            };
          }
          const reference = record['attributes'] as AnyJson;
          this.refsByObjectType[plan.sobject].references.push('@' + (reference['referenceId'] as string));
        }
      }
    }
  }

  private resolveRecordTypeReferences(planData: ExportPlan[], planFolder: string): void {
    if (this.flags.progress) {
      this.ux.log(messages.getMessage('resolvingRecordTypesMessage'));
    } else {
      this.ux.setSpinnerStatus(messages.getMessage('resolvingRecordTypesMessage'));
    }
    for (const plan of planData) {
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('resolvingRecordTypeMessage', [plan.sobject]));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('resolvingRecordTypeMessage', [plan.sobject]));
      }
      for (const file of plan.files) {
        const filePath = planFolder + '/' + file;
        const fileData = JSON.parse(FileReader.readFileSync(filePath)) as FileData;
        for (const record of fileData.records) {
          if (record['RecordType']) {
            const recordType = record['RecordType'] as AnyJson;
            if (!recordType['DeveloperName']) {
              throw new SfdxError(messages.getMessage('recordTypeError'));
            }
            if (this.recordTypeByObject[plan.sobject]) {
              const devName = recordType['DeveloperName'] as string;
              if (this.recordTypeByObject[plan.sobject].recordTypes[devName]) {
                record['RecordTypeId'] = this.recordTypeByObject[plan.sobject].recordTypes[devName].Id;
                delete record['RecordType'];
              } else {
                throw new SfdxError(messages.getMessage('recordTypeError', [devName]));
              }
            } else {
              throw new SfdxError(messages.getMessage('recordTypeNotExistsError', [plan.sobject]));
            }
          }
        }
        FileWriter.createFileSync(filePath, JSON.stringify(fileData, null, 2));
      }
    }
  }

  private createRecordsHierarchy(planData: ExportPlan[], planFolder: string): void {
    if (this.flags.progress) {
      this.ux.log(messages.getMessage('resolvingSelfReferencesMessage'));
    } else {
      this.ux.setSpinnerStatus(messages.getMessage('resolvingSelfReferencesMessage'));
    }
    for (const plan of planData) {
      for (const file of plan.files) {
        const filePath = planFolder + '/' + file;
        const fileData = JSON.parse(FileReader.readFileSync(filePath)) as FileData;
        for (const record of fileData.records) {
          let haveParentId = false;
          if (record['MasterRecordId']) {
            delete record['MasterRecordId'];
          }
          Object.keys(record).forEach((field) => {
            if (field !== 'attributes') {
              if (this.refsByObjectType[plan.sobject]) {
                if (this.refsByObjectType[plan.sobject].references.includes(record[field])) {
                  haveParentId = true;
                }
              }
            }
          });
          if (haveParentId) {
            if (!this.objectsHierarchyByType[plan.sobject]) {
              this.objectsHierarchyByType[plan.sobject] = {
                masters: [],
                childs: [],
              };
            }
            this.objectsHierarchyByType[plan.sobject].childs.push(record);
          } else {
            if (!this.objectsHierarchyByType[plan.sobject]) {
              this.objectsHierarchyByType[plan.sobject] = {
                masters: [],
                childs: [],
              };
            }
            this.objectsHierarchyByType[plan.sobject].masters.push(record);
          }
        }
      }
    }
  }

  private createBatches(planData: ExportPlan[]): void {
    if (this.flags.progress) {
      this.ux.log(messages.getMessage('creatingBatchesMessage'));
    } else {
      this.ux.setSpinnerStatus(messages.getMessage('creatingBatchesMessage'));
    }
    const batchFolder = PathUtils.getAuraHelperSFDXTempFilesPath() + '/import-export';
    this.totalBatches = 0;
    let totalRecords = 0;
    for (const plan of planData) {
      if (this.objectsHierarchyByType[plan.sobject]) {
        let counter = 1;
        let batchFileName = plan.sobject + '_batch_' + this.formatBatchCounter(counter) + '.json';
        const mastersFolder = batchFolder + '/' + plan.sobject + '/masters';
        const childsFolder = batchFolder + '/' + plan.sobject + '/childs';
        let records = [];
        for (const record of this.objectsHierarchyByType[plan.sobject].masters) {
          totalRecords++;
          if (records.length < this.flags.limit) {
            records.push(record);
          } else {
            this.totalBatches++;
            if (!FileChecker.isExists(mastersFolder)) {
              FileWriter.createFolderSync(mastersFolder);
            }
            FileWriter.createFileSync(mastersFolder + '/' + batchFileName, JSON.stringify({ records }, null, 2));
            records = [];
            counter++;
            batchFileName = plan.sobject + '_batch_' + this.formatBatchCounter(counter) + '.json';
            records.push(record);
          }
        }
        if (records.length > 0) {
          this.totalBatches++;
          if (!FileChecker.isExists(mastersFolder)) {
            FileWriter.createFolderSync(mastersFolder);
          }
          FileWriter.createFileSync(mastersFolder + '/' + batchFileName, JSON.stringify({ records }, null, 2));
          records = [];
          counter++;
          batchFileName = plan.sobject + '_batch_' + this.formatBatchCounter(counter) + '.json';
        }
        for (const record of this.objectsHierarchyByType[plan.sobject].childs) {
          totalRecords++;
          if (records.length < this.flags.limit) {
            records.push(record);
          } else {
            this.totalBatches++;
            if (!FileChecker.isExists(childsFolder)) {
              FileWriter.createFolderSync(childsFolder);
            }
            FileWriter.createFileSync(childsFolder + '/' + batchFileName, JSON.stringify({ records }, null, 2));
            records = [];
            counter++;
            batchFileName = plan.sobject + '_batch_' + this.formatBatchCounter(counter) + '.json';
            records.push(record);
          }
        }
        if (records.length > 0) {
          this.totalBatches++;
          if (!FileChecker.isExists(childsFolder)) {
            FileWriter.createFolderSync(childsFolder);
          }
          FileWriter.createFileSync(childsFolder + '/' + batchFileName, JSON.stringify({ records }, null, 2));
          records = [];
          counter++;
          batchFileName = plan.sobject + '_batch_' + this.formatBatchCounter(counter) + '.json';
        }
      }
    }
    if (this.flags.progress) {
      this.ux.log(messages.getMessage('batchesCreatedMessage', [totalRecords, this.totalBatches]));
    } else {
      this.ux.setSpinnerStatus(messages.getMessage('batchesCreatedMessage', [totalRecords, this.totalBatches]));
    }
  }

  private async insertBatches(planData: ExportPlan[]): Promise<void> {
    try {
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('startInsertJobMessage'));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('startInsertJobMessage'));
      }
      const batchFolder = PathUtils.getAuraHelperSFDXTempFilesPath() + '/import-export';

      for (const plan of planData) {
        const mastersFolder = plan.sobject + '/masters';
        const childsFolder = plan.sobject + '/childs';
        this.resolveReferences(batchFolder + '/' + mastersFolder, batchFolder + '/' + childsFolder);
        await this.insertMasters(plan, batchFolder, mastersFolder);
        await this.insertChilds(plan, batchFolder, childsFolder);
      }
      return;
    } catch (error) {
      const err = error as Error;
      throw new SfdxError(err.message);
    }
  }

  private async insertMasters(plan: ExportPlan, batchFolder: string, mastersFolder: string): Promise<void> {
    if (FileChecker.isExists(batchFolder + '/' + mastersFolder)) {
      const batchFiles = FileReader.readDirSync(batchFolder + '/' + mastersFolder);
      if (batchFiles.length > 0) {
        if (Object.keys(this.savedIdsByReference).length > 0) {
          if (this.flags.progress) {
            this.ux.log(messages.getMessage('executeInsertOperationMessage', [plan.sobject]));
          } else {
            this.ux.setSpinnerStatus(messages.getMessage('executeInsertOperationMessage', [plan.sobject]));
          }
        }
        for (const batchFile of batchFiles) {
          const batchName = batchFile.replace('.json', '');
          if (this.flags.progress) {
            this.ux.log(messages.getMessage('runningBatchMessage', [batchName]));
          } else {
            this.ux.setSpinnerStatus(messages.getMessage('runningBatchMessage', [batchName]));
          }
          try {
            const response = await this.importConnector.importTreeData(mastersFolder + '/' + batchFile);
            if (response.results) {
              for (const insertResult of response.results) {
                this.savedIdsByReference[insertResult.refId] = {
                  id: insertResult.id,
                  sobject: insertResult.sobject,
                };
              }
            } else {
              this.insertErrorsByBatch[batchName] = {
                name: batchName,
                file: batchFolder + '/' + mastersFolder + '/' + batchFile,
                errors: response.errors,
              };
            }
            return;
          } catch (error) {
            const err = error as Error;
            throw new SfdxError(err.message);
          }
        }
      }
    }
  }

  private async insertChilds(plan: ExportPlan, batchFolder: string, childsFolder: string): Promise<void> {
    if (FileChecker.isExists(batchFolder + '/' + childsFolder)) {
      const batchFiles = FileReader.readDirSync(batchFolder + '/' + childsFolder);
      if (batchFiles.length > 0) {
        if (Object.keys(this.savedIdsByReference).length > 0) {
          if (this.flags.progress) {
            this.ux.log(messages.getMessage('executeChildsInsertOperationMessage', [plan.sobject]));
          } else {
            this.ux.setSpinnerStatus(messages.getMessage('executeChildsInsertOperationMessage', [plan.sobject]));
          }
        }
        for (const batchFile of batchFiles) {
          const batchName = batchFile.replace('.json', '');
          if (this.flags.progress) {
            this.ux.log(messages.getMessage('runningBatchMessage', [batchName]));
          } else {
            this.ux.setSpinnerStatus(messages.getMessage('runningBatchMessage', [batchName]));
          }
          try {
            const response = await this.importConnector.importTreeData(childsFolder + '/' + batchFile);
            if (response.results) {
              for (const insertResult of response.results) {
                this.savedIdsByReference[insertResult.refId] = {
                  id: insertResult.id,
                  sobject: insertResult.sobject,
                };
              }
            } else {
              this.insertErrorsByBatch[batchName] = {
                name: batchName,
                file: batchFolder + '/' + childsFolder + '/' + batchFile,
                errors: response.errors,
              };
            }
          } catch (error) {
            const err = error as Error;
            throw new SfdxError(err.message);
          }
        }
      }
    }
  }

  private resolveReferences(mastersFolder: string, childsFolder: string): void {
    if (Object.keys(this.savedIdsByReference).length > 0) {
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('resolvingReferencesMessage'));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('resolvingReferencesMessage'));
      }
      if (FileChecker.isExists(mastersFolder)) {
        const batchFiles = FileReader.readDirSync(mastersFolder);
        if (batchFiles.length > 0) {
          for (const batchFile of batchFiles) {
            const records = JSON.parse(FileReader.readFileSync(mastersFolder + '/' + batchFile)) as FileData;
            for (const record of records.records) {
              Object.keys(record).forEach((field) => {
                const fieldVal = record[field] as string;
                if (this.savedIdsByReference[fieldVal]) {
                  record[field] = this.savedIdsByReference[fieldVal]['id'] as string;
                }
              });
            }
            FileWriter.createFileSync(mastersFolder + '/' + batchFile, JSON.stringify(records, null, 2));
          }
        }
      }
      if (FileChecker.isExists(childsFolder)) {
        const batchFiles = FileReader.readDirSync(childsFolder);
        if (batchFiles.length > 0) {
          for (const batchFile of batchFiles) {
            const records = JSON.parse(FileReader.readFileSync(childsFolder + '/' + batchFile)) as FileData;
            for (const record of records.records) {
              Object.keys(record).forEach((field) => {
                const fieldVal = record[field] as string;
                if (this.savedIdsByReference[fieldVal]) {
                  record[field] = this.savedIdsByReference[fieldVal]['id'] as string;
                }
              });
            }
            FileWriter.createFileSync(childsFolder + '/' + batchFile, JSON.stringify(records, null, 2));
          }
        }
      }
    }
  }

  private async cleanInsertedRecords(tempFolder: string): Promise<void> {
    try {
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('errorsFoundMessage'));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('errorsFoundMessage'));
      }
      const idsByType: { [key: string]: string[] } = {};
      Object.keys(this.savedIdsByReference).forEach((reference) => {
        const refData = this.savedIdsByReference[reference];
        const sObject = refData['sobject'] as string;
        if (!idsByType[sObject]) {
          idsByType[sObject] = [];
        }
        idsByType[sObject].push(refData['id'] as string);
      });
      for (const sobject of Object.keys(idsByType)) {
        if (!this.flags.json) {
          if (this.flags.progress) {
            this.ux.log(messages.getMessage('rollbackMessage', [sobject]));
          } else {
            this.ux.setSpinnerStatus(messages.getMessage('rollbackMessage', [sobject]));
          }
        }
        const csvContent = 'Id\n' + idsByType[sobject].join('\n');
        const csvFile = sobject + '_deleteFile.csv';
        FileWriter.createFileSync(tempFolder + '/' + csvFile, csvContent);
        await this.importConnector.bulkDelete(csvFile, sobject);
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('rollbackFinishMessage', [sobject]));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('rollbackFinishMessage', [sobject]));
        }
      }
      return;
    } catch (error) {
      const err = error as Error;
      throw new SfdxError(err.message);
    }
  }

  private validatePlan(): ExportPlan[] {
    try {
      const data = FileReader.readFileSync(this.flags.file);
      const planData = JSON.parse(data) as ExportPlan[];
      const planFolder = PathUtils.getDirname(this.flags.file);
      const notExistingFiles = this.getNotExistingFiles(planData, planFolder);
      if (notExistingFiles.length > 0) {
        throw new SfdxError(messages.getMessage('startExtractingDataMessage', [notExistingFiles.join(',')]));
      } else {
        return planData;
      }
    } catch (error) {
      const err = error as Error;
      throw new SfdxError(err.message);
    }
  }

  private getNotExistingFiles(planData: ExportPlan[], planFolder: string): string[] {
    const notExistingFiles: string[] = [];
    for (const plan of planData) {
      for (const file of plan.files) {
        const filePath = planFolder + '/' + file;
        if (!FileChecker.isExists(filePath)) {
          notExistingFiles.push(filePath);
        }
      }
    }
    return notExistingFiles;
  }

  private formatBatchCounter(counter: number): string {
    if (counter < 10) {
      return '0000' + counter.toString();
    } else if (counter < 100) {
      return '000' + counter.toString();
    } else if (counter < 1000) {
      return '00' + counter.toString();
    } else if (counter < 10000) {
      return '0' + counter.toString();
    } else {
      return counter.toString();
    }
  }

  private cleanWorkspace(tempFolder: string): void {
    if (FileChecker.isExists(tempFolder)) {
      FileWriter.delete(tempFolder);
    }
    FileWriter.createFolderSync(tempFolder);
  }
}

interface ObjectHierarchyData {
  masters: AnyJson[];
  childs: AnyJson[];
}

interface ExportPlan {
  sobject: string;
  files: string[];
}

interface ReferenceByObject {
  plan: ExportPlan;
  references: string[];
}

interface FileData {
  records: AnyJson[];
}

interface RecordTypeData {
  sObject: string;
  recordTypes: { [key: string]: RecordTypeRecord };
}

interface RecordTypeRecord {
  Id: string;
  Name: string;
  DeveloperName: string;
  SobjectType: string;
}
