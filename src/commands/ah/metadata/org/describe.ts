import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { SFConnector } from '@aurahelper/connector';
import { CoreUtils, FileChecker, FileWriter, MetadataDetail, MetadataType, PathUtils } from '@aurahelper/core';
import CommandUtils from '../../../../libs/utils/commandUtils';
const Validator = CoreUtils.Validator;
const ProjectUtils = CoreUtils.ProjectUtils;
const Utils = CoreUtils.Utils;

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'orgDescribe');
const generalMessages = Messages.loadMessages('aura-helper-sfdx', 'general');

export default class Describe extends SfdxCommand {
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
    all: flags.boolean({
      char: 'a',
      description: messages.getMessage('allFlagDescription'),
      exclusive: ['type'],
    }),
    type: flags.array({
      char: 't',
      delimiter: ',',
      description: messages.getMessage('typeFlagDescription'),
      exclusive: ['all'],
      helpValue: '<MetadataTypeName>[,<MetadataTypeName>...]',
    }),
    group: flags.boolean({
      description: messages.getMessage('groupFlagDescription'),
      default: false,
    }),
    downloadall: flags.boolean({
      description: messages.getMessage('downloadAllFlagDescription'),
    }),
    outputfile: flags.filepath({
      description: generalMessages.getMessage('outputPathFlagDescription'),
      helpValue: '<path/to/output/file>',
    }),
    csv: flags.boolean({
      description: messages.getMessage('csvFlagDescription'),
      default: false,
    }),
    progress: flags.boolean({
      char: 'p',
      description: generalMessages.getMessage('progressFlagDescription'),
    }),
    apiversion: flags.builtin(),
  };

  public async run(): Promise<{ [key: string]: MetadataType }> {
    this.validateProjectPath();
    if (this.flags.all === undefined && this.flags.type === undefined) {
      throw new SfdxError(messages.getMessage('missingTypesToDescribeError'));
    }
    if (this.flags.outputfile) {
      try {
        this.flags.outputfile = PathUtils.getAbsolutePath(this.flags.outputfile);
      } catch (error) {
        const err = error as Error;
        throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--outputfile', err.message]));
      }
    }
    if (!this.flags.progress) {
      this.ux.startSpinner(generalMessages.getMessage('runningDescribeMessage'));
    }
    const alias = ProjectUtils.getOrgAlias(this.flags.root);
    const namespace = ProjectUtils.getOrgNamespace(this.flags.root);
    const connector = new SFConnector(
      alias,
      this.flags.apiversion || ProjectUtils.getProjectConfig(this.flags.root).sourceApiVersion,
      this.flags.root,
      namespace
    );
    let detailTypes: MetadataDetail[] | undefined;
    let strTypes: string[] | undefined;
    if (this.flags.all) {
      if (this.flags.progress) {
        this.ux.log(generalMessages.getMessage('gettingAvailableMetadataTypesMessage'));
      } else {
        this.ux.setSpinnerStatus(generalMessages.getMessage('gettingAvailableMetadataTypesMessage'));
      }
      detailTypes = [];
      const metadataTypes = await connector.listMetadataTypes();
      for (const type of metadataTypes) {
        detailTypes.push(type);
      }
    } else if (this.flags.type) {
      strTypes = CommandUtils.getTypes(this.flags.type);
    }
    if (this.flags.progress) {
      this.ux.log(messages.getMessage('describeOrgTypesMessage'));
    } else {
      this.ux.setSpinnerStatus(messages.getMessage('describeOrgTypesMessage'));
    }
    connector.onAfterDownloadType((status) => {
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('afterDownloadMessage', [status.entityType]));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('afterDownloadMessage', [status.entityType]));
      }
    });
    const metadata = await connector.describeMetadataTypes(
      detailTypes || strTypes,
      this.flags.downloadall,
      this.flags.group
    );
    if (!this.flags.json) {
      if (metadata && Utils.hasKeys(metadata)) {
        if (this.flags.csv) {
          const csvData = CommandUtils.transformMetadataTypesToCSV(metadata);
          this.ux.log(csvData);
        } else {
          const datatable = CommandUtils.transformMetadataTypesToTable(metadata);
          this.ux.table(datatable, {
            columns: [
              {
                key: 'type',
                label: 'Metadata Type',
              },
              {
                key: 'object',
                label: 'Metadata Object',
              },
              {
                key: 'item',
                label: 'Metadata Item',
              },
              {
                key: 'path',
                label: 'Path',
              },
            ],
          });
        }
      } else {
        this.ux.log(messages.getMessage('noDataToShowError'));
      }
    }
    if (this.flags.outputfile) {
      const baseDir = PathUtils.getDirname(this.flags.outputfile);
      if (!FileChecker.isExists(baseDir)) {
        FileWriter.createFolderSync(baseDir);
      }
      FileWriter.createFileSync(this.flags.outputile, JSON.stringify(metadata, null, 2));
      this.ux.log(messages.getMessage('outputSavedMessage', [this.flags.outputfile]));
    }
    return metadata;
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
}
