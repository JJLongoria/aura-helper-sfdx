import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { SFConnector } from '@aurahelper/connector';
import { CoreUtils, FileChecker, FileWriter, MetadataType, PathUtils } from '@aurahelper/core';
import CommandUtils from '../../../../../libs/utils/commandUtils';
const Validator = CoreUtils.Validator;
const ProjectUtils = CoreUtils.ProjectUtils;
const Utils = CoreUtils.Utils;
const MetadataUtils = CoreUtils.MetadataUtils;

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'orgBetweenCompare');
const generalMessages = Messages.loadMessages('aura-helper-sfdx', 'general');

export default class Compare extends SfdxCommand {
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
    source: flags.string({
      char: 's',
      description: messages.getMessage('sourceFlagDescription'),
      helpValue: 'usernameOrAlias',
    }),
    target: flags.string({
      char: 't',
      description: messages.getMessage('targetFlagDescription'),
      helpValue: 'usernameOrAlias',
      required: true,
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
    if (this.flags.outputfile) {
      try {
        this.flags.outputfile = PathUtils.getAbsolutePath(this.flags.outputfile);
      } catch (error) {
        const err = error as Error;
        throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--outputfile', err.message]));
      }
    }
    if (!this.flags.progress) {
      this.ux.startSpinner(messages.getMessage('runningCompareMessage'));
    } else {
      this.ux.log(messages.getMessage('runningCompareMessage'));
    }
    const sourceAlias = ProjectUtils.getOrgAlias(this.flags.root);
    const sourceNamespace = ProjectUtils.getOrgNamespace(this.flags.root);
    const connectorSource = new SFConnector(
      this.flags.source || sourceAlias,
      this.flags.apiversion || ProjectUtils.getProjectConfig(this.flags.root).sourceApiVersion,
      this.flags.root,
      sourceNamespace
    );
    connectorSource.setMultiThread();
    if (this.flags.progress) {
      this.ux.log(messages.getMessage('describeSourceTypesMessage'));
    } else {
      this.ux.setSpinnerStatus(messages.getMessage('describeSourceTypesMessage'));
    }
    const metadataDetailsSource = await connectorSource.listMetadataTypes();
    connectorSource.onAfterDownloadType((status) => {
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('afterDownloadMessage', [status.entityType]));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('afterDownloadMessage', [status.entityType]));
      }
    });
    const typesFromSource = await connectorSource.describeMetadataTypes(metadataDetailsSource, false, true);
    const targetNamespace = ProjectUtils.getOrgNamespace(this.flags.root);
    const connectorTarget = new SFConnector(
      this.flags.target,
      this.flags.apiversion || ProjectUtils.getProjectConfig(this.flags.root).sourceApiVersion,
      this.flags.root,
      targetNamespace
    );
    connectorTarget.setMultiThread();
    if (this.flags.progress) {
      this.ux.log(messages.getMessage('describeTargetTypesMessage'));
    } else {
      this.ux.setSpinnerStatus(messages.getMessage('describeTargetTypesMessage'));
    }
    const metadataDetailsTarget = await connectorTarget.listMetadataTypes();
    connectorTarget.onAfterDownloadType((status) => {
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('afterDownloadMessage', [status.entityType]));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('afterDownloadMessage', [status.entityType]));
      }
    });
    const typesFromTarget = await connectorTarget.describeMetadataTypes(metadataDetailsTarget, false, true);
    if (this.flags.progress) {
      this.ux.log(messages.getMessage('comparingMessage'));
    } else {
      this.ux.setSpinnerStatus(messages.getMessage('comparingMessage'));
    }
    const compareResult = MetadataUtils.compareMetadata(typesFromSource, typesFromTarget);
    if (!this.flags.json) {
      if (compareResult && Utils.hasKeys(compareResult)) {
        if (this.flags.csv) {
          const csvData = CommandUtils.transformMetadataTypesToCSV(compareResult);
          this.ux.log(csvData);
        } else {
          const datatable = CommandUtils.transformMetadataTypesToTable(compareResult);
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
      FileWriter.createFileSync(this.flags.outputile, JSON.stringify(compareResult, null, 2));
      this.ux.log(messages.getMessage('outputSavedMessage', [this.flags.outputfile]));
    }
    if (!this.flags.progress) {
      this.ux.stopSpinner(messages.getMessage('comparingFinish'));
    } else {
      this.ux.log(messages.getMessage('comparingFinish'));
    }
    return compareResult;
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
