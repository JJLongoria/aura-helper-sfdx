import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { XMLCompressor } from '@aurahelper/xml-compressor';
import { CoreUtils, FileChecker, XMLCompressorStatus } from '@aurahelper/core';
import CommandUtils from '../../../../libs/utils/commandUtils';
const Validator = CoreUtils.Validator;
const MathUtils = CoreUtils.MathUtils;

const sortOrderValues: string[] = Object.values(XMLCompressor.getSortOrderValues()) as string[];

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'compress');
const generalMessages = Messages.loadMessages('aura-helper-sfdx', 'general');

export default class Compress extends SfdxCommand {
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
      description: messages.getMessage('sortOrderFlagDescription'),
      options: sortOrderValues,
      required: false,
      default: XMLCompressor.getSortOrderValues().SIMPLE_FIRST,
    }),
    all: flags.boolean({
      char: 'a',
      description: messages.getMessage('allFlagDescription'),
      exclusive: ['directory', 'file'],
    }),
    directory: flags.array({
      char: 'd',
      description: messages.getMessage('directoryFlagDescription'),
      delimiter: ',',
      helpValue: '<path/to/directory>[,<path/to/directory>,<path/to/directory>]',
      exclusive: ['all', 'file'],
    }),
    file: flags.array({
      char: 'f',
      description: messages.getMessage('fileFlagDescription'),
      delimiter: ',',
      helpValue: '<path/to/file>[,<path/to/file>,<path/to/file>]',
      exclusive: ['all', 'directory'],
    }),
    progress: flags.boolean({
      char: 'p',
      description: generalMessages.getMessage('progressFlagDescription'),
    }),
  };

  public run(): Promise<AnyJson> {
    return new Promise((resolve) => {
      try {
        this.flags.root = Validator.validateFolderPath(this.flags.root);
      } catch (error) {
        const err = error as Error;
        throw new SfdxError(generalMessages.getMessage('wrongRootPathError', [this.flags.root, err.message]));
      }
      if (!FileChecker.isSFDXRootPath(this.flags.root)) {
        throw new SfdxError(generalMessages.getMessage('projectNotFoundError', [this.flags.root]));
      }
      if (this.flags.all === undefined && this.flags.directory === undefined && this.flags.file === undefined) {
        throw new SfdxError(messages.getMessage('missingCompressTargetError'));
      }
      const compressor = new XMLCompressor();
      if (this.flags.all || this.flags.directory) {
        const param = this.flags.all ? '--root' : '--directory';
        compressor.setSortOrder(this.flags.sortorder);
        try {
          const paths: string[] = this.flags.all
            ? CommandUtils.getPaths(this.flags.root, this.flags.root, true)
            : CommandUtils.getPaths(this.flags.directory, this.flags.root, true);
          compressor.addPaths(paths);
        } catch (error) {
          const err = error as Error;
          throw new SfdxError(generalMessages.getMessage('worngParamPath', [param, err.message]));
        }
      } else {
        try {
          this.flags.file = CommandUtils.getPaths(this.flags.file, this.flags.root);
        } catch (error) {
          const err = error as Error;
          throw new SfdxError(generalMessages.getMessage('worngParamPath', ['--file', err.message]));
        }
        compressor.addPaths(this.flags.file);
      }
      if (!this.flags.progress) {
        this.ux.startSpinner(messages.getMessage('compressProgress', [0]));
      }
      let totalFiles = 0;
      let compressed = 0;
      let failed = 0;
      compressor.onCompressFailed((status: XMLCompressorStatus) => {
        const percentage = MathUtils.round((status.filesProcessed / status.totalFiles) * 100, 2);
        totalFiles = status.totalFiles;
        failed++;
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('fileNotCompressed', [status.file, percentage]));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('compressProgress', [percentage]));
        }
      });
      compressor.onCompressSuccess((status: XMLCompressorStatus) => {
        const percentage = MathUtils.round((status.filesProcessed / status.totalFiles) * 100, 2);
        totalFiles = status.totalFiles;
        compressed++;
        if (this.flags.progress) {
          this.ux.log(messages.getMessage('fileCompressed', [status.file, percentage]));
        } else {
          this.ux.setSpinnerStatus(messages.getMessage('compressProgress', [percentage]));
        }
      });
      compressor
        .compress()
        .then(() => {
          if (!this.flags.progress) {
            this.ux.stopSpinner(messages.getMessage('compressedSuccesfully'));
          } else {
            this.ux.log(messages.getMessage('compressedSuccesfully'));
          }
          resolve({
            message: messages.getMessage('compressedSuccesfully'),
            totalFiles,
            compressed,
            failed,
          });
        })
        .catch((error) => {
          const err = error as Error;
          throw new SfdxError(err.message);
        });
    });
  }
}
