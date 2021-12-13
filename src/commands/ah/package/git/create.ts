import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { SFConnector } from '@aurahelper/connector';
import { CoreUtils, FileChecker, GitDiff, PackageGeneratorResult, PathUtils, TypesFromGit } from '@aurahelper/core';
import { MetadataFactory } from '@aurahelper/metadata-factory';
import { GitManager } from '@aurahelper/git-manager';
import { Ignore } from '@aurahelper/ignore';
import { PackageGenerator } from '@aurahelper/package-generator';
const Validator = CoreUtils.Validator;
const ProjectUtils = CoreUtils.ProjectUtils;
let gitManager: GitManager;

const DESTRUCT_BEFORE_FILENAME = 'destructiveChanges.xml';
const DESTRUCT_AFTER_FILENAME = 'destructiveChangesPost.xml';
const PACKAGE_FILENAME = 'package.xml';
const IGNORE_FILE_NAME = '.ahignore.json';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'packageGit');
const generalMessages = Messages.loadMessages('aura-helper-sfdx', 'general');

export default class Create extends SfdxCommand {
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
    outputpath: flags.filepath({
      description: messages.getMessage('outputPathFlagDescription'),
      helpValue: '<target/files/path>',
      default: './manifest',
    }),
    filetype: flags.enum({
      char: 'f',
      description: messages.getMessage('fileTypeFlagDesciption'),
      helpValue: '<fileTypeValue>',
      default: 'both',
      options: ['package', 'p', 'destructive', 'd', 'both', 'b'],
    }),
    deletebefore: flags.boolean({
      char: 'b',
      description: messages.getMessage('deleteBeforeFlagDescription'),
    }),
    source: flags.string({
      char: 's',
      description: messages.getMessage('sourceFlagDescription'),
    }),
    target: flags.string({
      char: 't',
      description: messages.getMessage('targetFlagDescription'),
    }),
    raw: flags.boolean({
      char: 'r',
      description: messages.getMessage('rawFlagDescription'),
    }),
    useignore: flags.boolean({
      char: 'u',
      description: messages.getMessage('useIgnoreFlagDescription'),
    }),
    ignorefile: flags.filepath({
      char: 'i',
      description: messages.getMessage('ignoreFileFlagDescription'),
      helpValue: '<path/to/ignore/file>',
      dependsOn: ['useignore'],
    }),
    ignoredestructive: flags.boolean({
      description: messages.getMessage('ignoreDestructiveFlagDescription'),
      dependsOn: ['useignore'],
    }),
    destructiveignorefile: flags.filepath({
      description: messages.getMessage('destructiveIgnoreFileFlagDescription'),
      helpValue: '<path/to/ignore/file>',
      dependsOn: ['useignore', 'ignoredestructive'],
    }),
    progress: flags.boolean({
      char: 'p',
      description: generalMessages.getMessage('progressFlagDescription'),
    }),
    apiversion: flags.builtin(),
  };

  public async run(): Promise<TypesFromGit | PackageGeneratorResult> {
    this.validateProjectPath();
    try {
      this.flags.outputPath = PathUtils.getAbsolutePath(this.flags.outputPath);
    } catch (error) {
      const err = error as Error;
      throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--outputpath', err.message]));
    }
    this.validateIgnoreFiles();
    try {
      gitManager = new GitManager(this.flags.root);
      if (!this.flags.source || this.flags.source === 'this') {
        this.flags.source = await this.getActiveBranch();
      }
      const gitDiffs = await this.getGitDiffs();
      let typesFromGit = await this.analyzeGitDiffs(gitDiffs);
      if (this.flags.useignore) {
        typesFromGit = await this.ignoreMetadata(typesFromGit);
      }
      if (this.flags.json && this.flags.raw) {
        return typesFromGit;
      } else {
        return this.createPackages(typesFromGit);
      }
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

  private createPackages(typesFromGit: TypesFromGit): PackageGeneratorResult {
    const result = new PackageGeneratorResult();
    const packageGenerator = new PackageGenerator(this.flags.apiversion).setExplicit();
    if (
      this.flags.filetype === 'package' ||
      this.flags.filetype === 'p' ||
      this.flags.filetype === 'both' ||
      this.flags.filetype === 'b'
    ) {
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('creatingFileMessage', [PACKAGE_FILENAME]));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('creatingFileMessage', [PACKAGE_FILENAME]));
      }
      result.package = packageGenerator.createPackage(typesFromGit.toDeploy, this.flags.outputpath);
    } else if (
      this.flags.filetype === 'destructive' ||
      this.flags.filetype === 'd' ||
      this.flags.filetype === 'both' ||
      this.flags.filetype === 'b'
    ) {
      if (this.flags.deletebefore) {
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('creatingFileMessage', [DESTRUCT_BEFORE_FILENAME]));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('creatingFileMessage', [DESTRUCT_BEFORE_FILENAME]));
        }
        result.destructiveChanges = packageGenerator.createBeforeDeployDestructive(
          typesFromGit.toDelete,
          this.flags.outputpath
        );
      } else {
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('creatingFileMessage', [DESTRUCT_AFTER_FILENAME]));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('creatingFileMessage', [DESTRUCT_AFTER_FILENAME]));
        }
        result.destructiveChangesPost = packageGenerator.createAfterDeployDestructive(
          typesFromGit.toDeploy,
          this.flags.outputpath
        );
      }
    }
    if (this.flags.progress) {
      this.ux.log(messages.getMessage('filesCreatedMessage', [this.flags.outputpath]));
    } else {
      this.ux.stopSpinner(messages.getMessage('filesCreatedMessage', [this.flags.outputpath]));
    }
    return result;
  }

  private validateIgnoreFiles(): void {
    if (this.flags.useignore) {
      if (!this.flags.ignorefile) {
        this.flags.ignorefile = (this.flags.root as string) + '/' + IGNORE_FILE_NAME;
      }
      try {
        Validator.validateJSONFile(this.flags.ignorefile);
        this.flags.ignorefile = PathUtils.getAbsolutePath(this.flags.ignorefile);
      } catch (error) {
        const err = error as Error;
        throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--ignorefile', err.message]));
      }
      if (this.flags.ignoredestructive && this.flags.destructiveignorefile) {
        try {
          Validator.validateJSONFile(this.flags.destructiveignorefile);
          this.flags.destructiveignorefile = PathUtils.getAbsolutePath(this.flags.destructiveignorefile);
        } catch (error) {
          const err = error as Error;
          throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--destructiveignorefile', err.message]));
        }
      }
    }
  }

  private ignoreMetadata(typesFromGit: TypesFromGit): Promise<TypesFromGit> {
    return new Promise<TypesFromGit>((resolve, reject) => {
      try {
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('analyzingDiffMessage'));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('analyzingDiffMessage'));
        }
        const ignorePackage = new Ignore(this.flags.ignorefile);
        const ignoreDestructive = new Ignore(this.flags.destructiveignorefile || this.flags.ignorefile);
        if (typesFromGit.toDeploy) {
          typesFromGit.toDeploy = ignorePackage.ignoreMetadata(typesFromGit.toDeploy);
        }
        if (typesFromGit.toDelete) {
          typesFromGit.toDelete = ignoreDestructive.ignoreMetadata(typesFromGit.toDelete);
        }
        resolve(typesFromGit);
      } catch (error) {
        reject(error);
      }
    });
  }

  private analyzeGitDiffs(gitDiffs: GitDiff[]): Promise<TypesFromGit> {
    return new Promise<TypesFromGit>((resolve, reject) => {
      const alias = ProjectUtils.getOrgAlias(this.flags.root);
      const namespace = ProjectUtils.getOrgNamespace(this.flags.root);
      const connector = new SFConnector(alias, undefined, this.flags.root, namespace);
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('describeLocalTypesMessage'));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('describeLocalTypesMessage'));
      }
      connector
        .listMetadataTypes()
        .then((metadataDetails) => {
          const folderMetadataMap = MetadataFactory.createFolderMetadataMap(metadataDetails);
          if (this.flags.progress) {
            this.ux.log(messages.getMessage('analyzingDiffMessage'));
          } else {
            this.ux.setSpinnerStatus(messages.getMessage('analyzingDiffMessage'));
          }
          const metadataFromGitDiffs = MetadataFactory.createMetadataTypesFromGitDiffs(
            this.flags.root,
            gitDiffs,
            folderMetadataMap
          );
          resolve(metadataFromGitDiffs);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private getActiveBranch(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('getActiveBranchMessage'));
      } else {
        this.ux.startSpinner(messages.getMessage('getActiveBranchMessage'));
      }
      gitManager
        .getBranches()
        .then((branches) => {
          for (const branch of branches) {
            if (branch.active) {
              resolve(branch.name);
              break;
            }
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private getGitDiffs(): Promise<GitDiff[]> {
    return new Promise<GitDiff[]>((resolve, reject) => {
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('runningGitDiffMessage'));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('runningGitDiffMessage'));
      }
      gitManager
        .getDiffs(this.flags.source, this.flags.target)
        .then((gitDiffs) => {
          resolve(gitDiffs);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
