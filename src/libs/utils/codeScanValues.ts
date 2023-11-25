export const CODE_SMELL = 'Code Smell';
export const BUG = 'Bug';
export const VULNERABILITY = 'Vulnerability';
export const SECURITY_HOTSPOT = 'Security Hotspot';
export const UNCATALOGUED = 'Uncatalogued';
export const TYPES: string[] = [CODE_SMELL, BUG, VULNERABILITY, SECURITY_HOTSPOT, UNCATALOGUED];

export const LANGUAGES: { [key: string]: string } = {
  cls: 'Apex',
  apex: 'Apex',
  trigger: 'Apex',
  cmp: 'HTML',
  app: 'HTML',
  evt: 'HTML',
  design: 'HTML',
  svg: 'HTML',
  html: 'HTML',
  js: 'JavaScript',
  ts: 'TypeScript',
  css: 'CSS',
  xml: 'XML',
  page: 'Visualforce',
  component: 'Visualforce',
};

export const DESIGN = 'Design';
export const BEST_PRACTICES = 'Best Practices';
export const SECURITY = 'Security';
export const PERFORMANCE = 'Performance';
export const CODE_STYLE = 'Code Style';
export const DOCUMENTATION = 'Documentation';
export const ERROR_PRONE = 'Error Prone';
export const PROBLEM = 'problem';
export const SUGGESTIONS = 'suggestion';
export const INSECURE_DEPENDENCIES = 'Insecure Dependencies';

export const CATEGORIES: string[] = [
  DESIGN,
  BEST_PRACTICES,
  SECURITY,
  PERFORMANCE,
  CODE_STYLE,
  DOCUMENTATION,
  ERROR_PRONE,
  PROBLEM,
  SUGGESTIONS,
  INSECURE_DEPENDENCIES,
];
export const SEVERITIES: { [key: number]: string } = {
  1: 'Blocker',
  2: 'Critical',
  3: 'Major',
  4: 'Minor',
  5: 'Info',
};
export const NORMALIZED_SEVERITIES: { [key: number]: string } = {
  1: 'High',
  2: 'Medum',
  3: 'Low',
};
export const TIME_BY_SEVERITY: { [key: number]: number } = {
  1: 45,
  2: 30,
  3: 20,
  4: 10,
  5: 5,
};

export interface RuleData {
  time: number;
  offset?: number;
  type: string;
  timeType?: string;
}

export interface QualityGate {
  maxDebt?: string;
  maxBlockers?: number;
  maxCriticals?: number;
  maxMajors?: number;
  maxMinors?: number;
  maxInfos?: number;
  maxDuplicates?: number;
  maxBugs?: number;
}

export const STRICT_QUALITY_GATE: QualityGate = {
  maxDebt: '0m',
  maxBlockers: 0,
  maxCriticals: 0,
  maxMajors: 0,
  maxMinors: 0,
  maxInfos: 0,
  maxDuplicates: 0,
  maxBugs: 0,
};

export const HIHG_QUALITY_GATE: QualityGate = {
  maxDebt: '10d',
  maxBlockers: 10,
  maxCriticals: 20,
  maxMajors: 50,
  maxMinors: 100,
  maxInfos: 150,
  maxDuplicates: 10,
  maxBugs: 10,
};

export const MEDIUM_QUALITY_GATE: QualityGate = {
  maxDebt: '20d',
  maxBlockers: 20,
  maxCriticals: 50,
  maxMajors: 100,
  maxMinors: 200,
  maxInfos: 300,
  maxDuplicates: 20,
  maxBugs: 15,
};

export const LOW_QUALITY_GATE: QualityGate = {
  maxDebt: '30d',
  maxBlockers: 30,
  maxCriticals: 100,
  maxMajors: 200,
  maxMinors: 300,
  maxInfos: 400,
  maxDuplicates: 30,
  maxBugs: 20,
};
