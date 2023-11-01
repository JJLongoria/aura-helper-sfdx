import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { CoreUtils, FileChecker, FileWriter, MetadataType, PathUtils } from '@aurahelper/core';
import { AnyJson } from '@salesforce/ts-types';
import { XMLCompressor } from '@aurahelper/xml-compressor';
import { SFConnector } from '@aurahelper/connector';
import { DependenciesManager } from '@aurahelper/dependencies-manager';
import CommandUtils from '../../../../libs/utils/commandUtils';
const Validator = CoreUtils.Validator;
const ProjectUtils = CoreUtils.ProjectUtils;
const Utils = CoreUtils.Utils;

const sortOrderValues: string[] = Object.values(XMLCompressor.getSortOrderValues()) as string[];
const IGNORE_FILE_NAME = '.ahignore.json';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'repair');
const generalMessages = Messages.loadMessages('aura-helper-sfdx', 'general');

export default class Repair extends SfdxCommand {
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
      description: messages.getMessage('allFlagDescription'),
      exclusive: ['type'],
    }),
    type: flags.array({
      char: 't',
      delimiter: ',',
      description: messages.getMessage('typeFlagDescription'),
      exclusive: ['all'],
      helpValue: '<MetadataTypeName>[,<MetadataTypeName:Object>, <MetadataTypeName:Object:Item>...]',
    }),
    onlycheck: flags.boolean({
      char: 'o',
      description: messages.getMessage('onlyCheckFlagDestription'),
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
    useignore: flags.boolean({
      char: 'u',
      description: messages.getMessage('useIgnoreFlagDescription'),
    }),
    ignorefile: flags.filepath({
      char: 'i',
      description: messages.getMessage('ignoreFileFlagDescription', [IGNORE_FILE_NAME]),
      helpValue: '<path/to/ignore/file>',
    }),
    outputfile: flags.filepath({
      description: generalMessages.getMessage('outputPathFlagDescription'),
      helpValue: '<path/to/output/file>',
    }),
    progress: flags.boolean({
      char: 'p',
      description: generalMessages.getMessage('progressFlagDescription'),
    }),
    apiversion: flags.builtin(),
  };

  public async run(): Promise<AnyJson> {
    this.validateProjectPath();
    if (this.flags.all === undefined && this.flags.type === undefined) {
      throw new SfdxError(messages.getMessage('missingTypesToRepairError'));
    }
    if (this.flags.outputfile) {
      try {
        this.flags.outputfile = PathUtils.getAbsolutePath(this.flags.outputfile);
      } catch (error) {
        const err = error as Error;
        throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--outputfile', err.message]));
      }
    }
    if (this.flags.progress) {
      this.ux.log(messages.getMessage(this.flags.onlycheck ? 'runningCheckMessage' : 'runningRepairMessage'));
    } else {
      this.ux.startSpinner(messages.getMessage(this.flags.onlycheck ? 'runningCheckMessage' : 'runningRepairMessage'));
    }
    this.validateIgnoreFiles();
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
      const metadataDetails = await connector.listMetadataTypes();
      const manager = new DependenciesManager(this.flags.root, metadataDetails);
      manager
        .setTypesToRepair(types)
        .setCompress(this.flags.compress)
        .setSortOrder(this.flags.sortorder)
        .setIgnoreFile(this.flags.useignore ? this.flags.ignorefile : undefined);
      manager.onStartObject((status) => {
        if (this.flags.progress) {
          if (this.flags.progress) {
            this.ux.log(messages.getMessage('processingObjectMessage', [status.entityObject, status.entityType]));
          } else {
            this.ux.setSpinnerStatus(
              messages.getMessage('processingObjectMessage', [status.entityObject, status.entityType])
            );
          }
        }
      });
      manager.onStartItem((status) => {
        if (this.flags.progress) {
          if (this.flags.progress) {
            this.ux.log(
              messages.getMessage('processingItemMessage', [status.entityItem, status.entityObject, status.entityType])
            );
          } else {
            this.ux.setSpinnerStatus(
              messages.getMessage('processingItemMessage', [status.entityItem, status.entityObject, status.entityType])
            );
          }
        }
      });
      let result: AnyJson;
      if (this.flags.onlycheck) {
        result = Utils.clone(manager.checkErrors()) as AnyJson;
      } else {
        result = Utils.clone(manager.repairDependencies()) as AnyJson;
      }
      if (this.flags.outputfile) {
        const baseDir = PathUtils.getDirname(this.flags.outputfile);
        if (!FileChecker.isExists(baseDir)) {
          FileWriter.createFolderSync(baseDir);
        }
        FileWriter.createFileSync(this.flags.outputfile, JSON.stringify(result, null, 2));
        if (this.flags.progress) {
          this.ux.log(generalMessages.getMessage('outputSavedMessage', [this.flags.outputfile]));
        } else {
          this.ux.stopSpinner(generalMessages.getMessage('outputSavedMessage', [this.flags.outputfile]));
        }
      }
      return result;
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
