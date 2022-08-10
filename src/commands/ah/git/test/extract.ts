import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { CoreUtils, FileChecker, PathUtils } from '@aurahelper/core';
import { GitManager } from '@aurahelper/git-manager';
const Validator = CoreUtils.Validator;
const StrUtils = CoreUtils.StrUtils;
let gitManager: GitManager;

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'extractTestGit');
const generalMessages = Messages.loadMessages('aura-helper-sfdx', 'general');

export default class Extract extends SfdxCommand {
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
    source: flags.string({
      char: 's',
      required: true,
      description: messages.getMessage('sourceFlagDescription'),
    }),
    target: flags.string({
      char: 't',
      description: messages.getMessage('targetFlagDescription'),
    }),
    starttag: flags.string({
      description: messages.getMessage('startTagFlagDescription'),
      default: '--TESTS START--',
    }),
    endtag: flags.string({
      description: messages.getMessage('endTagFlagDescription'),
      default: '--TESTS END--',
    }),
    apiversion: flags.builtin(),
  };

  public async run(): Promise<string | string[]> {
    let testClassesResult: string[] = [];
    this.validateProjectPath();
    this.validateOutputPath();
    try {
      gitManager = new GitManager(this.flags.root);
      const gitCommits = await gitManager.getCommits(this.flags.source, this.flags.target);
      if (gitCommits && gitCommits.length) {
        for (const commit of gitCommits) {
          if (commit.message) {
            const splits = commit.message.split('\n');
            let onTests = false;
            for (const split of splits) {
              if (onTests) {
                let data = StrUtils.replace(split, this.flags.starttag, '').trim();
                data = StrUtils.replace(data, this.flags.endtag, '').trim();
                if (data) {
                  if (StrUtils.contains(data, ',')) {
                    for (let dataSplit of data.split(',')) {
                      dataSplit = dataSplit.trim();
                      if (dataSplit && !testClassesResult.includes(dataSplit)) {
                        testClassesResult.push(dataSplit);
                      }
                    }
                  } else {
                    if (!testClassesResult.includes(data)) {
                      testClassesResult.push(data);
                    }
                  }
                }
              }
              if (onTests && StrUtils.contains(split, this.flags.endtag)) {
                onTests = false;
              }
              if (!onTests && StrUtils.contains(split, this.flags.starttag)) {
                onTests = true;
              }
            }
          }
        }
      }
    } catch (error) {
      const err = error as Error;
      throw new SfdxError(err.message);
    }
    testClassesResult = testClassesResult.sort((a, b) => {
      return a.localeCompare(b);
    });
    if (!this.flags.json) {
      this.ux.log(testClassesResult.join(','));
    }
    return testClassesResult;
  }

  private validateOutputPath(): void {
    if (this.flags.outputfile) {
      try {
        this.flags.outputfile = PathUtils.getAbsolutePath(this.flags.outputfile);
      } catch (error) {
        const err = error as Error;
        throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--outputpath', err.message]));
      }
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
