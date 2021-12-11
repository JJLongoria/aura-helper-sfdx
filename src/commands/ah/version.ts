import * as os from 'os';
import { SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson, ensureJsonMap } from '@salesforce/ts-types';
import { FileReader, PathUtils } from '@aurahelper/core';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'version');

export default class Version extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');
  public static examples = messages.getMessage('examples').split(os.EOL);

  public run(): Promise<AnyJson> {
    return new Promise((resolve) => {
      let dirName: string = __dirname;
      dirName = PathUtils.getDirname(dirName);
      dirName = PathUtils.getDirname(dirName);
      dirName = PathUtils.getDirname(dirName);
      dirName = PathUtils.getAbsolutePath(dirName);
      const packageDir = dirName + '/package.json';
      const content: string = FileReader.readFileSync(packageDir);
      const config = ensureJsonMap(JSON.parse(content));
      this.ux.log(`Aura Helper SFDX Version: v${config.version as string}`);
      resolve({ version: config.version });
    });
  }
}
