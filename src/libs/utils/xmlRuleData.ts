import { BUG, CODE_SMELL, RuleData } from './codeScanValues';

export const XML_RULE_DATA: { [key: string]: RuleData } = {
  DuplicatedBlocks: {
    time: 10,
    type: CODE_SMELL,
    offset: 10,
    timeType: 'linear',
  },
  FailedUnitTests: {
    time: 10,
    type: BUG,
    offset: 10,
    timeType: 'linear',
  },
  IllegalTabCheck: {
    time: 2,
    type: CODE_SMELL,
  },
  IndentCheck: {
    time: 1,
    type: CODE_SMELL,
  },
  InsufficientBranchCoverage: {
    time: 5,
    type: CODE_SMELL,
    offset: 5,
    timeType: 'linear',
  },
  InsufficientCommentDensity: {
    time: 2,
    type: CODE_SMELL,
    offset: 2,
    timeType: 'linear',
  },
  InsufficientLineCoverage: {
    time: 2,
    type: CODE_SMELL,
    offset: 2,
    timeType: 'linear',
  },
  MistypedCDATASection: {
    time: 5,
    type: CODE_SMELL,
  },
  NewInlineCheck: {
    time: 2,
    type: CODE_SMELL,
  },
  SkippedUnitTests: {
    time: 10,
    type: CODE_SMELL,
    offset: 10,
    timeType: 'linear',
  },
  XPathCheck: {
    time: 0,
    type: CODE_SMELL,
  },

  S103: {
    time: 1,
    type: CODE_SMELL,
  },
  S125: {
    time: 5,
    type: CODE_SMELL,
  },
  S1134: {
    time: 5,
    type: CODE_SMELL,
  },
  S1135: {
    time: 5,
    type: CODE_SMELL,
  },
  S1778: {
    time: 5,
    type: BUG,
  },
  S2260: {
    time: 30,
    type: CODE_SMELL,
  },
};
