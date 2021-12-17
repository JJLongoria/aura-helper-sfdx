import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { SFConnector } from '@aurahelper/connector';
import { CoreUtils, ExportTreeDataResult, FileChecker, PathUtils } from '@aurahelper/core';
const Validator = CoreUtils.Validator;
const ProjectUtils = CoreUtils.ProjectUtils;

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'export');
const generalMessages = Messages.loadMessages('aura-helper-sfdx', 'general');

export default class Describe extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');
  public static examples = messages.getMessage('examples').split(os.EOL);
  protected static supportsUsername = true;
  protected static flagsConfig: FlagsConfig = {
    // flag with a value (-n, --name=VALUE)
    root: flags.filepath({
      char: 'r',
      description: generalMessages.getMessage('rootFlagDescription'),
      default: './',
      required: false,
      helpValue: '<path/to/project/root>',
    }),
    query: flags.string({
      description: messages.getMessage('queryFlagDescription'),
      helpValue: 'Select ... from ...',
      required: true,
    }),
    outputpath: flags.filepath({
      char: 'o',
      description: messages.getMessage('outputPathFlagDescription'),
      helpValue: '<path/to/output/file>',
      default: './export',
    }),
    prefix: flags.string({
      description: messages.getMessage('prefixFlagDescripition'),
      helpValue: '<filePrefix>',
    }),
    progress: flags.boolean({
      char: 'p',
      description: generalMessages.getMessage('progressFlagDescription'),
    }),
    apiversion: flags.builtin(),
  };

  public async run(): Promise<ExportTreeDataResult[]> {
    this.validateProjectPath();
    if (this.flags.outputpath) {
      try {
        this.flags.outputpath = PathUtils.getAbsolutePath(this.flags.outputpath);
      } catch (error) {
        const err = error as Error;
        throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--output-file', err.message]));
      }
    }

    try {
      if (!this.flags.progress) {
        this.ux.startSpinner(messages.getMessage('runningExportMessage'));
      }
      if (!this.flags.targetusername) {
        this.flags.targetusername = ProjectUtils.getOrgAlias(this.flags.root);
      }
      const extractigFrom = this.flags.targetusername
        ? 'Org with username or alias ' + (this.flags.targetusername as string)
        : 'Auth org';
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('startExtractingDataMessage', [extractigFrom]));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('startExtractingDataMessage', [extractigFrom]));
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
      const response = await connector.exportTreeData(this.flags.query, this.flags.outputpath, this.flags.prefix);
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('extractedSuccesfullyMessage', [this.flags.outputpath]));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('extractedSuccesfullyMessage', [this.flags.outputpath]));
      }
      return response;
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
}
