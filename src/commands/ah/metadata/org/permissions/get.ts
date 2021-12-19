import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { SFConnector } from '@aurahelper/connector';
import { CoreUtils, FileChecker, FileWriter, PathUtils } from '@aurahelper/core';
import CommandUtils from '../../../../../libs/utils/commandUtils';
const Validator = CoreUtils.Validator;
const ProjectUtils = CoreUtils.ProjectUtils;

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'permissions');
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

  public async run(): Promise<string[]> {
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
      this.ux.startSpinner(messages.getMessage('runningGetPermissionsMessage'));
    } else {
      this.ux.log(messages.getMessage('runningGetPermissionsMessage'));
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
    const permissions = await connector.loadUserPermissions(PathUtils.getAuraHelperSFDXTempFilesPath());
    if (!this.flags.json) {
      if (permissions && permissions.length > 0) {
        if (this.flags.csv) {
          const csvData = CommandUtils.transformPermissionsToCSV(permissions);
          this.ux.log(csvData);
        } else {
          const datatable = CommandUtils.transformPermissionsToTable(permissions);
          this.ux.table(datatable, {
            columns: [
              {
                key: 'name',
                label: 'API Name',
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
      FileWriter.createFileSync(this.flags.outputile, JSON.stringify(permissions, null, 2));
      this.ux.log(messages.getMessage('outputSavedMessage', [this.flags.outputfile]));
    }
    return permissions;
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
