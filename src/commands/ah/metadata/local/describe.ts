import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { SFConnector } from '@aurahelper/connector';
import { CoreUtils, FileChecker, MetadataType } from '@aurahelper/core';
import { MetadataFactory } from '@aurahelper/metadata-factory';
import CommandUtils from '../../../../libs/utils/commandUtils';
const Validator = CoreUtils.Validator;
const ProjectUtils = CoreUtils.ProjectUtils;
const Utils = CoreUtils.Utils;

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'localDescribe');
const generalMessages = Messages.loadMessages('aura-helper-sfdx', 'general');

export default class Describe extends SfdxCommand {
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
      helpValue: '<MetadataTypeName>[,<MetadataTypeName>...]',
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

  public async run(): Promise<{ [key: string]: MetadataType }> {
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
      throw new SfdxError(messages.getMessage('missingTypesToDescribeError'));
    }
    const alias = ProjectUtils.getOrgAlias(this.flags.root);
    const namespace = ProjectUtils.getOrgNamespace(this.flags.root);
    const connector = new SFConnector(alias, undefined, this.flags.root, namespace);
    if (this.flags.progress) {
      this.ux.log(generalMessages.getMessage('gettingAvailableMetadataTypesMessage'));
    } else {
      this.ux.startSpinner(generalMessages.getMessage('gettingAvailableMetadataTypesMessage'));
    }
    const metadataDetails = await connector.listMetadataTypes();
    if (this.flags.progress) {
      this.ux.log(messages.getMessage('describeLocalTypesMessage'));
    } else {
      this.ux.startSpinner(messages.getMessage('describeLocalTypesMessage'));
    }
    const folderMetadataMap = MetadataFactory.createFolderMetadataMap(metadataDetails);
    const metadataFromFileSystem = MetadataFactory.createMetadataTypesFromFileSystem(
      folderMetadataMap,
      this.flags.root,
      this.flags.group
    );
    let metadata: { [key: string]: MetadataType } = {};
    if (this.flags.all) {
      metadata = metadataFromFileSystem;
    } else if (this.flags.type) {
      const types = CommandUtils.getTypes(this.flags.type);
      for (const type of types) {
        if (metadataFromFileSystem[type]) {
          metadata[type] = metadataFromFileSystem[type];
        }
      }
    }
    if (!this.flags.json) {
      if (metadata && Utils.hasKeys(metadata)) {
        if (this.flags.csv) {
          const csvData = transformDataToCSV(metadata);
          this.ux.log(csvData);
        } else {
          const datatable = transformMetadataToTable(metadata);
          this.ux.table(datatable, {
            columns: [
              {
                key: 'type',
                label: 'Metadata Type',
              },
              {
                key: 'object',
                label: 'Metadata Object',
              },
              {
                key: 'item',
                label: 'Metadata Item',
              },
              {
                key: 'path',
                label: 'Path',
              },
            ],
          });
        }
      } else {
        this.ux.log(messages.getMessage('noDataToShowError'));
      }
    }
    return metadata;
  }
}

function transformMetadataToTable(metadata: { [key: string]: MetadataType }): AnyJson[] {
  const result: AnyJson[] = [];
  for (const metadataTypeName of Object.keys(metadata)) {
    const metadataType = metadata[metadataTypeName];
    if (metadataType.hasChilds()) {
      for (const metadataObjectName of metadataType.getChildKeys()) {
        const metadataObject = metadataType.getChild(metadataObjectName);
        if (metadataObject && metadataObject.hasChilds()) {
          for (const metadataItemName of metadataObject.getChildKeys()) {
            const metadataItem = metadataObject.getChild(metadataItemName);
            if (metadataItem) {
              result.push({
                type: metadataTypeName,
                object: metadataObjectName,
                item: metadataItemName,
                path: metadataItem.path,
              });
            }
          }
        } else if (metadataObject) {
          result.push({
            type: metadataTypeName,
            object: metadataObjectName,
            path: metadataObject.path,
          });
        }
      }
    } else {
      result.push({
        type: metadataTypeName,
        path: metadataType.path,
      });
    }
  }
  return result;
}

function transformDataToCSV(metadata: { [key: string]: MetadataType }): string {
  let result = 'Metadata Type;Metadata Object;Metadata Item;Path';
  for (const metadataTypeName of Object.keys(metadata)) {
    const metadataType = metadata[metadataTypeName];
    if (metadataType.hasChilds()) {
      for (const metadataObjectName of metadataType.getChildKeys()) {
        const metadataObject = metadataType.getChild(metadataObjectName);
        if (metadataObject && metadataObject.hasChilds()) {
          for (const metadataItemName of metadataObject.getChildKeys()) {
            const metadataItem = metadataObject.getChild(metadataItemName);
            if (metadataItem) {
              result +=
                '\n' + metadataTypeName + ';' + metadataObjectName + ';' + metadataItemName + ';' + metadataItem.path;
            }
          }
        } else if (metadataObject) {
          result += '\n' + metadataTypeName + ';' + metadataObjectName + ';;' + metadataObject.path;
        }
      }
    } else {
      result += '\n' + metadataTypeName + ';;;' + metadataType.path;
    }
  }
  return result;
}
