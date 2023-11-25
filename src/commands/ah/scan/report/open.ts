import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { FileReader, PathUtils } from '@aurahelper/core';
import { LiveServerParams, shutdown, start } from 'live-server';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'scanReportOpen');
const generalMessages = Messages.loadMessages('aura-helper-sfdx', 'general');

export default class Open extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');
  public static examples = messages.getMessage('examples').split(os.EOL);
  public static enableJsonFlag = false;

  protected static flagsConfig: FlagsConfig = {
    inputdir: flags.directory({
      char: 'i',
      description: messages.getMessage('inputDirFlagDescription'),
      required: false,
      helpValue: '<path/to/report/directory>',
      default: './',
    }),
    port: flags.integer({
      char: 'p',
      description: messages.getMessage('portFlagDescription'),
      required: false,
      helpValue: '<port>',
      default: 5000,
    }),
  };

  public async run(): Promise<string> {
    this.ux.startSpinner(messages.getMessage('message.open-report'));
    this.validateInputPath();
    const files = FileReader.readDirSync(this.flags.inputdir);
    if (!files.includes('index.html')) {
      throw new SfdxError(generalMessages.getMessage('noIndexError', [this.flags.inputdir]));
    }
    const params: LiveServerParams = {
      port: this.flags.port as number, // Set the server port. Defaults to 8080.
      host: '0.0.0.0', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
      root: this.flags.inputdir as string, // Set root directory that's being served. Defaults to cwd.
      open: true, // When false, it won't load your browser by default.
      file: 'index.html', // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
      logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    };
    try {
      this.ux.setSpinnerStatus(messages.getMessage('message.open-server'));
      start(params);
      this.ux.setSpinnerStatus(messages.getMessage('message.open-browser'));
      shutdown();
    } catch (error) {
      /* empty */
    }
    this.ux.stopSpinner(messages.getMessage('message.report-closed'));
    return Promise.resolve(messages.getMessage('message.report-closed'));
  }

  private validateInputPath(): void {
    try {
      this.flags.inputdir = PathUtils.getAbsolutePath(this.flags.inputdir);
    } catch (error) {
      const err = error as Error;
      throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--inputdir', err.message]));
    }
  }
}
