import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { XMLCompressor } from '@aurahelper/xml-compressor';
import { SFConnector } from '@aurahelper/connector';
import * as IgnoreLib from '@aurahelper/ignore';
import { CoreUtils, FileChecker, PathUtils } from '@aurahelper/core';
import CommandUtils from '../../../../libs/utils/commandUtils';
const Validator = CoreUtils.Validator;
const ProjectUtils = CoreUtils.ProjectUtils;
const MetadataIgnore = IgnoreLib.Ignore;

const sortOrderValues: string[] = Object.values(XMLCompressor.getSortOrderValues()) as string[];
const IGNORE_FILE_NAME = '.ahignore.json';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'ignore');
const generalMessages = Messages.loadMessages('aura-helper-sfdx', 'general');

export default class Ignore extends SfdxCommand {
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
    sortorder: flags.enum({
      char: 's',
      description: generalMessages.getMessage('sortOrderFlagDescription'),
      options: sortOrderValues,
      required: false,
      default: XMLCompressor.getSortOrderValues().SIMPLE_FIRST,
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
      helpValue: '<MetadataTypeName>[,<MetadataTypeName>...]',
    }),
    ignorefile: flags.filepath({
      char: 'i',
      description: messages.getMessage('ignoreFileFlagDescription', [IGNORE_FILE_NAME]),
      default: './' + IGNORE_FILE_NAME,
      required: false,
      helpValue: '<path/to/ignore/file>',
    }),
    compress: flags.boolean({
      char: 'c',
      description: messages.getMessage('compressFlagDescription'),
    }),
    progress: flags.boolean({
      char: 'p',
      description: generalMessages.getMessage('progressFlagDescription'),
    }),
  };

  public async run(): Promise<AnyJson> {
    try {
      this.flags.root = Validator.validateFolderPath(this.flags.root);
    } catch (error) {
      const err = error as Error;
      throw new SfdxError(generalMessages.getMessage('wrongRootPathError', [this.flags.root, err.message]));
    }
    if (!FileChecker.isSFDXRootPath(this.flags.root)) {
      throw new SfdxError(generalMessages.getMessage('projectNotFoundError'));
    }
    if (this.flags.all === undefined && this.flags.type === undefined) {
      throw new SfdxError(messages.getMessage('missingTypesToCompressError'));
    }
    if (!this.flags.ignoreFile) {
      this.flags.ignoreFile = (this.flags.root as string) + '/' + IGNORE_FILE_NAME;
    }
    try {
      Validator.validateJSONFile(this.flags.ignoreFile);
      this.flags.ignoreFile = PathUtils.getAbsolutePath(this.flags.ignoreFile);
    } catch (error) {
      const err = error as Error;
      throw new SfdxError(messages.getMessage('worngIgnoreFilePathError', [err.message]));
    }
    let types;
    if (this.flags.type) {
      types = CommandUtils.getTypes(this.flags.type);
    }
    const alias = ProjectUtils.getOrgAlias(this.flags.root);
    const namespace = ProjectUtils.getOrgNamespace(this.flags.root);
    const connector = new SFConnector(alias, this.flags.apiversion, this.flags.root, namespace);
    if (this.flags.progress) {
      this.ux.log(generalMessages.getMessage('gettingAvailableMetadataTypesMessage'));
    } else {
      this.ux.startSpinner(generalMessages.getMessage('gettingAvailableMetadataTypesMessage'));
    }
    try {
      const metadataDetails = await connector.listMetadataTypes();
      const ignore = new MetadataIgnore(this.flags.ignoreFile);
      ignore.setCompress(this.flags.compress).setSortOrder(this.flags.sortOrder).setTypesToIgnore(types);
      ignore.onStartProcessType((metadataTypeName) => {
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('processingMetadataType', [metadataTypeName]));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('processingMetadataType', [metadataTypeName]));
        }
      });
      ignore.ignoreProjectMetadata(this.flags.root, metadataDetails);
    } catch (error) {
      const err = error as Error;
      throw new SfdxError(err.message);
    }
    if (this.flags.progress) {
      this.ux.log(messages.getMessage('ignoreFinishSuccesfully'));
    } else {
      this.ux.stopSpinner(messages.getMessage('ignoreFinishSuccesfully'));
    }
    return {
      message: messages.getMessage('ignoreFinishSuccesfully'),
    };
  }
}
