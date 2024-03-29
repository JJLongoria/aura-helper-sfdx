import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { SFConnector } from '@aurahelper/connector';
import { CoreUtils, FileChecker, FileWriter, MetadataDetail, PathUtils } from '@aurahelper/core';
import { MetadataFactory } from '@aurahelper/metadata-factory';
import CommandUtils from '../../../../libs/utils/commandUtils';
const Validator = CoreUtils.Validator;
const ProjectUtils = CoreUtils.ProjectUtils;

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'localList');
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

  public async run(): Promise<MetadataDetail[]> {
    this.validateProjectPath();
    if (this.flags.outputfile) {
      try {
        this.flags.outputfile = PathUtils.getAbsolutePath(this.flags.outputfile);
      } catch (error) {
        const err = error as Error;
        throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--output-file', err.message]));
      }
    }
    if (!this.flags.progress) {
      this.ux.startSpinner(messages.getMessage('runningListMessage'));
    } else {
      this.ux.log(messages.getMessage('runningListMessage'));
    }
    const alias = ProjectUtils.getOrgAlias(this.flags.root);
    const namespace = ProjectUtils.getOrgNamespace(this.flags.root);
    const connector = new SFConnector(
      alias,
      this.flags.apiversion || ProjectUtils.getProjectConfig(this.flags.root).sourceApiVersion,
      this.flags.root,
      namespace
    );
    connector.setMultiThread();
    if (this.flags.progress) {
      this.ux.log(generalMessages.getMessage('gettingAvailableMetadataTypesMessage'));
    } else {
      this.ux.setSpinnerStatus(generalMessages.getMessage('gettingAvailableMetadataTypesMessage'));
    }
    const metadata: MetadataDetail[] = [];
    const metadataDetails = await connector.listMetadataTypes();
    const folderMetadataMap = MetadataFactory.createFolderMetadataMap(metadataDetails);
    const metadataFromFileSystem = MetadataFactory.createMetadataTypesFromFileSystem(
      folderMetadataMap,
      this.flags.root
    );
    Object.keys(folderMetadataMap).forEach(function (folder) {
      const metadataType = folderMetadataMap[folder];
      if (metadataFromFileSystem[metadataType.xmlName]) {
        metadata.push(metadataType);
      }
    });
    if (!this.flags.json) {
      if (metadataDetails && metadataDetails.length) {
        if (this.flags.csv) {
          const csvData = CommandUtils.transformMetadataDetailsToCSV(metadata);
          this.ux.log(csvData);
        } else {
          const datatable = CommandUtils.transformMetadataDetailsToTable(metadata);
          this.ux.table(datatable, {
            columns: [
              {
                key: 'name',
                label: 'Name',
              },
              {
                key: 'directory',
                label: 'Directory',
              },
              {
                key: 'suffix',
                label: 'Suffix',
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
      this.ux.log(generalMessages.getMessage('outputSavedMessage', [this.flags.outputfile]));
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
