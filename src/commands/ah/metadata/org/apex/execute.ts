import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { CoreUtils, FileChecker } from '@aurahelper/core';
import { SFConnector } from '@aurahelper/connector';
const Validator = CoreUtils.Validator;
const ProjectUtils = CoreUtils.ProjectUtils;

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'apexExecute');
const generalMessages = Messages.loadMessages('aura-helper-sfdx', 'general');

export default class Execute extends SfdxCommand {
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
      helpValue: '<path/to/apex/file>',
      exclusive: ['all', 'directory'],
      required: true,
    }),
    iterations: flags.number({
      char: 'i',
      description: messages.getMessage('iterationsFlagDescription'),
      min: 1,
      default: 1,
    }),
    printlog: flags.boolean({
      char: 'l',
      description: messages.getMessage('printLogFlagDescription'),
    }),
    progress: flags.boolean({
      char: 'p',
      description: generalMessages.getMessage('progressFlagDescription'),
    }),
    apiversion: flags.builtin(),
  };

  public async run(): Promise<AnyJson> {
    this.validateProjectPath();
    this.flags.file = Validator.validateFilePath(this.flags.file);
    if (this.flags.progress) {
      this.ux.log(messages.getMessage('runningScriptMessage'));
    } else {
      this.ux.startSpinner(messages.getMessage('runningScriptMessage'));
    }
    try {
      const alias = ProjectUtils.getOrgAlias(this.flags.root);
      const namespace = ProjectUtils.getOrgNamespace(this.flags.root);
      const connector = new SFConnector(
        alias,
        this.flags.apiversion || ProjectUtils.getProjectConfig(this.flags.root).sourceApiVersion,
        this.flags.root,
        namespace
      );
      for (let i = 0; i < this.flags.iterations; i++) {
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('executingIterationMessage', [i + 1, this.flags.iterations]));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('executingIterationMessage', [i + 1, this.flags.iterations]));
        }
        const result = await connector.executeApexAnonymous(this.flags.file);
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('finishedIterationMessage', [i + 1, this.flags.iterations]));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('finishedIterationMessage', [i + 1, this.flags.iterations]));
        }
        if (this.flags.progress && this.flags.printlog) {
          this.ux.log(result);
        }
      }
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('finishMessage'));
      } else {
        this.ux.stopSpinner(messages.getMessage('finishMessage'));
      }
      return {
        message: messages.getMessage('finishMessage'),
      };
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
