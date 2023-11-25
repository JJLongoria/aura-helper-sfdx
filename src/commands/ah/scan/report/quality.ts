/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from "@salesforce/command";
import { Messages, SfdxError } from "@salesforce/core";
import { CoreUtils, FileChecker, FileReader, FileWriter, PathUtils } from '@aurahelper/core';
import { QualityGate } from '../../../../libs/utils/codeScanValues';

const ProjectUtils = CoreUtils.ProjectUtils;
const Validator = CoreUtils.Validator;

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'scanReportQuality');
const generalMessages = Messages.loadMessages('aura-helper-sfdx', 'general');

export default class Quality extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');
  public static examples = messages.getMessage('examples').split(os.EOL);
  public static enableJsonFlag = false;

  protected static flagsConfig: FlagsConfig = {
    root: flags.directory({
      char: 'r',
      description: generalMessages.getMessage('rootFlagDescription'),
      default: './',
      required: false,
      helpValue: '<path/to/project/root>',
    }),
    interactive: flags.boolean({
      char: 'i',
      description: messages.getMessage('interactiveFlagDescription'),
      default: true,
      required: false,
      allowNo: true,
    }),
    maxdebt: flags.string({
      description: messages.getMessage('maxDebtFlagDescription'),
      required: false,
      helpValue: '<1Y 1M 1W 1D 1h 1m>',
    }),
    maxbugs: flags.integer({
      description: messages.getMessage('maxBugsFlagDescription'),
      required: false,
      helpValue: '<number>',
    }),
    maxblockers: flags.integer({
      description: messages.getMessage('maxBlockersFlagDescription'),
      required: false,
      helpValue: '<number>',
    }),
    maxcriticals: flags.integer({
      description: messages.getMessage('maxCriticalsFlagDescription'),
      required: false,
      helpValue: '<number>',
    }),
    maxmajors: flags.integer({
      description: messages.getMessage('maxMajorsFlagDescription'),
      required: false,
      helpValue: '<number>',
    }),
    maxminors: flags.integer({
      description: messages.getMessage('maxMinorsFlagDescription'),
      required: false,
      helpValue: '<number>',
    }),
    maxinfos: flags.integer({
      description: messages.getMessage('maxInfosFlagDescription'),
      required: false,
      helpValue: '<number>',
    }),
  };

  public async run(): Promise<QualityGate> {
    this.validateProjectPath();
    let qualityGate = getCustomQualityGate(this.flags.root) ?? ({} as QualityGate);
    if (this.flags.interactive) {
      this.log(
        'Configuring Custom Quality Report to the selected project. Please enter the following values for the Quality Gate: '
      );
      this.log(
        '\t- Max Technical Debt: The maximum amount of technical debt that can be introduced in the project. Duration format like: 1d 3h 30m. Use Y or y for years, M for months, W or w for weeks, d or D for days, h or H for hours, m for minutes'
      );
      this.log('\t- Max Bugs: The maximum number of bugs that can be introduced in the project');
      this.log('\t- Max Blocker Issues: The maximum number of blocker issues that can be introduced in the project');
      this.log('\t- Max Critical Issues: The maximum number of critical issues that can be introduced in the project');
      this.log('\t- Max Major Issues: The maximum number of major issues that can be introduced in the project');
      this.log('\t- Max Minor Issues: The maximum number of minor issues that can be introduced in the project');
      this.log('\t- Max Info Issues: The maximum number of info issues that can be introduced in the project');
      Quality.enableJsonFlag = false;
      qualityGate = await this.runInteractive(qualityGate);
    } else {
      qualityGate.maxDebt = this.flags.maxdebt;
      qualityGate.maxBugs = this.flags.maxbugs;
      qualityGate.maxBlockers = this.flags.maxblockers;
      qualityGate.maxCriticals = this.flags.maxcriticals;
      qualityGate.maxMajors = this.flags.maxmajors;
      qualityGate.maxMinors = this.flags.maxminors;
      qualityGate.maxInfos = this.flags.maxinfos;
    }
    saveCustomQualityGate(this.flags.root, qualityGate);
    if (!this.flags.json) {
      this.log('Quality Gate saved successfully');
    }
    return qualityGate;
  }

  // eslint-disable-next-line complexity
  private async runInteractive(qualityGate: QualityGate): Promise<QualityGate> {
    let correctDeb = true;
    let maxDebt = '';
    do {
      correctDeb = true;
      maxDebt = await this.ux.prompt('maxDebt', {
        type: 'normal',
        prompt: 'Max Technical Debt. Empty for no limit.',
        default: qualityGate.maxDebt ?? undefined,
        required: false,
      });
      if (maxDebt) {
        const splits = maxDebt.split(' ');
        for (const split of splits) {
          if (split && !/^[0-9]+[yYmMdDhHwW]$/.exec(split)) {
            correctDeb = false;
          }
        }
      }
    } while (!correctDeb);
    qualityGate.maxDebt = maxDebt;

    let correctBugs = true;
    let maxBugs = '';
    do {
      correctBugs = true;
      maxBugs = await this.ux.prompt('maxBugs', {
        type: 'normal',
        prompt: 'Max Bugs. Empty for no limit.',
        default: qualityGate?.maxBugs?.toString() ?? undefined,
        required: false,
      });
      if (maxBugs && !/^[0-9]+$/.exec(maxBugs)) {
        correctBugs = false;
      }
    } while (!correctBugs);
    qualityGate.maxBugs = maxBugs ? parseInt(maxBugs, 10) : undefined;

    let correctBlockers = true;
    let maxBlockers = '';
    do {
      correctBlockers = true;
      maxBlockers = await this.ux.prompt('maxBlockers', {
        type: 'normal',
        prompt: 'Max Blocker Issues. Empty for no limit.',
        default: qualityGate?.maxBlockers?.toString() ?? undefined,
        required: false,
      });
      if (maxBlockers && !/^[0-9]+$/.exec(maxBlockers)) {
        correctBlockers = false;
      }
    } while (!correctBlockers);
    qualityGate.maxBlockers = maxBlockers ? parseInt(maxBlockers, 10) : undefined;

    let correctCriticals = true;
    let maxCriticals = '';
    do {
      correctCriticals = true;
      maxCriticals = await this.ux.prompt('maxCriticals', {
        type: 'normal',
        prompt: 'Max Critical Issues. Empty for no limit.',
        default: qualityGate?.maxCriticals?.toString() ?? undefined,
        required: false,
      });
      if (maxCriticals && !/^[0-9]+$/.exec(maxCriticals)) {
        correctCriticals = false;
      }
    } while (!correctCriticals);
    qualityGate.maxCriticals = maxCriticals ? parseInt(maxCriticals, 10) : undefined;

    let correctMajors = true;
    let maxMajors = '';
    do {
      correctMajors = true;
      maxMajors = await this.ux.prompt('maxMajors', {
        type: 'normal',
        prompt: 'Max Major Issues. Empty for no limit.',
        default: qualityGate?.maxMajors?.toString() ?? undefined,
        required: false,
      });
      if (maxMajors && !/^[0-9]+$/.exec(maxMajors)) {
        correctMajors = false;
      }
    } while (!correctMajors);
    qualityGate.maxMajors = maxMajors ? parseInt(maxMajors, 10) : undefined;

    let correctMinors = true;
    let maxMinors = '';
    do {
      correctMinors = true;
      maxMinors = await this.ux.prompt('maxMinors', {
        type: 'normal',
        prompt: 'Max Minor Issues. Empty for no limit.',
        default: qualityGate?.maxMinors?.toString() ?? undefined,
        required: false,
      });
      if (maxMinors && !/^[0-9]+$/.exec(maxMinors)) {
        correctMinors = false;
      }
    } while (!correctMinors);
    qualityGate.maxMinors = maxMinors ? parseInt(maxMinors, 10) : undefined;

    let correctInfos = true;
    let maxInfos = '';
    do {
      correctInfos = true;
      maxInfos = await this.ux.prompt('maxInfos', {
        type: 'normal',
        prompt: 'Max Info Issues. Empty for no limit.',
        default: qualityGate?.maxInfos?.toString() ?? undefined,
        required: false,
      });
      if (maxInfos && !/^[0-9]+$/.exec(maxInfos)) {
        correctInfos = false;
      }
    } while (!correctInfos);
    qualityGate.maxInfos = maxInfos ? parseInt(maxInfos, 10) : undefined;
    return qualityGate;
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

function getCustomQualityGate(root: string): QualityGate | undefined {
  const alias = ProjectUtils.getOrgAlias(root ?? '');
  const auraHelperFolder = PathUtils.getAuraHelperSFDXTempFilesPath();
  const filePath = `${auraHelperFolder}/QualityGates/${alias}.json`;
  if (FileChecker.isExists(filePath)) {
    const data = JSON.parse(FileReader.readFileSync(filePath)) as QualityGate;
    return data;
  }
  return undefined;
}

function saveCustomQualityGate(root: string, qualityGate: QualityGate): void {
  const alias = ProjectUtils.getOrgAlias(root ?? '');
  const auraHelperFolder = PathUtils.getAuraHelperSFDXTempFilesPath();
  const folderPath = `${auraHelperFolder}/QualityGates`;
  if (!FileChecker.isExists(folderPath)) {
    FileWriter.createFolderSync(folderPath);
  }
  const filePath = `${folderPath}/${alias}.json`;
  FileWriter.createFileSync(filePath, JSON.stringify(qualityGate));
}
