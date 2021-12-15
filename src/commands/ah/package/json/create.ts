import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { CoreUtils, FileChecker, MetadataType, PackageGeneratorResult, PathUtils } from '@aurahelper/core';
import { MetadataFactory } from '@aurahelper/metadata-factory';
import { Ignore } from '@aurahelper/ignore';
import { PackageGenerator } from '@aurahelper/package-generator';
const Validator = CoreUtils.Validator;
const ProjectUtils = CoreUtils.ProjectUtils;

const DESTRUCT_BEFORE_FILENAME = 'destructiveChanges.xml';
const DESTRUCT_AFTER_FILENAME = 'destructiveChangesPost.xml';
const PACKAGE_FILENAME = 'package.xml';
const IGNORE_FILE_NAME = '.ahignore.json';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'packageJson');
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
    todelete: flags.boolean({
      char: 'd',
      description: messages.getMessage('toDeleteFlagDescription'),
    }),
    deletebefore: flags.boolean({
      char: 'b',
      description: messages.getMessage('deleteBeforeFlagDescription'),
    }),
    source: flags.filepath({
      char: 's',
      description: messages.getMessage('sourceFlagDescription'),
      helpValue: '<path/to/metadata/json>',
      required: true,
    }),
    useignore: flags.boolean({
      char: 'u',
      description: messages.getMessage('useIgnoreFlagDescription'),
    }),
    ignorefile: flags.filepath({
      char: 'i',
      description: messages.getMessage('ignoreFileFlagDescription'),
      helpValue: '<path/to/ignore/file>',
    }),
    wildcards: flags.boolean({
      char: 'w',
      description: messages.getMessage('wildcardsFlagDescription'),
    }),
    progress: flags.boolean({
      char: 'p',
      description: generalMessages.getMessage('progressFlagDescription'),
    }),
    apiversion: flags.builtin(),
  };

  public run(): Promise<PackageGeneratorResult> {
    return new Promise<PackageGeneratorResult>((resolve) => {
      this.validateProjectPath();
      this.validateOutputPath();
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('runningCreatePackageMessage'));
      } else {
        this.ux.startSpinner(messages.getMessage('runningCreatePackageMessage'));
      }
      this.validateIgnoreFiles();
      try {
        try {
          if (this.flags.progress) {
            this.ux.log(messages.getMessage('readingJSONFileMessage'));
          } else {
            this.ux.startSpinner(messages.getMessage('readingJSONFileMessage'));
          }
          let metadataTypes = MetadataFactory.deserializeMetadataTypes(
            Validator.validateMetadataJSON(this.flags.source)
          );
          if (this.flags.userignore) {
            if (this.flags.progress) {
              this.ux.log(messages.getMessage('validateIgnoreFiles'));
            } else {
              this.ux.setSpinnerStatus(messages.getMessage('validateIgnoreFiles'));
            }
            metadataTypes = new Ignore(this.flags.ignorefile).ignoreMetadata(metadataTypes);
          }
          const result = this.createPackages(metadataTypes);
          resolve(result);
        } catch (error) {
          const err = error as Error;
          throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--source', err.message]));
        }
      } catch (error) {
        const err = error as Error;
        throw new SfdxError(err.message);
      }
    });
  }

  private createPackages(metadataTypes: { [key: string]: MetadataType }): PackageGeneratorResult {
    const result = new PackageGeneratorResult();
    const packageGenerator = new PackageGenerator(
      this.flags.apiversion || ProjectUtils.getProjectConfig(this.flags.root).sourceApiVersion
    ).setExplicit();
    if (!this.flags.todelete) {
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('creatingFileMessage', [PACKAGE_FILENAME]));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('creatingFileMessage', [PACKAGE_FILENAME]));
      }
      result.package = packageGenerator.createPackage(metadataTypes, this.flags.outputpath);
    } else {
      if (this.flags.deletebefore) {
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('creatingFileMessage', [DESTRUCT_BEFORE_FILENAME]));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('creatingFileMessage', [DESTRUCT_BEFORE_FILENAME]));
        }
        result.destructiveChanges = packageGenerator.createBeforeDeployDestructive(
          metadataTypes,
          this.flags.outputpath
        );
      } else {
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('creatingFileMessage', [DESTRUCT_AFTER_FILENAME]));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('creatingFileMessage', [DESTRUCT_AFTER_FILENAME]));
        }
        result.destructiveChangesPost = packageGenerator.createAfterDeployDestructive(
          metadataTypes,
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

  private validateOutputPath(): void {
    try {
      this.flags.outputpath = PathUtils.getAbsolutePath(this.flags.outputpath);
    } catch (error) {
      const err = error as Error;
      throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--outputpath', err.message]));
    }
  }

  private validateIgnoreFiles(): void {
    if (this.flags.useignore) {
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('validateIgnoreFileMessage'));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('validateIgnoreFileMessage'));
      }
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
    }
  }
}
