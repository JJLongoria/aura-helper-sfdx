import * as os from 'os';
import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import {
  CoreUtils,
  FileChecker,
  FileReader,
  FileWriter,
  PathUtils,
  ProcessFactory,
  ProcessHandler,
} from '@aurahelper/core';
import { GitManager } from '@aurahelper/git-manager';

import { LiveServerParams, shutdown, start } from 'live-server';
import {
  BEST_PRACTICES,
  BUG,
  CATEGORIES,
  CODE_SMELL,
  CODE_STYLE,
  DESIGN,
  DOCUMENTATION,
  ERROR_PRONE,
  HIHG_QUALITY_GATE,
  INSECURE_DEPENDENCIES,
  LANGUAGES,
  LOW_QUALITY_GATE,
  MEDIUM_QUALITY_GATE,
  PERFORMANCE,
  PROBLEM,
  QualityGate,
  SECURITY,
  SECURITY_HOTSPOT,
  STRICT_QUALITY_GATE,
  SUGGESTIONS,
  UNCATALOGUED,
  VULNERABILITY,
} from '../../../../libs/utils/codeScanValues';

import CommandUtils from '../../../../libs/utils/commandUtils';
import { APEX_RULE_DATA } from '../../../../libs/utils/apexRuleData';
import { VF_RULE_DATA } from '../../../../libs/utils/vfRuleData';
import { JS_RULE_DATA } from '../../../../libs/utils/jsRuleData';
import { TS_RULE_DATA } from '../../../../libs/utils/tsRuleData';
import { HTML_RULE_DATA } from '../../../../libs/utils/htmlRuleData';
import { XML_RULE_DATA } from '../../../../libs/utils/xmlRuleData';

const ProjectUtils = CoreUtils.ProjectUtils;
const DateUtils = CoreUtils.DateUtils;
const OSUtils = CoreUtils.OSUtils;
const Utils = CoreUtils.Utils;
const Validator = CoreUtils.Validator;

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('aura-helper-sfdx', 'scanReportRun');
const generalMessages = Messages.loadMessages('aura-helper-sfdx', 'general');

const ICONS: { [key: string]: string } = {
  bug: 'material-symbols:bug-report-rounded',
  vulnerability: 'material-symbols:bomb-rounded',
  security: 'material-symbols:security-rounded',
  debt: 'material-symbols:clock-loader-90',
  'code-smell': 'material-symbols:release-alert-rounded',
  blocker: 'material-symbols:block',
  critical: 'material-symbols:warning-rounded',
  major: 'material-symbols:keyboard-double-arrow-up-rounded',
  minor: 'material-symbols:keyboard-double-arrow-down-rounded',
  info: 'material-symbols:info-rounded',
  duplicate: 'material-symbols:content-copy-rounded',
  design: 'material-symbols:design-services-outline-rounded',
  'best-practices': 'material-symbols:book-2-rounded',
  performance: 'material-symbols:speed-rounded',
  'code-style': 'material-symbols:code-blocks-rounded',
  documentation: 'material-symbols:edit-document-rounded',
  error: 'material-symbols:error-rounded',
  problem: 'material-symbols:problem-rounded',
  suggestion: 'material-symbols:chat-info-rounded',
  'insecure-dependencies': 'material-symbols:package-rounded',
  uncatalogued: 'material-symbols:category-rounded',
};

interface ScannerResponse {
  status: number;
  result: ScannerFile[];
  message?: string;
  warnings?: string[];
}

interface ScannerFile {
  engine: string;
  fileName: string;
  violations: ScannerProblem[];
}

interface ScannerProblem {
  id: string;
  engine: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
  severity: number;
  ruleName: string;
  category: string;
  url: string;
  message: string;
  normalizedSeverity?: number;
  file: string;
  path: string;
  language: string;
  ruleType?: string;
  resolutionTime?: number;
  duration: string;
}

interface ScannerResult {
  debt: number;
  debtDuration: string;
  totalErrors: number;
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
  securityHotspots: number;
  uncatalogued: number;
  blockers: number;
  criticals: number;
  majors: number;
  minors: number;
  infos: number;
  designs: number;
  bestPractices: number;
  securities: number;
  performances: number;
  codeStyles: number;
  documentations: number;
  errors: number;
  problems: number;
  suggestions: number;
  insecureDependencies: number;
  files: number;
  languages: string[];
  rules: string[];
  duplicatedBlocks: number;
  allProblems: ScannerProblem[];
  branch?: string;
  org?: string;
}

export interface AhScanReportFlags {
  root: string;
  progress?: boolean;
  'output-dir': string;
  categories?: string[];
  'pmd-rule-set'?: string;
  'eslint-rule-set'?: string;
  'quality-gate': string;
}

export type AhScanReportRunResult = {
  passed: boolean;
  messages: string[];
  output: string;
  debt: number;
  debtDuration: string;
  totalErrors: number;
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
  uncatalogued: number;
  securityHotspots: number;
  blockers: number;
  criticals: number;
  majors: number;
  minors: number;
  infos: number;
  designs: number;
  bestPractices: number;
  securities: number;
  performances: number;
  codeStyles: number;
  documentations: number;
  errors: number;
  problems: number;
  suggestions: number;
  insecureDependencies: number;
  duplicatedBlocks: number;
  measuresFailed?: string[];
  branch?: string;
  org?: string;
};

export default class Run extends SfdxCommand {
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
    progress: flags.boolean({
      char: 'p',
      description: generalMessages.getMessage('progressFlagDescription'),
    }),
    outputdir: flags.directory({
      char: 'o',
      description: messages.getMessage('outputDirFlagDescription'),
      helpValue: '<path/to/output/file>',
      default: './ScanResult',
    }),
    categories: flags.string({
      description: messages.getMessage('categoriesFlagDescription', [CATEGORIES.join(',')]),
      helpValue: '<category1,category2,...>',
      options: CATEGORIES,
      multiple: true,
    }),
    pmdruleset: flags.filepath({
      description: messages.getMessage('pdmRuleSetFlagDescription'),
      helpValue: '<path/to/pmd/file>',
    }),
    eslintruleset: flags.filepath({
      description: messages.getMessage('eslintRuleSetFlagDescription'),
      helpValue: '<path/to/eslint/file>',
    }),
    qualitygate: flags.string({
      char: 'q',
      description: messages.getMessage('qualityGateFlagDescription', [
        ['Strict', 'High', 'Moderate', 'Relaxed', 'Custom'].join(', '),
      ]),
      helpValue: '<quality-gate>',
      default: 'Relaxed',
    }),
    open: flags.boolean({
      description: messages.getMessage('openFlagDescription'),
    }),
  };

  public async run(): Promise<AhScanReportRunResult> {
    this.validateProjectPath();
    this.validateOutputPath();
    if (this.flags.progress) {
      this.ux.log(messages.getMessage('runningScanMessage'));
    } else {
      this.ux.startSpinner(messages.getMessage('runningScanMessage'));
    }

    if (this.flags.progress) {
      this.ux.log(messages.getMessage('reportSuccessMessage', [this.flags.outputdir]));
    } else {
      this.ux.stopSpinner(messages.getMessage('reportSuccessMessage', [this.flags.outputdir]));
    }
    const scannerResult = await this.runScan();
    const qualityGate = this.getQualityGate();
    const qualityGateResult = this.processQualityGate(scannerResult, qualityGate);
    if (this.flags.progress) {
      this.log(messages.getMessage('message.create-result'));
    } else {
      this.ux.setSpinnerStatus(messages.getMessage('message.create-result'));
    }
    qualityGateResult.output = this.createHtmlPages(scannerResult, qualityGateResult, qualityGate);
    qualityGateResult.output = OSUtils.isWindows()
      ? qualityGateResult.output.replace(/\//g, '\\')
      : qualityGateResult.output;
    this.saveResults(scannerResult, qualityGateResult);
    if (this.flags.progress) {
      this.log(
        messages.getMessage('message.report-success', [
          qualityGateResult.output,
          OSUtils.isWindows() ? qualityGateResult.output + '\\' : qualityGateResult.output + '/',
        ])
      );
    } else {
      this.ux.stopSpinner(
        messages.getMessage('message.report-success', [
          qualityGateResult.output,
          OSUtils.isWindows() ? qualityGateResult.output + '\\' : qualityGateResult.output + '/',
        ])
      );
    }
    if (!this.flags.json && !this.flags.open) {
      this.log(messages.getMessage('message.open-report-command', [qualityGateResult.output]) + '\n');
    }
    if (this.flags.open) {
      this.openReport(qualityGateResult.output);
    }
    return qualityGateResult;
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
      this.flags.outputdir = PathUtils.getAbsolutePath(this.flags.outputdir);
    } catch (error) {
      const err = error as Error;
      if (err?.message.includes('does not exists or not have access to it')) {
        this.flags.outputdir = PathUtils.getAbsolutePath(this.flags.outputdir);
        FileWriter.createFolderSync(this.flags.outputdir);
      } else {
        throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--outputdir', err.message]));
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private openReport(outputPath: string): void {
    const params: LiveServerParams = {
      port: 5000, // Set the server port. Defaults to 8080.
      host: '0.0.0.0', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
      root: outputPath, // Set root directory that's being served. Defaults to cwd.
      open: true, // When false, it won't load your browser by default.
      file: 'index.html', // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
      logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    };
    try {
      this.ux.stopSpinner(messages.getMessage('message.opening-report'));
      start(params);
      shutdown();
    } catch (error) {
      /* empty */
    }
  }

  // eslint-disable-next-line complexity, class-methods-use-this
  private processQualityGate(scannerResult: ScannerResult, qualityGate: QualityGate): AhScanReportRunResult {
    const result: AhScanReportRunResult = {
      passed: true,
      messages: [],
      output: '',
      debt: scannerResult.debt,
      debtDuration: scannerResult.debtDuration,
      totalErrors: scannerResult.totalErrors,
      bugs: scannerResult.bugs,
      vulnerabilities: scannerResult.vulnerabilities,
      codeSmells: scannerResult.codeSmells,
      securityHotspots: scannerResult.securityHotspots,
      uncatalogued: scannerResult.uncatalogued,
      blockers: scannerResult.blockers,
      criticals: scannerResult.criticals,
      majors: scannerResult.majors,
      minors: scannerResult.minors,
      infos: scannerResult.infos,
      designs: scannerResult.designs,
      bestPractices: scannerResult.bestPractices,
      securities: scannerResult.securities,
      performances: scannerResult.performances,
      codeStyles: scannerResult.codeStyles,
      documentations: scannerResult.documentations,
      errors: scannerResult.errors,
      problems: scannerResult.problems,
      suggestions: scannerResult.suggestions,
      insecureDependencies: scannerResult.insecureDependencies,
      duplicatedBlocks: scannerResult.duplicatedBlocks,
      measuresFailed: [],
    } as AhScanReportRunResult;
    const debtStatus = this.getDebtStatus(qualityGate, result);
    const blockersStatus = this.getBlockersStatus(qualityGate, result);
    const criticalsStatus = this.getCriticalsStatus(qualityGate, result);
    const majorsStatus = this.getMajorsStatus(qualityGate, result);
    const minorsStatus = this.getMinorsStatus(qualityGate, result);
    const infosStatus = this.getInfosStatus(qualityGate, result);
    const bugsStatus = this.getBugsStatus(qualityGate, result);
    if (debtStatus === 'Not Passed') {
      result.passed = false;
      result.measuresFailed?.push('Debt');
      result.messages.push(`Quality gate failed: Debt is ${result.debt} and must be less than ${qualityGate.maxDebt}`);
    }
    if (blockersStatus === 'Not Passed') {
      result.passed = false;
      result.measuresFailed?.push('Blockers');
      result.messages.push(
        `Quality gate failed: Blockers count is ${result.blockers} and must be less than ${qualityGate.maxBlockers}`
      );
    }
    if (criticalsStatus === 'Not Passed') {
      result.passed = false;
      result.measuresFailed?.push('Criticals');
      result.messages.push(
        `Quality gate failed: Criticals count is ${result.criticals} and must be less than ${qualityGate.maxCriticals}`
      );
    }
    if (majorsStatus === 'Not Passed') {
      result.passed = false;
      result.measuresFailed?.push('Majors');
      result.messages.push(
        `Quality gate failed: Majors count is ${result.majors} and must be less than ${qualityGate.maxMajors}`
      );
    }
    if (minorsStatus === 'Not Passed') {
      result.passed = false;
      result.measuresFailed?.push('Minors');
      result.messages.push(
        `Quality gate failed: Minors count is ${result.minors} and must be less than ${qualityGate.maxMinors}`
      );
    }
    if (infosStatus === 'Not Passed') {
      result.passed = false;
      result.measuresFailed?.push('Infos');
      result.messages.push(
        `Quality gate failed: Infos count is ${result.infos} and must be less than ${qualityGate.maxInfos}`
      );
    }
    if (bugsStatus === 'Not Passed') {
      result.passed = false;
      result.measuresFailed?.push('Bugs');
      result.messages.push(
        `Quality gate failed: Bugs count is ${result.bugs} and must be less than ${qualityGate.maxBugs}`
      );
    }
    /* if (qualityGate.maxDuplicates !== null && qualityGate?.maxDuplicates !== undefined && qualityGate?.maxDuplicates >= 0) {
      if (scannerResult.duplicatedBlocks > qualityGate.maxDuplicates) {
        result.passed = false;
        result.measuresFailed?.push('Duplicates');
        result.messages.push(`Quality gate failed: Duplicates count is ${scannerResult.duplicatedBlocks} and must be less than ${qualityGate.maxDuplicates}`);
      }
    }*/
    return result;
  }

  private getQualityGate(): QualityGate {
    if (this.flags.qualitygate === 'Strict') {
      return STRICT_QUALITY_GATE;
    } else if (this.flags.qualitygate === 'High') {
      return HIHG_QUALITY_GATE;
    } else if (this.flags.qualitygate === 'Moderate') {
      return MEDIUM_QUALITY_GATE;
    } else if (this.flags.qualitygate === 'Relaxed') {
      return LOW_QUALITY_GATE;
    } else {
      return this.getCustomQualityGate();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getCustomQualityGate(): QualityGate {
    const alias = ProjectUtils.getOrgAlias(this.flags.root ?? '');
    const auraHelperFolder = PathUtils.getAuraHelperSFDXTempFilesPath();
    const filePath = `${auraHelperFolder}/QualityGates/${alias}.json`;
    if (FileChecker.isExists(filePath)) {
      const data = JSON.parse(FileReader.readFileSync(filePath)) as QualityGate;
      return data;
    } else {
      throw new Error(`Not found custom quality gate for ${alias}`);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  /* private getOldResults(flags: Partial<AhScanReportFlags>): ScannerResult | undefined {
    const alias = ProjectUtils.getOrgAlias(flags.root ?? '');
    const auraHelperFolder = PathUtils.getAuraHelperSFDXTempFilesPath();
    const filePath = `${auraHelperFolder}/Reports/${alias}_scan_result.json`;
    if (FileChecker.isExists(filePath)) {
      const data = JSON.parse(FileReader.readFileSync(filePath)) as ScannerResult;
      return data;
    }
    return undefined;
  }*/

  // eslint-disable-next-line class-methods-use-this
  private getOldQualityGatesResult(): AhScanReportRunResult | undefined {
    const alias = ProjectUtils.getOrgAlias(this.flags.root ?? '');
    const auraHelperFolder = PathUtils.getAuraHelperSFDXTempFilesPath();
    const qualityGatePath = `${auraHelperFolder}/Reports/${alias}_quality_result.json`;
    if (FileChecker.isExists(qualityGatePath)) {
      const qualityGate = JSON.parse(FileReader.readFileSync(qualityGatePath)) as AhScanReportRunResult;
      return qualityGate;
    }
    return undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  private saveResults(result: ScannerResult, qualityGateResult: AhScanReportRunResult): void {
    const alias = ProjectUtils.getOrgAlias(this.flags.root ?? '');
    const auraHelperFolder = PathUtils.getAuraHelperSFDXTempFilesPath();
    const reportsFolder = `${auraHelperFolder}/Reports`;
    if (!FileChecker.isExists(reportsFolder)) {
      FileWriter.createFolderSync(reportsFolder);
    }
    FileWriter.createFileSync(`${reportsFolder}/${alias}_scan_result.json`, JSON.stringify(result));
    FileWriter.createFileSync(`${reportsFolder}/${alias}_quality_result.json`, JSON.stringify(qualityGateResult));
  }

  // eslint-disable-next-line complexity, class-methods-use-this
  private async runScan(): Promise<ScannerResult> {
    const git = new GitManager(this.flags.root ?? '');
    let activeBranch: string;
    const orgAlias = ProjectUtils.getOrgAlias(this.flags.root ?? '');
    try {
      const branches = await git.getBranches();
      activeBranch = branches.find((b) => b.active)?.name;
    } catch (error) {
      /* empty */
    }
    const categoriesFlag = CommandUtils.getTypes(this.flags.categories ?? []);
    const categoriesToAnalyze = categoriesFlag.length > 0 ? CATEGORIES : undefined;
    const root = (this.flags.root ?? '') as string;
    const process = ProcessFactory.runSFScanner(
      `${root}/force-app'`,
      categoriesToAnalyze,
      this.flags.pmdruleset,
      this.flags.eslintruleset
    );
    const response = (await ProcessHandler.runProcess(process)) as ScannerResponse;
    const result: ScannerResult = {
      debt: 0,
      debtDuration: '0m',
      totalErrors: 0,
      bugs: 0,
      vulnerabilities: 0,
      codeSmells: 0,
      securityHotspots: 0,
      uncatalogued: 0,
      blockers: 0,
      criticals: 0,
      majors: 0,
      minors: 0,
      infos: 0,
      files: 0,
      designs: 0,
      bestPractices: 0,
      securities: 0,
      performances: 0,
      codeStyles: 0,
      documentations: 0,
      errors: 0,
      problems: 0,
      suggestions: 0,
      insecureDependencies: 0,
      languages: [],
      rules: [],
      duplicatedBlocks: 0,
      allProblems: [],
      branch: activeBranch,
      org: orgAlias,
    };
    if (this.flags.progress) {
      this.ux.log(messages.getMessage('message.start-report'));
    } else {
      this.ux.setSpinnerStatus(messages.getMessage('message.start-report'));
    }
    if (response.status === 0) {
      if (response.result.length > 0) {
        let totalMinutes = 0;
        const problemsByFile: { [key: string]: ScannerProblem[] } = {};
        const problemsByRule: { [key: string]: ScannerProblem[] } = {};
        const problemsByCategory: { [key: string]: ScannerProblem[] } = {};
        const problemsBySeverity: { [key: string]: ScannerProblem[] } = {};
        const problemsByNormalizedSeverity: { [key: string]: ScannerProblem[] } = {};
        const problemsByEngine: { [key: string]: ScannerProblem[] } = {};
        const problemsByType: { [key: string]: ScannerProblem[] } = {};
        const problemsByLanguage: { [key: string]: ScannerProblem[] } = {};
        const allProblems: ScannerProblem[] = [];
        for (const fileProblem of response.result) {
          const path = fileProblem.fileName;
          const fileName = PathUtils.getBasename(fileProblem.fileName);
          for (const problem of fileProblem.violations) {
            const fileExtension = fileName.split('.').pop() ?? '';
            problem.id = Utils.createUUIDV4();
            problem.engine = fileProblem.engine;
            problem.file = fileName;
            problem.path = path;
            problem.language = LANGUAGES[fileExtension] ?? 'Unknown';
            problem.message = problem.message?.trim();
            problem.ruleType =
              APEX_RULE_DATA[problem.ruleName]?.type ??
              VF_RULE_DATA[problem.ruleName]?.type ??
              JS_RULE_DATA[problem.ruleName]?.type ??
              TS_RULE_DATA[problem.ruleName]?.type ??
              HTML_RULE_DATA[problem.ruleName]?.type ??
              XML_RULE_DATA[problem.ruleName]?.type;
            problem.resolutionTime =
              APEX_RULE_DATA[problem.ruleName]?.time ??
              VF_RULE_DATA[problem.ruleName]?.time ??
              JS_RULE_DATA[problem.ruleName]?.time ??
              TS_RULE_DATA[problem.ruleName]?.time ??
              HTML_RULE_DATA[problem.ruleName]?.time ??
              XML_RULE_DATA[problem.ruleName]?.time;
            problem.endColumn = problem.line !== problem.endLine ? problem.line + 5 : problem.endColumn;
            problem.duration = DateUtils.minutesToDurationString(problem.resolutionTime ?? 0, true);
            totalMinutes += problem.resolutionTime ?? 0;
            allProblems.push(problem);
            if (!problemsByFile[fileProblem.fileName]) {
              problemsByFile[fileProblem.fileName] = [];
            }
            problemsByFile[fileProblem.fileName].push(problem);
            if (!problemsByRule[problem.ruleName]) {
              problemsByRule[problem.ruleName] = [];
            }
            problemsByRule[problem.ruleName].push(problem);
            if (!problemsByCategory[problem.category]) {
              problemsByCategory[problem.category] = [];
            }
            problemsByCategory[problem.category].push(problem);
            if (!problemsBySeverity[problem.severity]) {
              problemsBySeverity[problem.severity] = [];
            }
            problemsBySeverity[problem.severity].push(problem);
            const normalizedSeverity = problem.normalizedSeverity ?? 0;
            if (!problemsByNormalizedSeverity[normalizedSeverity]) {
              problemsByNormalizedSeverity[normalizedSeverity] = [];
            }
            problemsByNormalizedSeverity[normalizedSeverity].push(problem);
            if (!problemsByEngine[fileProblem.engine]) {
              problemsByEngine[fileProblem.engine] = [];
            }
            problemsByEngine[fileProblem.engine].push(problem);
            if (problem.ruleType) {
              if (!problemsByType[problem.ruleType]) {
                problemsByType[problem.ruleType] = [];
              }
              problemsByType[problem.ruleType].push(problem);
            } else {
              if (!problemsByType[UNCATALOGUED]) {
                problemsByType[UNCATALOGUED] = [];
              }
              problemsByType[UNCATALOGUED].push(problem);
            }
            if (!problemsByLanguage[problem.language]) {
              problemsByLanguage[problem.language] = [];
            }
            problemsByLanguage[problem.language].push(problem);
          }
        }
        result.files = Object.keys(problemsByFile).length;
        result.languages = Object.keys(problemsByLanguage);
        result.rules = Object.keys(problemsByRule);
        result.totalErrors = allProblems.length;
        result.bugs = problemsByType[BUG]?.length ?? 0;
        result.vulnerabilities = problemsByType[VULNERABILITY]?.length ?? 0;
        result.codeSmells = problemsByType[CODE_SMELL]?.length ?? 0;
        result.securityHotspots = problemsByType[SECURITY_HOTSPOT]?.length ?? 0;
        result.uncatalogued = problemsByType[UNCATALOGUED]?.length ?? 0;
        result.blockers = problemsBySeverity[1]?.length ?? 0;
        result.criticals = problemsBySeverity[2]?.length ?? 0;
        result.majors = problemsBySeverity[3]?.length ?? 0;
        result.minors = problemsBySeverity[4]?.length ?? 0;
        result.infos = problemsBySeverity[5]?.length ?? 0;
        result.designs = problemsByCategory[DESIGN]?.length ?? 0;
        result.bestPractices = problemsByCategory[BEST_PRACTICES]?.length ?? 0;
        result.securities = problemsByCategory[SECURITY]?.length ?? 0;
        result.performances = problemsByCategory[PERFORMANCE]?.length ?? 0;
        result.codeStyles = problemsByCategory[CODE_STYLE]?.length ?? 0;
        result.documentations = problemsByCategory[DOCUMENTATION]?.length ?? 0;
        result.errors = problemsByNormalizedSeverity[ERROR_PRONE]?.length ?? 0;
        result.problems = problemsByNormalizedSeverity[PROBLEM]?.length ?? 0;
        result.suggestions = problemsByNormalizedSeverity[SUGGESTIONS]?.length ?? 0;
        result.insecureDependencies = problemsByCategory[INSECURE_DEPENDENCIES]?.length ?? 0;
        result.debt = totalMinutes;
        result.debtDuration = DateUtils.minutesToDurationString(totalMinutes, true);
        result.duplicatedBlocks = problemsByRule['DuplicatedBlocks']?.length ?? 0;
        result.allProblems = allProblems;
      }
    } else {
      throw new Error(response.message ?? 'Unknown error');
    }
    return result;
  }

  private createHtmlPages(
    result: ScannerResult,
    qualityGateResult: AhScanReportRunResult,
    qualityGate: QualityGate
  ): string {
    const oldQualityGateResult = this.getOldQualityGatesResult();
    const overview = this.createHtmlPage(
      'Overview',
      this.overviewHtmlPage(result, qualityGateResult, oldQualityGateResult, qualityGate),
      './'
    );
    const issues = this.createHtmlPage('Issues', this.issuesHtmlPage(), '../');
    const qualityGatePage = this.createHtmlPage(
      'Quality Gate',
      this.qualityGateHtmlPage(qualityGate, qualityGateResult),
      '../'
    );
    const filePage = this.createHtmlPage('File Problems Detail', this.fileHtmlPage(), '../');
    const dateStr = new Date().toISOString().replace(/:/g, '_');
    const formatedDate = dateStr.substring(0, dateStr.lastIndexOf('.'));
    const folder = `${(this.flags.outputdir ?? '') as string}/AuraHelperReport_${formatedDate}`;
    const dataFolder = `${folder}/data`;
    const pagesFolder = `${folder}/pages`;
    const jsFolder = `${folder}/js`;
    const codeFolder = `${folder}/code`;
    const assetsFolder = '../../../../../assets';
    if (!FileChecker.isExists(folder)) {
      FileWriter.createFolderSync(folder);
    }
    if (!FileChecker.isExists(dataFolder)) {
      FileWriter.createFolderSync(dataFolder);
    }
    if (!FileChecker.isExists(pagesFolder)) {
      FileWriter.createFolderSync(pagesFolder);
    }
    if (!FileChecker.isExists(jsFolder)) {
      FileWriter.createFolderSync(jsFolder);
    }
    if (!FileChecker.isExists(codeFolder)) {
      FileWriter.createFolderSync(codeFolder);
    }
    FileWriter.createFileSync(`${folder}/index.html`, overview);
    FileWriter.createFileSync(
      `${folder}/styles.css`,
      FileReader.readFileSync(PathUtils.getAbsolutePath(`${__dirname}${assetsFolder}/styles.css`))
    );
    FileWriter.createFileSync(`${pagesFolder}/issues.html`, issues);
    FileWriter.createFileSync(`${pagesFolder}/quality-gate.html`, qualityGatePage);
    FileWriter.createFileSync(`${pagesFolder}/fileProblems.html`, filePage);
    FileWriter.createFileSync(`${dataFolder}/scan_result.json`, JSON.stringify(result));
    FileWriter.createFileSync(`${dataFolder}/quality_gate_result.json`, JSON.stringify(qualityGateResult));
    FileWriter.createFileSync(`${dataFolder}/old_scan_result.json`, JSON.stringify(result));
    FileWriter.createFileSync(`${dataFolder}/old_quality_gate_result.json`, JSON.stringify(qualityGateResult));
    FileWriter.createFileSync(`${dataFolder}/quality_gate.json`, JSON.stringify(qualityGate));
    FileWriter.createFileSync(
      `${jsFolder}/issuesPage.js`,
      FileReader.readFileSync(PathUtils.getAbsolutePath(`${__dirname}${assetsFolder}/issuesPage.js`))
    );
    FileWriter.createFileSync(
      `${jsFolder}/fileProblemsPage.js`,
      FileReader.readFileSync(PathUtils.getAbsolutePath(`${__dirname}${assetsFolder}/fileProblemsPage.js`))
    );
    const problemsByFile: { [key: string]: ScannerProblem[] } = {};
    for (const problem of result.allProblems) {
      if (!problemsByFile[problem.path]) {
        problemsByFile[problem.path] = [];
      }
      problemsByFile[problem.path].push(problem);
    }
    // eslint-disable-next-line guard-for-in
    for (const file in problemsByFile) {
      const fileFolder = PathUtils.getDirname(file);
      const destinyFolder = `${codeFolder}/force-app/${fileFolder.split('force-app')[1]}`;
      if (!FileChecker.isExists(destinyFolder)) {
        FileWriter.createFolderSync(destinyFolder);
      }
      FileWriter.createFileSync(
        `${destinyFolder}/${PathUtils.getBasename(file)}`,
        FileReader.readFileSync(PathUtils.getAbsolutePath(file))
      );
    }
    return folder;
  }

  private createHtmlPage(title: string, html: string, href: string): string {
    const content = `
    <!doctype html>
    <html>
    ${this.head(title, href)}
    ${this.body(html)}
    </html>`;
    return content;
  }

  // eslint-disable-next-line class-methods-use-this
  private head(title: string, href: string): string {
    const content = `<head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
      <title> ${title}</title>
      ${this.getStyles(href)}
      ${
        title === 'Issues'
          ? this.getIssuesPageJS()
          : title === 'File Problems Detail'
          ? this.getFileProblemsPageJS()
          : ''
      }
    </head>`;
    return content;
  }

  // eslint-disable-next-line class-methods-use-this
  private body(html: string): string {
    const content = `<body>
      ${html}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
      <script src="https://code.iconify.design/3/3.1.0/iconify.min.js"></script>
    </body>`;
    return content;
  }

  // eslint-disable-next-line class-methods-use-this
  private header(href: string, linkActive: string, isIndex: boolean): string {
    const links = [
      { href: isIndex ? './index.html' : '../index.html', name: 'Overview', active: linkActive === 'Overview' },
      { href: isIndex ? './pages/issues.html' : './issues.html', name: 'Issues', active: linkActive === 'Issues' },
      {
        href: isIndex ? './pages/quality-gate.html' : './quality-gate.html',
        name: 'Quality Gate',
        active: linkActive === 'Quality Gate',
      },
    ];
    const content =
      `<header class="w-100 py-3 border-bottom shadow-sm fixed-top">
      <div class="container">
        <div class="d-flex flex-wrap justify-content-center">
          <a href="${href}"
             class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
            <img src="${this.getLogoBase64()}"
                 height="40"
                 class="me-2" />
            <span class="fs-4">Aura Helper Report</span>
          </a>

          <ul class="nav nav-pills">` +
      links
        .map(
          (link) => `<li class="nav-item">
            <a href="${link.href}"
               class="nav-link ${link.active ? 'active' : ''}"
               aria-current="page">${link.name}</a>
          </li>`
        )
        .join('') +
      `</ul>
        </div>
      </div>
    </header>`;
    return content;
  }

  // eslint-disable-next-line class-methods-use-this
  private footer(): string {
    const content = `<footer class="w-100 py-3 mt-4 border-top fixed-bottom">
      <div class="d-flex flex-wrap justify-content-between align-items-center container">
        <div class="col-md-4 d-flex align-items-center">
          <span class="mb-3 mb-md-0 text-body-secondary">© ${new Date().getFullYear()} Aura Helper</span>
        </div>

        <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
          <li class="ms-3"><a href="https://marketplace.visualstudio.com/items?itemName=kanko.aura-helper" target="_blank"
               class="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1">
              <img src="${this.getLogoBase64()}"
                   height="30"
                   class="me-2" />
            </a></li>
        </ul>
      </div>
    </footer>`;
    return content;
  }

  private overviewHtmlPage(
    result: ScannerResult,
    qualityGateResult: AhScanReportRunResult,
    oldQualityGateResult: AhScanReportRunResult | undefined,
    qualityGate: QualityGate
  ): string {
    const dateStr = new Date().toISOString();
    const activeBranch = result.branch ?? '';
    const org = result.org ?? '';
    const content = `${this.header('./index.html', 'Overview', true)}
    <main class="mb-5">
      <article class="container-xl mb-2 mt-4">
        <h1>${activeBranch} Code Report</h1>
        <h6 class="mb-4">${org} - ${dateStr.substring(0, dateStr.lastIndexOf('.')).replace('T', ' ')}</h6>
        ${this.getQualityGatesHtml(result, qualityGateResult, qualityGate)}
        <hr/>
        ${this.getSummaryHtml(result, qualityGateResult, oldQualityGateResult)}
      </article>
    </main>
    ${this.footer()}`;
    return content;
  }

  private issuesHtmlPage(): string {
    const content = `${this.header('../index.html', 'Issues', false)}
    <main class="mb-5">
      <div id="spinner"
           class="text-center row mt-5 w-75 justify-content-center align-items-center"
           style="margin: 0 auto; height: 80vh">
        <div class="col-12 text-center mt-2">
          <span class="spinner-border col-12"
                style="height: 100px; width: 100px;"></span>
          <h3>Loading...</h3>
        </div>
      </div>
      <article class="container-xl mb-2 mt-4 d-none"
               id="main" style="height: calc(100vh - 170px);">
        <div class="w-100 two-columns mx-3">
        <div class="left">
        <h5>Filters</h5>
        <hr />
        <ul style="list-style: none; padding: 0; margin-right: 10px; padding-right: 10px">
          <li class="py-2">
            <a href="#issuesByTypeFilters"
                data-bs-toggle="collapse"
                class="my-4 filter-link fw-semibold">
              <span class="iconify"
                    data-icon="material-symbols:keyboard-arrow-down-rounded"
                    data-height="20"></span> Type <span id="issuesByTypeBadge"
                    class="badge rounded-pill text-bg-secondary d-none ms-4"></span>
            </a>
            <div class="collapse show mt-2 ps-3"
                  id="issuesByTypeFilters">
              <a class="row justify-content-between filter-element-link"
                  style="text-decoration: none;"
                  id="bugFilterElement"
                  data-value="Bug"
                  data-type="type"
                  onclick="addFilter(this)">
                <div class="col text-truncate"><span class="iconify"
                        data-icon="${ICONS['bug']}"
                        data-height="20"></span> Bug</div>
                <div class="col-auto"
                      id="bugFilterValue">0</div>
              </a>
              <a class="row justify-content-between filter-element-link"
                  style="text-decoration: none;"
                  id="vulnerabilityFilterElement"
                  data-value="Vulnerability"
                  data-type="type"
                  onclick="addFilter(this)">
                <div class="col text-truncate"><span class="iconify"
                        data-icon="${ICONS['vulnerability']}"
                        data-height="20"></span> Vulnerability</div>
                <div class="col-auto"
                      id="vulnerabilityFilterValue">0</div>
              </a>
              <a class="row justify-content-between filter-element-link"
                  style="text-decoration: none;"
                  id="securityHotspotFilterElement"
                  data-value="Security Hotspot"
                  data-type="type"
                  onclick="addFilter(this)">
                <div class="col text-truncate"><span class="iconify"
                        data-icon="${ICONS['security']}"
                        data-height="20"></span> Security Hotspot</div>
                <div class="col-auto"
                      id="securityHotspotFilterValue">0</div>
              </a>
              <a class="row justify-content-between filter-element-link"
                  style="text-decoration: none;"
                  id="codeSmellFilterElement"
                  data-value="Code Smell"
                  data-type="type"
                  onclick="addFilter(this)">
                <div class="col text-truncate"><span class="iconify"
                        data-icon="${ICONS['code-smell']}"
                        data-height="20"></span> Code Smell</div>
                <div class="col-auto"
                      id="codeSmellFilterValue">0</div>
              </a>
              <a class="row justify-content-between filter-element-link"
                  style="text-decoration: none;"
                  id="uncataloguedFilterElement"
                  data-value="Uncatalogued"
                  data-type="type"
                  onclick="addFilter(this)">
                <div class="col text-truncate"><span class="iconify"
                        data-icon="${ICONS['uncatalogued']}"
                        data-height="20"></span> Uncatalogued</div>
                <div class="col-auto"
                      id="uncataloguedFilterValue">0</div>
              </a>
            </div>
          </li>
          <li class="py-2">
            <a href="#issuesBySeverityFilters"
                data-bs-toggle="collapse"
                class="my-4 filter-link fw-semibold">
              <span class="iconify"
                    data-icon="material-symbols:keyboard-arrow-down-rounded"
                    data-height="20"></span> Severity <span id="issuesBySeverityBadge"
                    class="badge rounded-pill text-bg-secondary d-none ms-4"></span></a>
            <div class="collapse show mt-2 ps-3"
                  id="issuesBySeverityFilters">
              <div class="row">
                <div class="col-6">
                  <a class="row justify-content-between filter-element-link-small"
                      id="blockerFilterElement"
                      data-value="1"
                      data-type="severity"
                      onclick="addFilter(this)">
                    <div class="col text-truncate my-1"><span class="iconify"
                            data-icon="${ICONS['blocker']}"
                            data-height="20"></span> Blocker</div>
                    <div class="col-auto my-1"
                          id="blockersFilterValue">0</div>
                  </a>
                </div>
                <div class="col-6">
                  <a class="row justify-content-between filter-element-link-small"
                      id="criticalFilterElement"
                      data-value="2"
                      data-type="severity"
                      onclick="addFilter(this)">
                    <div class="col text-truncate my-1"><span class="iconify"
                            data-icon="${ICONS['critical']}"
                            data-height="20"></span> Critical
                    </div>
                    <div class="col-auto my-1"
                          id="criticalsFilterValue">0</div>
                  </a>
                </div>
                <div class="col-6">
                  <a class="row justify-content-between filter-element-link-small"
                      id="majorFilterElement"
                      data-value="3"
                      data-type="severity"
                      onclick="addFilter(this)">
                    <div class="col text-truncate my-1"><span class="iconify"
                            data-icon="${ICONS['major']}"
                            data-height="20"></span> Major</div>
                    <div class="col-auto my-1"
                          id="majorsFilterValue">0</div>
                  </a>
                </div>
                <div class="col-6">
                  <a class="row justify-content-between filter-element-link-small"
                      id="minorFilterElement"
                      data-value="4"
                      data-type="severity"
                      onclick="addFilter(this)">
                    <div class="col text-truncate my-1"><span class="iconify"
                            data-icon="${ICONS['minor']}"
                            data-height="20"></span> Minor</div>
                    <div class="col-auto my-1"
                          id="minorsFilterValue">0</div>
                  </a>
                </div>
                <div class="col-6">
                  <a class="row justify-content-between filter-element-link-small"
                      id="infoFilterElement"
                      data-value="5"
                      data-type="severity"
                      onclick="addFilter(this)">
                    <div class="col text-truncate my-1"><span class="iconify"
                            data-icon="${ICONS['info']}"
                            data-height="20"></span> Info</div>
                    <div class="col-auto my-1"
                          id="infosFilterValue">0</div>
                  </a>
                </div>
              </div>
            </div>
          </li>
          <li class="py-2">
            <a href="#issuesByCategoryFilters"
                data-bs-toggle="collapse"
                class="my-4 filter-link fw-semibold">
              <span class="iconify"
                    data-icon="material-symbols:keyboard-arrow-down-rounded"
                    data-height="20"></span> Category <span id="issuesByCategoryBadge"
                    class="badge rounded-pill text-bg-secondary d-none ms-4"></span></a>
            <div class="collapse show mt-2 ps-3"
                  id="issuesByCategoryFilters">
              <div class="row">
                <div class="col-6">
                  <a class="row justify-content-between filter-element-link-small"
                      id="designFilterElement"
                      data-value="${DESIGN}"
                      data-type="category"
                      onclick="addFilter(this)">
                    <div class="col text-truncate my-1"><span class="iconify"
                            data-icon="${ICONS['design']}"
                            data-height="20"></span> ${DESIGN}</div>
                    <div class="col-auto my-1"
                          id="designFilterValue">0</div>
                  </a>
                </div>
                <div class="col-6">
                  <a class="row justify-content-between filter-element-link-small"
                      id="bestPracticesFilterElement"
                      data-value="${BEST_PRACTICES}"
                      data-type="category"
                      onclick="addFilter(this)">
                    <div class="col text-truncate my-1"><span class="iconify"
                            data-icon="${ICONS['best-practices']}"
                            data-height="20"></span> ${BEST_PRACTICES}</div>
                    <div class="col-auto my-1"
                          id="bestPracticesFilterValue">0</div>
                  </a>
                </div>
                <div class="col-6">
                  <a class="row justify-content-between filter-element-link-small"
                      id="codeStyleFilterElement"
                      data-value="${CODE_STYLE}"
                      data-type="category"
                      onclick="addFilter(this)">
                    <div class="col text-truncate my-1"><span class="iconify"
                            data-icon="${ICONS['code-style']}"
                            data-height="20"></span> ${CODE_STYLE}</div>
                    <div class="col-auto my-1"
                          id="codeStyleFilterValue">0</div>
                  </a>
                </div>
                <div class="col-6">
                  <a class="row justify-content-between filter-element-link-small"
                      id="documentationFilterElement"
                      data-value="${DOCUMENTATION}"
                      data-type="category"
                      onclick="addFilter(this)">
                    <div class="col text-truncate my-1"><span class="iconify"
                            data-icon="${ICONS['documentation']}"
                            data-height="20"></span> ${DOCUMENTATION}</div>
                    <div class="col-auto my-1"
                          id="documentationFilterValue">0</div>
                  </a>
                </div>
                <div class="col-6">
                  <a class="row justify-content-between filter-element-link-small"
                      id="performanceFilterElement"
                      data-value="${PERFORMANCE}"
                      data-type="category"
                      onclick="addFilter(this)">
                    <div class="col text-truncate my-1"><span class="iconify"
                            data-icon="${ICONS['performance']}"
                            data-height="20"></span> ${PERFORMANCE}</div>
                    <div class="col-auto my-1"
                          id="performanceFilterValue">0</div>
                  </a>
                </div>
                <div class="col-6">
                  <a class="row justify-content-between filter-element-link-small"
                      id="securityFilterElement"
                      data-value="${SECURITY}"
                      data-type="category"
                      onclick="addFilter(this)">
                    <div class="col text-truncate my-1"><span class="iconify"
                            data-icon="${ICONS['security']}"
                            data-height="20"></span> ${SECURITY}</div>
                    <div class="col-auto my-1"
                          id="securityFilterValue">0</div>
                  </a>
                </div>
                <div class="col-6">
                  <a class="row justify-content-between filter-element-link-small"
                      id="insecureDependenciesFilterElement"
                      data-value="${INSECURE_DEPENDENCIES}"
                      data-type="category"
                      onclick="addFilter(this)">
                    <div class="col text-truncate my-1"><span class="iconify"
                            data-icon="${ICONS['insecure-dependencies']}"
                            data-height="20"></span> ${INSECURE_DEPENDENCIES}</div>
                    <div class="col-auto my-1"
                          id="insecureDependenciesFilterValue">0</div>
                  </a>
                </div>
                <div class="col-6">
                  <a class="row justify-content-between filter-element-link-small"
                      id="problemFilterElement"
                      data-value="${PROBLEM}"
                      data-type="category"
                      onclick="addFilter(this)">
                    <div class="col text-truncate my-1"><span class="iconify"
                            data-icon="${ICONS['problem']}"
                            data-height="20"></span> Problem</div>
                    <div class="col-auto my-1"
                          id="problemFilterValue">0</div>
                  </a>
                </div>
                <div class="col-6">
                  <a class="row justify-content-between filter-element-link-small"
                      id="suggestionFilterElement"
                      data-value="${SUGGESTIONS}"
                      data-type="category"
                      onclick="addFilter(this)">
                    <div class="col text-truncate my-1"><span class="iconify"
                            data-icon="${ICONS['suggestion']}"
                            data-height="20"></span> Suggestion</div>
                    <div class="col-auto my-1"
                          id="suggestionFilterValue">0</div>
                  </a>
                </div>
              </div>
            </div>
          </li>
          <li class="py-2"><a href="#issuesByLanguageFilters"
                data-bs-toggle="collapse"
                class="my-4 filter-link fw-semibold collapsed">
              <span class="iconify"
                    data-icon="material-symbols:keyboard-arrow-down-rounded"
                    data-height="20"></span> Language <span id="issuesByLanguageBadge"
                    class="badge rounded-pill text-bg-secondary d-none ms-4"></span></a>
            <div class="collapse mt-2 ps-3"
                  id="issuesByLanguageFilters">
              <div id="issuesByLanguageFiltersContent"
                    class="filter-content">

              </div>
            </div>
          </li>
          <li class="py-2"><a href="#issuesByRuleFilters"
                data-bs-toggle="collapse"
                class="my-4 filter-link fw-semibold collapsed">
              <span class="iconify"
                    data-icon="material-symbols:keyboard-arrow-down-rounded"
                    data-height="20"></span> Rule <span id="issuesByRuleBadge"
                    class="badge rounded-pill text-bg-secondary d-none ms-4"></span></a>
            <div class="collapse mt-2 ps-3"
                  id="issuesByRuleFilters">
              <div class="input-group mb-3">
                <span class="input-group-text"
                      id="ruleInputIcon"><span class="iconify"
                        data-icon="material-symbols:search-rounded"
                        data-height="20"></span></span>
                <input type="text"
                        class="form-control"
                        placeholder="Search Rule..."
                        aria-label="Rule"
                        aria-describedby="ruleInputIcon"
                        oninput="changeRuleInputHandler(this)">
              </div>
              <div id="issuesByRuleFiltersContent"
                    class="filter-content">

              </div>
            </div>
          </li>
          <li class="py-2"><a href="#issuesByFileFilters"
                data-bs-toggle="collapse"
                class="my-4 filter-link fw-semibold collapsed">
              <span class="iconify"
                    data-icon="material-symbols:keyboard-arrow-down-rounded"
                    data-height="20"></span> File <span id="issuesByFileBadge"
                    class="badge rounded-pill text-bg-secondary d-none ms-4"></span></a>
            <div class="collapse mt-2 ps-3"
                  id="issuesByFileFilters">
              <div class="input-group mb-3">
                <span class="input-group-text"
                      id="fileInputIcon"><span class="iconify"
                        data-icon="material-symbols:search-rounded"
                        data-height="20"></span></span>
                <input type="text"
                        class="form-control"
                        placeholder="Search File..."
                        aria-label="File"
                        aria-describedby="fileInputIcon"
                        oninput="changeFileInputHandler(this)">
              </div>
              <div id="issuesByFileFiltersContent"
                    class="filter-content">

              </div>
            </div>
          </li>
        </ul>
        </div>
        <div class="right">
        <div id="problemsSpinner"
              class="text-center row mt-5 w-75 justify-content-center align-items-center"
              style="margin: 0 auto; height: 80vh">
          <div class="col-12 text-center mt-2">
            <span class="spinner-border col-12"
                  style="height: 100px; width: 100px;"></span>
            <h3>Loading...</h3>
          </div>
        </div>
        <div>
          <div id="problemsContent">

          </div>
          <div class="row justify-content-center">
            <div class="col-auto"
                  id="problemsContentFilesRendered">

            </div>
          </div>
        </div>
        </div>
        </div>
      </article>
    </main>
    ${this.footer()}
    <script>init()</script>`;
    return content;
  }

  // eslint-disable-next-line complexity
  private qualityGateHtmlPage(qualityGate: QualityGate, qualityGateResult: AhScanReportRunResult): string {
    const debtStatus = this.getDebtStatus(qualityGate, qualityGateResult);
    const bugsStatus = this.getBugsStatus(qualityGate, qualityGateResult);
    const blockersStatus = this.getBlockersStatus(qualityGate, qualityGateResult);
    const criticalsStatus = this.getCriticalsStatus(qualityGate, qualityGateResult);
    const majorsStatus = this.getMajorsStatus(qualityGate, qualityGateResult);
    const minorsStatus = this.getMinorsStatus(qualityGate, qualityGateResult);
    const infosStatus = this.getInfosStatus(qualityGate, qualityGateResult);

    const content = `${this.header('../index.html', 'Quality Gate', false)}
    <main class="mb-5">
      <article class="container-xl mb-2 mt-4">
        <h1>Quality Gate and Measures</h1>
        <table class="table table-striped table-hover mt-4"">
          <thead>
            <tr>
              <th style="width: 50%;">Metric</th>
              <th>Condition</th>
              <th>Value</th>
              <th>Project Measures</th>
              <th style="width: 150px;">Status</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            <tr>
              <td style="width: 50%;">Technical Debt</td>
              <td>Greater Than</td>
              <td>${debtStatus !== 'Not Defined' ? qualityGate.maxDebt : debtStatus}</td>
              <td>${qualityGateResult.debtDuration}</td>
              <td class="${debtStatus === 'Passed' ? 'bg-green' : debtStatus === 'Not Passed' ? 'bg-red' : ''} fw-bold"
                  style="width: 150px;">${debtStatus}</td>
            </tr>
            <tr>
              <td style="width: 50%;">Bugs</td>
              <td>Greater Than</td>
              <td>${bugsStatus !== 'Not Defined' ? qualityGate.maxBugs : bugsStatus}</td>
              <td>${qualityGateResult.bugs}</td>
              <td class="${bugsStatus === 'Passed' ? 'bg-green' : bugsStatus === 'Not Passed' ? 'bg-red' : ''} fw-bold"
                  style="width: 150px;">${bugsStatus}</td>
            </tr>
            <tr>
              <td style="width: 50%;">Blocker Issues</td>
              <td>Greater Than</td>
              <td>${blockersStatus !== 'Not Defined' ? qualityGate.maxBlockers : blockersStatus}</td>
              <td>${qualityGateResult.blockers}</td>
              <td class="${
                blockersStatus === 'Passed' ? 'bg-green' : blockersStatus === 'Not Passed' ? 'bg-red' : ''
              } fw-bold"
                  style="width: 150px;">${blockersStatus}</td>
            </tr>
            <tr>
              <td style="width: 50%;">Critical Issues</td>
              <td>Greater Than</td>
              <td>${criticalsStatus !== 'Not Defined' ? qualityGate.maxCriticals : criticalsStatus}</td>
              <td>${qualityGateResult.criticals}</td>
              <td class="${
                criticalsStatus === 'Passed' ? 'bg-green' : criticalsStatus === 'Not Passed' ? 'bg-red' : ''
              } fw-bold"
                  style="width: 150px;">${criticalsStatus}</td>
            </tr>
            <tr>
              <td style="width: 50%;">Major Issues</td>
              <td>Greater Than</td>
              <td>${majorsStatus !== 'Not Defined' ? qualityGate.maxMajors : majorsStatus}</td>
              <td>${qualityGateResult.majors}</td>
              <td class="${
                majorsStatus === 'Passed' ? 'bg-green' : majorsStatus === 'Not Passed' ? 'bg-red' : ''
              } fw-bold"
                  style="width: 150px;">${majorsStatus}</td>
            </tr>
            <tr>
              <td style="width: 50%;">Minor Issues</td>
              <td>Greater Than</td>
              <td>${minorsStatus !== 'Not Defined' ? qualityGate.maxMinors : minorsStatus}</td>
              <td>${qualityGateResult.minors}</td>
              <td class="${
                minorsStatus === 'Passed' ? 'bg-green' : minorsStatus === 'Not Passed' ? 'bg-red' : ''
              } fw-bold"
                  style="width: 150px;">${minorsStatus}</td>
            </tr>
            <tr>
              <td style="width: 50%;">Info Issues</td>
              <td>Greater Than</td>
              <td>${infosStatus !== 'Not Defined' ? qualityGate.maxInfos : infosStatus}</td>
              <td>${qualityGateResult.infos}</td>
              <td class="${
                infosStatus === 'Passed' ? 'bg-green' : infosStatus === 'Not Passed' ? 'bg-red' : ''
              } fw-bold"
                  style="width: 150px;">${infosStatus}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </main>
    ${this.footer()}`;
    return content;
  }

  // eslint-disable-next-line class-methods-use-this
  private fileHtmlPage(): string {
    const content = `
    ${this.header('../index.html', 'Issues', false)}
    <main class="mb-5">
      <div id="spinner"
           class="text-center row mt-5 w-75 justify-content-center align-items-center"
           style="margin: 0 auto; height: 80vh">
        <div class="col-12 text-center mt-2">
          <span class="spinner-border col-12"
                style="height: 100px; width: 100px;"></span>
          <h3>Loading...</h3>
        </div>
      </div>
      <article class="container-xl mb-2 mt-4 d-none two-columns"
               style="height: calc(100vh - 170px);"
               id="main">
        <div class="left">
          <div id="leftContent">

          </div>
        </div>
        <div class="right">
          <div id="rightContent">

          </div>
        </div>
      </article>
    </main>
    ${this.footer()}
    <script>init()</script>
    `;

    return content;
  }

  // eslint-disable-next-line class-methods-use-this
  private getDebtStatus(qualityGate: QualityGate, qualityGateResult: AhScanReportRunResult): string {
    if (qualityGate.maxDebt) {
      const debtMinutes = DateUtils.durationStringToMinutes(qualityGate.maxDebt);
      if (qualityGateResult.debt > debtMinutes) {
        return 'Not Passed';
      } else {
        return 'Passed';
      }
    }
    return 'Not Defined';
  }

  // eslint-disable-next-line class-methods-use-this
  private getBlockersStatus(qualityGate: QualityGate, qualityGateResult: AhScanReportRunResult): string {
    if (qualityGate.maxBlockers !== null && qualityGate?.maxBlockers !== undefined && qualityGate?.maxBlockers >= 0) {
      if (qualityGateResult.blockers > qualityGate.maxBlockers) {
        return 'Not Passed';
      } else {
        return 'Passed';
      }
    }
    return 'Not Defined';
  }

  // eslint-disable-next-line class-methods-use-this
  private getCriticalsStatus(qualityGate: QualityGate, qualityGateResult: AhScanReportRunResult): string {
    if (
      qualityGate.maxCriticals !== null &&
      qualityGate?.maxCriticals !== undefined &&
      qualityGate?.maxCriticals >= 0
    ) {
      if (qualityGateResult.criticals > qualityGate.maxCriticals) {
        return 'Not Passed';
      } else {
        return 'Passed';
      }
    }
    return 'Not Defined';
  }

  // eslint-disable-next-line class-methods-use-this
  private getBugsStatus(qualityGate: QualityGate, qualityGateResult: AhScanReportRunResult): string {
    if (qualityGate.maxBugs !== null && qualityGate?.maxBugs !== undefined && qualityGate?.maxBugs >= 0) {
      if (qualityGateResult.bugs > qualityGate.maxBugs) {
        return 'Not Passed';
      } else {
        return 'Passed';
      }
    }
    return 'Not Defined';
  }

  // eslint-disable-next-line class-methods-use-this
  private getMajorsStatus(qualityGate: QualityGate, qualityGateResult: AhScanReportRunResult): string {
    if (qualityGate.maxMajors !== null && qualityGate?.maxMajors !== undefined && qualityGate?.maxMajors >= 0) {
      if (qualityGateResult.majors > qualityGate.maxMajors) {
        return 'Not Passed';
      } else {
        return 'Passed';
      }
    }
    return 'Not Defined';
  }

  // eslint-disable-next-line class-methods-use-this
  private getMinorsStatus(qualityGate: QualityGate, qualityGateResult: AhScanReportRunResult): string {
    if (qualityGate.maxMinors !== null && qualityGate?.maxMinors !== undefined && qualityGate?.maxMinors >= 0) {
      if (qualityGateResult.minors > qualityGate.maxMinors) {
        return 'Not Passed';
      } else {
        return 'Passed';
      }
    }
    return 'Not Defined';
  }

  // eslint-disable-next-line class-methods-use-this
  private getInfosStatus(qualityGate: QualityGate, qualityGateResult: AhScanReportRunResult): string {
    if (qualityGate.maxInfos !== null && qualityGate?.maxInfos !== undefined && qualityGate?.maxInfos >= 0) {
      if (qualityGateResult.infos > qualityGate.maxInfos) {
        return 'Not Passed';
      } else {
        return 'Passed';
      }
    }
    return 'Not Defined';
  }

  // eslint-disable-next-line class-methods-use-this
  private getQualityGatesHtml(
    result: ScannerResult,
    qualityGateResult: AhScanReportRunResult,
    qualityGate: QualityGate
  ): string {
    let content = `
      <div class="w-100 row mx-4 mb-3 justify-content-evenly">
          <h3>Quality Gate ${this.getQualityGateStatus(qualityGateResult.passed)}</h3>`;
    if (qualityGateResult.measuresFailed?.includes('Debt')) {
      content += `${this.getQualityGateHtml(
        qualityGateResult.debtDuration,
        'debt',
        `Is greater than ${qualityGate.maxDebt}`
      )}\n`;
    }
    if (qualityGateResult.measuresFailed?.includes('Bugs')) {
      content += `${this.getQualityGateHtml(
        qualityGateResult.bugs,
        'bug',
        `Is greater than ${qualityGate.maxBugs}`
      )}\n`;
    }
    if (qualityGateResult.measuresFailed?.includes('Blockers')) {
      content += `${this.getQualityGateHtml(
        qualityGateResult.blockers,
        'blocker',
        `Is greater than ${qualityGate.maxBlockers}`
      )}\n`;
    }
    if (qualityGateResult.measuresFailed?.includes('Criticals')) {
      content += `${this.getQualityGateHtml(
        qualityGateResult.criticals,
        'critical',
        `Is greater than ${qualityGate.maxCriticals}`
      )}\n`;
    }
    if (qualityGateResult.measuresFailed?.includes('Majors')) {
      content += `${this.getQualityGateHtml(
        qualityGateResult.majors,
        'major',
        `Is greater than ${qualityGate.maxMajors}`
      )}\n`;
    }
    if (qualityGateResult.measuresFailed?.includes('Minors')) {
      content += `${this.getQualityGateHtml(
        qualityGateResult.minors,
        'minor',
        `Is greater than ${qualityGate.maxMinors}`
      )}\n`;
    }
    if (qualityGateResult.measuresFailed?.includes('Infos')) {
      content += `${this.getQualityGateHtml(
        qualityGateResult.infos,
        'info',
        `Is greater than ${qualityGate.maxInfos}`
      )}\n`;
    }
    if (qualityGateResult.measuresFailed?.includes('Duplicates')) {
      content += `${this.getQualityGateHtml(
        qualityGateResult.duplicatedBlocks,
        'duplicate',
        `Is greater than ${qualityGate.maxDuplicates}`
      )}\n`;
    }
    content += `
    </div>
    `;
    return content;
  }

  // eslint-disable-next-line class-methods-use-this, complexity
  private getSummaryHtml(
    result: ScannerResult,
    qualityGateResult: AhScanReportRunResult,
    oldQualityGateResult: AhScanReportRunResult | undefined
  ): string {
    // const oldResult = this.getOldResults(flags);
    const content = `
      <h3>Summary</h3>
      <div class="row mb-4">
        <h4>Reliability</h4>
        <div class="col-6 border text-center shadow-sm p-3 bg-white">
          <div class="measure-value">${qualityGateResult.bugs}</div>
          <div>
            <span class="iconify"
                  data-icon="${this.getIconByType('bug')}"
                  data-height="20"></span>
            Bugs
          </div>
        </div>
        <div class="col-6 border text-center p-3 shadow-sm bg-white">
          <div class="measure-value">${
            oldQualityGateResult?.bugs ? qualityGateResult.bugs - oldQualityGateResult.bugs : qualityGateResult.bugs
          }</div>
          <div>
            <span class="iconify"
                  data-icon="${this.getIconByType('bug')}"
                  data-height="20"></span>
            New Bugs
          </div>
        </div>
      </div>
      <div class="row mb-4">
        <h4>Security</h4>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.vulnerabilities}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('vulnerability')}"
                      data-height="20"></span>
                Vulnerabilities
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.securityHotspots}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('security')}"
                      data-height="20"></span>
                Security Hotspots
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.vulnerabilities
                  ? qualityGateResult.vulnerabilities - oldQualityGateResult.vulnerabilities
                  : qualityGateResult.vulnerabilities
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('vulnerability')}"
                      data-height="20"></span>
                New Vulnerabilities
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.securityHotspots
                  ? qualityGateResult.securityHotspots - oldQualityGateResult.securityHotspots
                  : qualityGateResult.securityHotspots
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('security')}"
                      data-height="20"></span>
                New Security Hotspots
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-4">
        <h4>Maintainability</h4>
        <div class="col-6 border text-center shadow-sm p-3 bg-white">
          <div class="measure-value">${qualityGateResult.uncatalogued}</div>
          <div>
            <span class="iconify"
                  data-icon="${this.getIconByType('uncatalogued')}"
                  data-height="20"></span>
            Uncatalogued
          </div>
        </div>
        <div class="col-6 border text-center p-3 shadow-sm bg-white">
          <div class="measure-value">${
            oldQualityGateResult?.uncatalogued
              ? qualityGateResult.uncatalogued - oldQualityGateResult.uncatalogued
              : qualityGateResult.uncatalogued
          }</div>
          <div>
            <span class="iconify"
                  data-icon="${this.getIconByType('uncatalogued')}"
                  data-height="20"></span>
            New Uncatalogued
          </div>
        </div>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.debtDuration}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('debt')}"
                      data-height="20"></span>
                Technical Debt
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.codeSmells}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('code-smell')}"
                      data-height="20"></span>
                Code Smells
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${this.getNewTechinicalDebt(qualityGateResult, oldQualityGateResult)}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('debt')}"
                      data-height="20"></span>
                New Technical Debt
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.codeSmells
                  ? qualityGateResult.codeSmells - oldQualityGateResult.codeSmells
                  : qualityGateResult.codeSmells
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('code-smell')}"
                      data-height="20"></span>
                New Code Smells
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-4">
        <h4>Issues</h4>
        <div class="col-6 border text-center p-3 shadow-sm bg-white">
          <div class="measure-value">${qualityGateResult.totalErrors}</div>
          <div>
            <span class="iconify"
                  data-icon="${this.getIconByType('error')}"
                  data-height="20"></span>
            Total Issues
          </div>
        </div>
        <div class="col-6 border text-center p-3 shadow-sm bg-white">
          <div class="measure-value">${
            oldQualityGateResult?.totalErrors
              ? qualityGateResult.totalErrors - oldQualityGateResult.totalErrors
              : qualityGateResult.totalErrors
          }</div>
          <div>
            <span class="iconify"
                  data-icon="${this.getIconByType('error')}"
                  data-height="20"></span>
            New Total Issues
          </div>
        </div>
        <h6 class="mt-4">By Severity</h6>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.blockers}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('blocker')}"
                      data-height="20"></span>
                Blockers
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.criticals}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('critical')}"
                      data-height="20"></span>
                Criticals
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.blockers
                  ? qualityGateResult.blockers - oldQualityGateResult.blockers
                  : qualityGateResult.blockers
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('blocker')}"
                      data-height="20"></span>
                New Blockers
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.criticals
                  ? qualityGateResult.criticals - oldQualityGateResult.criticals
                  : qualityGateResult.criticals
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('critical')}"
                      data-height="20"></span>
                New Criticals
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.majors}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('major')}"
                      data-height="20"></span>
                Majors
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.minors}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('minor')}"
                      data-height="20"></span>
                Minors
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.majors
                  ? qualityGateResult.majors - oldQualityGateResult.majors
                  : qualityGateResult.majors
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('major')}"
                      data-height="20"></span>
                New Majors
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.minors
                  ? qualityGateResult.minors - oldQualityGateResult.minors
                  : qualityGateResult.minors
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('minor')}"
                      data-height="20"></span>
                New Minors
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 border text-center p-3 shadow-sm bg-white">
          <div class="measure-value">${qualityGateResult.infos}</div>
          <div>
            <span class="iconify"
                  data-icon="${this.getIconByType('info')}"
                  data-height="20"></span>
            Infos
          </div>
        </div>
        <div class="col-6 border text-center p-3 shadow-sm bg-white">
          <div class="measure-value">${
            oldQualityGateResult?.infos ? qualityGateResult.infos - oldQualityGateResult.infos : qualityGateResult.infos
          }</div>
          <div>
            <span class="iconify"
                  data-icon="${this.getIconByType('info')}"
                  data-height="20"></span>
            New Infos
          </div>
        </div>
      </div>
      <div class="row mb-4">
        <h6>By Category</h6>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.designs}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('design')}"
                      data-height="20"></span>
                Design
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.bestPractices}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('best-practices')}"
                      data-height="20"></span>
                Best Practices
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.designs
                  ? qualityGateResult.designs - oldQualityGateResult.designs
                  : qualityGateResult.designs
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('design')}"
                      data-height="20"></span>
                New Design
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.bestPractices
                  ? qualityGateResult.bestPractices - oldQualityGateResult.bestPractices
                  : qualityGateResult.bestPractices
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('best-practices')}"
                      data-height="20"></span>
                New Best Practices
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.codeStyles}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('code-style')}"
                      data-height="20"></span>
                Code Style
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.performances}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('performance')}"
                      data-height="20"></span>
                Performance
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.codeStyles
                  ? qualityGateResult.codeStyles - oldQualityGateResult.codeStyles
                  : qualityGateResult.codeStyles
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('code-style')}"
                      data-height="20"></span>
                New Code Style
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.performances
                  ? qualityGateResult.performances - oldQualityGateResult.performances
                  : qualityGateResult.performances
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('performance')}"
                      data-height="20"></span>
                New Performance
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.insecureDependencies}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('insecure-dependencies')}"
                      data-height="20"></span>
                Insecure Dependencies
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.securities}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('security')}"
                      data-height="20"></span>
                Security
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.insecureDependencies
                  ? qualityGateResult.insecureDependencies - oldQualityGateResult.insecureDependencies
                  : qualityGateResult.insecureDependencies
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('insecure-dependencies')}"
                      data-height="20"></span>
                New Insecure Dependencies
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.securities
                  ? qualityGateResult.securities - oldQualityGateResult.securities
                  : qualityGateResult.securities
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('security')}"
                      data-height="20"></span>
                New Security
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.errors}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('error')}"
                      data-height="20"></span>
                Errors
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.problems}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('problem')}"
                      data-height="20"></span>
                Problem
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.errors
                  ? qualityGateResult.errors - oldQualityGateResult.errors
                  : qualityGateResult.errors
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('error')}"
                      data-height="20"></span>
                New Errors
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.problems
                  ? qualityGateResult.problems - oldQualityGateResult.problems
                  : qualityGateResult.problems
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('problem')}"
                      data-height="20"></span>
                New Problem
              </div>
            </div>
          </div>
        </div>

        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.documentations}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('documentation')}"
                      data-height="20"></span>
                      Documentation
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${qualityGateResult.suggestions}</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('problem')}"
                      data-height="20"></span>
                      Suggestions
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 border shadow-sm">
          <div class="row">
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.documentations
                  ? qualityGateResult.documentations - oldQualityGateResult.documentations
                  : qualityGateResult.documentations
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('documentation')}"
                      data-height="20"></span>
                New Documentation
              </div>
            </div>
            <div class="col-6 text-center bg-white p-3">
              <div class="measure-value">${
                oldQualityGateResult?.suggestions
                  ? qualityGateResult.suggestions - oldQualityGateResult.suggestions
                  : qualityGateResult.suggestions
              }</div>
              <div>
                <span class="iconify"
                      data-icon="${this.getIconByType('suggestion')}"
                      data-height="20"></span>
                New Suggestions
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    return content;
  }

  // eslint-disable-next-line class-methods-use-this
  private getNewTechinicalDebt(
    qualityGateResult: AhScanReportRunResult,
    oldQualityGateResult: AhScanReportRunResult | undefined
  ): string {
    if (!oldQualityGateResult?.debt) {
      return qualityGateResult.debtDuration;
    } else {
      if (qualityGateResult.debt > oldQualityGateResult.debt) {
        return DateUtils.minutesToDurationString(qualityGateResult.debt - oldQualityGateResult.debt, true);
      } else if (qualityGateResult.debt < oldQualityGateResult.debt) {
        return '-' + DateUtils.minutesToDurationString(oldQualityGateResult.debt - qualityGateResult.debt, true);
      }
      return '0';
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getQualityGateStatus(passed: boolean): string {
    return passed
      ? '<span class="badge rounded-pill bg-success">Passed</span>'
      : '<span class="badge rounded-pill bg-danger">Failed</span>';
  }

  // eslint-disable-next-line class-methods-use-this
  private getQualityGateHtml(value: number | string, type: string, detail: string): string {
    const content = `
    <div class="col-auto mt-3">
      <div class="quality-gate-container shadow-sm">
        <div class="quality-gate-value">
          ${value}
        </div>
        <div>
          <div class="quality-gate-type">
            <span class="iconify"
                  data-icon="${this.getIconByType(type)}"
                  data-height="20"></span>
            ${type}
          </div>
          <div class="quality-gate-detail">
            ${detail}
          </div>
        </div>
      </div>
    </div>
    `;
    return content;
  }

  // eslint-disable-next-line class-methods-use-this
  private getIconByType(type: string): string {
    return ICONS[type] ?? ICONS['info'];
  }

  // eslint-disable-next-line class-methods-use-this
  private getIssuesPageJS(): string {
    return '<script type="text/javascript" src="../js/issuesPage.js"></script>';
  }

  // eslint-disable-next-line class-methods-use-this
  private getFileProblemsPageJS(): string {
    return '<script type="text/javascript" src="../js/fileProblemsPage.js"></script>';
  }

  // eslint-disable-next-line class-methods-use-this
  private getStyles(href: string): string {
    const content = `<link rel="stylesheet" href="${href}styles.css">`;
    return content;
  }

  // eslint-disable-next-line class-methods-use-this
  private getLogoBase64(): string {
    return 'data:image/png;base64,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';
  }
}
