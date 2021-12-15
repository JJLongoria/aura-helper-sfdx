import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { CoreUtils, FileChecker, MetadataType, PathUtils, RetrieveResult, SpecialMetadata } from '@aurahelper/core';
import { XMLCompressor } from '@aurahelper/xml-compressor';
import { SFConnector } from '@aurahelper/connector';
import CommandUtils from '../../../../../libs/utils/commandUtils';
const Validator = CoreUtils.Validator;
const ProjectUtils = CoreUtils.ProjectUtils;

const sortOrderValues: string[] = Object.values(XMLCompressor.getSortOrderValues()) as string[];

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'localRetrieve');
const generalMessages = Messages.loadMessages('aura-helper-sfdx', 'general');

export default class Retrieve extends SfdxCommand {
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
      description: messages.getMessage('allFlagDescription', [Object.keys(SpecialMetadata).join(',')]),
      exclusive: ['type'],
    }),
    type: flags.array({
      char: 't',
      delimiter: ',',
      description: messages.getMessage('typeFlagDescription'),
      exclusive: ['all'],
      helpValue: '<MetadataTypeName>[,<MetadataTypeName:Object>, <MetadataTypeName:Object:Item>...]',
    }),
    includeorg: flags.boolean({
      char: 'i',
      description: messages.getMessage('includeOrgFlagDestription'),
    }),
    downloadall: flags.boolean({
      description: messages.getMessage('downloadAllFlagDescription'),
    }),
    compress: flags.boolean({
      char: 'c',
      description: messages.getMessage('compressFlagDescription'),
    }),
    sortorder: flags.enum({
      char: 's',
      description: generalMessages.getMessage('sortOrderFlagDescription'),
      options: sortOrderValues,
      required: false,
      default: XMLCompressor.getSortOrderValues().SIMPLE_FIRST,
    }),
    progress: flags.boolean({
      char: 'p',
      description: generalMessages.getMessage('progressFlagDescription'),
    }),
    apiversion: flags.builtin(),
  };

  private retrievedFinished: boolean;

  public async run(): Promise<RetrieveResult> {
    this.retrievedFinished = false;
    this.validateProjectPath();
    if (this.flags.all === undefined && this.flags.type === undefined) {
      throw new SfdxError(messages.getMessage('missingTypesToRetrieveError'));
    }
    if (this.flags.progress) {
      this.ux.log(messages.getMessage('runningRetrieveMessage'));
    } else {
      this.ux.startSpinner(messages.getMessage('runningRetrieveMessage'));
    }
    try {
      let types: { [key: string]: MetadataType } | undefined;
      if (this.flags.type && !this.flags.all) {
        types = CommandUtils.getAdvanceTypes(this.flags.type);
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
      connector.onLoadingLocal(() => {
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('loadingLocalMessage'));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('loadingLocalMessage'));
        }
      });
      connector.onLoadingOrg(() => {
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('loadingOrgMessage'));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('loadingOrgMessage'));
        }
      });
      connector.onAfterDownloadType((status) => {
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('afterDownloadMessage', [status.entityType]));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('afterDownloadMessage', [status.entityType]));
        }
      });
      connector.onRetrieve(() => {
        if (!this.flags.json) {
          this.reportRetrieveProgress(2500);
        }
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('onRetrieveMessage'));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('onRetrieveMessage'));
        }
      });
      connector.onCopyData(() => {
        this.retrievedFinished = true;
      });
      connector.onCopyFile((status) => {
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('copyFileMessage', [PathUtils.getBasename(status.data), status.data]));
        } else {
          this.ux.setSpinnerStatus(
            messages.getMessage('copyFileMessage', [PathUtils.getBasename(status.data), status.data])
          );
        }
      });
      let retrieveOut = new RetrieveResult('');
      if (!this.flags.includeorg) {
        retrieveOut = await connector.retrieveLocalSpecialTypes(
          PathUtils.getAuraHelperCLITempFilesPath(),
          types,
          this.flags.compress,
          this.flags.sortrrder
        );
      } else {
        retrieveOut = await connector.retrieveMixedSpecialTypes(
          PathUtils.getAuraHelperCLITempFilesPath(),
          types,
          this.flags.downloadall,
          this.flags.compress,
          this.flags.sortrrder
        );
      }
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('retrieveFinishedMessage'));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('retrieveFinishedMessage'));
      }
      return retrieveOut;
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

  private reportRetrieveProgress(millis: number): void {
    if (!this.retrievedFinished) {
      setTimeout(() => {
        if (!this.retrievedFinished) {
          if (this.flags.progress) {
            this.ux.log(messages.getMessage('retrieveInProgressMessage', [new Date().getTime()]));
          } else {
            this.ux.setSpinnerStatus(messages.getMessage('retrieveInProgressMessage', [new Date().getTime()]));
          }
          this.reportRetrieveProgress(millis);
        }
      }, millis);
    }
  }
}
