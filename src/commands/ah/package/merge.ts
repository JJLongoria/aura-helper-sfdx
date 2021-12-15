import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { CoreUtils, FileChecker, PackageGeneratorResult, PathUtils } from '@aurahelper/core';
import { PackageGenerator } from '@aurahelper/package-generator';
import CommandUtils from '../../../libs/utils/commandUtils';
const Validator = CoreUtils.Validator;
const ProjectUtils = CoreUtils.ProjectUtils;

const IGNORE_FILE_NAME = '.ahignore.json';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'packageMerge');
const generalMessages = Messages.loadMessages('aura-helper-sfdx', 'general');

export default class Merge extends SfdxCommand {
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
    source: flags.array({
      char: 's',
      description: messages.getMessage('sourceFlagDescription'),
      helpValue: '<path/to/package/file>,<path/to/package/file>,[<path/to/destructive/file>...]',
      required: true,
      delimiter: ',',
    }),
    bytype: flags.boolean({
      description: messages.getMessage('byTypeFlagDescription'),
      exclusive: ['fullpackage', 'fulldestructive', 'onlypackage', 'onlydestructive'],
    }),
    onlypackage: flags.boolean({
      description: messages.getMessage('onlyPackageFlagDescription'),
      exclusive: ['fullpackage', 'fulldestructive', 'bytype'],
    }),
    onlydestructive: flags.boolean({
      description: messages.getMessage('onlyDestructiveFlagDescription'),
      exclusive: ['fullpackage', 'fulldestructive', 'bytype'],
    }),
    fullpackage: flags.boolean({
      description: messages.getMessage('fullPackageFlagDescription'),
      exclusive: ['bytype', 'onlypackage', 'onlydestructive'],
    }),
    fulldestructive: flags.boolean({
      description: messages.getMessage('fullDestructiveFlagDescription'),
      exclusive: ['bytype', 'onlypackage', 'onlydestructive'],
    }),
    deletebefore: flags.boolean({
      char: 'b',
      description: messages.getMessage('deleteBeforeFlagDescription'),
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
    ignoredestructive: flags.boolean({
      description: messages.getMessage('ignoreDestructiveFlagDescription'),
    }),
    destructiveignorefile: flags.filepath({
      description: messages.getMessage('destructiveIgnoreFileFlagDescription'),
      helpValue: '<path/to/ignore/file>',
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
          this.flags.source = CommandUtils.getPaths(this.flags.source);
          const sources = this.flags.source as string[];
          if (sources.length < 2) {
            throw new SfdxError(messages.getMessage('lessThanTwoPathsError'));
          }
          const result = this.createPackages(sources);
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

  private createPackages(sources: string[]): PackageGeneratorResult {
    let result = new PackageGeneratorResult();
    const packageGenerator = new PackageGenerator(
      this.flags.apiversion || ProjectUtils.getProjectConfig(this.flags.root).sourceApiVersion
    );
    if (this.flags.useignore) {
      packageGenerator.setIgnoreFile(this.flags.ignorefile);
      if (this.flags.ignoredestructive) {
        packageGenerator.setDestructiveIgnoreFile(this.flags.destructiveignorefile);
      }
    }
    packageGenerator.setBeforeDeploy(this.flags.deletebefore);
    const byTypeDefault =
      !this.flags.onlypackage && !this.flags.onlydestructive && !this.flags.fullpackage && !this.flags.fulldestructive;
    this.flags.bytype = (this.flags.bytype as boolean) || byTypeDefault;
    if (this.flags.bytype) {
      packageGenerator.setMergePackagesFiles().setMergeDestructives();
      result = packageGenerator.mergePackages(sources, this.flags.outputpath);
    } else if (this.flags.onlypackage) {
      packageGenerator.setMergePackagesFiles();
      result = packageGenerator.mergePackages(sources, this.flags.outputpath);
    } else if (this.flags.onlydestructive) {
      packageGenerator.setMergeDestructives();
      result = packageGenerator.mergePackages(sources, this.flags.outputpath);
    } else if (this.flags.fullpackage) {
      result = packageGenerator.mergePackagesFull(sources, this.flags.outputpath);
    } else if (this.flags.fulldestructive) {
      packageGenerator.setIsDestructive();
      result = packageGenerator.mergePackagesFull(sources, this.flags.outputpath);
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

  private validateIgnoreFiles(): void {
    if (this.flags.useignore) {
      if (this.flags.progress) {
        this.ux.log(messages.getMessage('validateIgnoreFilesMessage'));
      } else {
        this.ux.setSpinnerStatus(messages.getMessage('validateIgnoreFilesMessage'));
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

  private validateOutputPath(): void {
    try {
      this.flags.outputpath = PathUtils.getAbsolutePath(this.flags.outputpath);
    } catch (error) {
      const err = error as Error;
      throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--outputpath', err.message]));
    }
  }
}
