import { BUG, CODE_SMELL, RuleData, SECURITY_HOTSPOT, VULNERABILITY } from './codeScanValues';

export const JS_RULE_DATA: { [key: string]: RuleData } = {
  AssignmentInOperand: {
    time: 10,
    type: CODE_SMELL,
  },
  AvoidTrailingComma: {
    time: 2,
    type: CODE_SMELL,
  },
  AvoidWithStatement: {
    time: 10,
    type: CODE_SMELL,
  },
  ConsistentReturn: {
    time: 5,
    type: CODE_SMELL,
  },
  DuplicatedBlocks: {
    time: 10,
    type: CODE_SMELL,
    offset: 10,
    timeType: 'linear',
  },
  EqualComparison: {
    time: 2,
    type: CODE_SMELL,
  },
  FailedUnitTests: {
    time: 10,
    type: BUG,
    offset: 10,
    timeType: 'linear',
  },
  ForLoopsMustUseBraces: {
    time: 2,
    type: CODE_SMELL,
  },
  GlobalVariable: {
    time: 5,
    type: CODE_SMELL,
  },
  IfElseStmtsMustUseBraces: {
    time: 2,
    type: CODE_SMELL,
  },
  IfStmtsMustUseBraces: {
    time: 2,
    type: CODE_SMELL,
  },
  InnaccurateNumericLiteral: {
    time: 5,
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
  NoElseReturn: {
    time: 5,
    type: CODE_SMELL,
  },
  ScopeForInVariable: {
    time: 5,
    type: CODE_SMELL,
  },
  SkipedUnitTests: {
    time: 10,
    type: CODE_SMELL,
    offset: 10,
    timeType: 'linear',
  },
  UnnecessaryBlock: {
    time: 5,
    type: CODE_SMELL,
  },
  UnnecessaryParentheses: {
    time: 2,
    type: CODE_SMELL,
  },
  UnreachableCode: {
    time: 15,
    type: CODE_SMELL,
  },
  UseBaseWithParseInt: {
    time: 5,
    type: CODE_SMELL,
  },
  WhileLoopsMustUseBraces: {
    time: 2,
    type: CODE_SMELL,
  },

  'aura-api': {
    time: 30,
    type: BUG,
  },
  'dot-notation': {
    time: 5,
    type: CODE_SMELL,
  },
  'ecma-intrinsics': {
    time: 15,
    type: BUG,
  },
  eqeqeq: {
    time: 3,
    type: CODE_SMELL,
  },
  exception: {
    time: 5,
    type: BUG,
  },
  'files-must-compile': {
    time: 10,
    type: BUG,
  },
  'handle-callback-err': {
    time: 15,
    type: BUG,
  },
  'insecure-bundled-dependencies': {
    time: 30,
    type: VULNERABILITY,
  },
  'new-parens': {
    time: 2,
    type: CODE_SMELL,
  },
  'no-async-promise-executor': {
    time: 10,
    type: BUG,
  },
  'no-case-declarations': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-catch-shadow': {
    time: 10,
    type: BUG,
  },
  'no-cond-assign': {
    time: 10,
    type: BUG,
  },
  'no-console': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-constant-condition': {
    time: 15,
    type: BUG,
  },
  'no-control-regex': {
    time: 10,
    type: CODE_SMELL,
  },
  'no-debugger': {
    time: 5,
    type: VULNERABILITY,
  },
  'no-div-regex': {
    time: 2,
    type: CODE_SMELL,
  },
  'no-dupe-class-members': {
    time: 5,
    type: BUG,
  },
  'no-empty': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-empty-character-class': {
    time: 5,
    type: BUG,
  },
  'no-else-return': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-eq-null': {
    time: 10,
    type: BUG,
  },
  'no-ex-assign': {
    time: 10,
    type: BUG,
  },
  'no-extending-native': {
    time: 30,
    type: CODE_SMELL,
  },
  'no-extra-bind': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-extra-boolean-cast': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-fallthrough': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-floating-decimal': {
    time: 2,
    type: CODE_SMELL,
  },
  'no-func-assign': {
    time: 20,
    type: CODE_SMELL,
  },
  'no-global-assign': {
    time: 20,
    type: BUG,
  },
  'no-implied-eval': {
    time: 30,
    type: VULNERABILITY,
  },
  'no-inner-declarations': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-invalid-regexp': {
    time: 10,
    type: BUG,
  },
  'no-irregular-whitespace': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-iterator': {
    time: 10,
    type: CODE_SMELL,
  },
  'no-label-var': {
    time: 10,
    type: BUG,
  },
  'no-misleading-character-class': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-new': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-new-object': {
    time: 10,
    type: CODE_SMELL,
  },
  'no-new-wrappers': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-obj-calls': {
    time: 5,
    type: BUG,
  },
  'no-octal-escape': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-param-reassign': {
    time: 10,
    type: CODE_SMELL,
  },
  'no-plusplus': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-proto': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-prototype-builtins': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-redeclare': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-regex-spaces': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-return-assign': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-script-url': {
    time: 10,
    type: VULNERABILITY,
  },
  'no-self-assign': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-self-compare': {
    time: 5,
    type: BUG,
  },
  'no-shadow-restricted-names': {
    time: 15,
    type: BUG,
  },
  'no-sparse-arrays': {
    time: 2,
    type: BUG,
  },
  'no-throw-literal': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-undef': {
    time: 5,
    type: BUG,
  },
  'no-underscore-dangle': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-unexpected-multiline': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-unreachable': {
    time: 5,
    type: BUG,
  },
  'no-unsafe-finally': {
    time: 10,
    type: BUG,
  },
  'no-unused-expressions': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-unused-vars': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-useless-catch': {
    time: 10,
    type: CODE_SMELL,
  },
  'no-useless-escape': {
    time: 5,
    type: CODE_SMELL,
  },
  'secure-document': {
    time: 10,
    type: CODE_SMELL,
  },
  'secure-window': {
    time: 10,
    type: CODE_SMELL,
  },
  'valid-typeof': {
    time: 5,
    type: BUG,
  },
  'wrap-iife': {
    time: 5,
    type: BUG,
  },

  S100: {
    time: 5,
    type: CODE_SMELL,
  },
  S101: {
    time: 5,
    type: CODE_SMELL,
  },
  S103: {
    time: 1,
    type: CODE_SMELL,
  },
  S104: {
    time: 60,
    type: CODE_SMELL,
  },
  S105: {
    time: 2,
    type: CODE_SMELL,
  },
  S106: {
    time: 10,
    type: CODE_SMELL,
  },
  S107: {
    time: 20,
    type: CODE_SMELL,
  },
  S108: {
    time: 5,
    type: CODE_SMELL,
  },
  S109: {
    time: 5,
    type: CODE_SMELL,
  },
  S113: {
    time: 1,
    type: CODE_SMELL,
  },
  S117: {
    time: 2,
    type: CODE_SMELL,
  },
  S121: {
    time: 2,
    type: CODE_SMELL,
  },
  S122: {
    time: 1,
    type: CODE_SMELL,
  },
  S124: {
    time: 0,
    type: CODE_SMELL,
  },
  S125: {
    time: 5,
    type: CODE_SMELL,
  },
  S126: {
    time: 5,
    type: CODE_SMELL,
  },
  S128: {
    time: 10,
    type: CODE_SMELL,
  },
  S131: {
    time: 5,
    type: CODE_SMELL,
  },
  S134: {
    time: 10,
    type: CODE_SMELL,
  },
  S135: {
    time: 20,
    type: CODE_SMELL,
    offset: 20,
    timeType: 'linear',
  },
  S138: {
    time: 20,
    type: CODE_SMELL,
  },
  S139: {
    time: 1,
    type: CODE_SMELL,
  },
  S878: {
    time: 5,
    type: CODE_SMELL,
  },
  S881: {
    time: 5,
    type: CODE_SMELL,
  },
  S888: {
    time: 2,
    type: CODE_SMELL,
  },
  S905: {
    time: 10,
    type: BUG,
  },
  S909: {
    time: 5,
    type: CODE_SMELL,
  },
  S930: {
    time: 10,
    type: BUG,
  },
  S1066: {
    time: 5,
    type: CODE_SMELL,
  },
  S1067: {
    time: 5,
    type: CODE_SMELL,
    offset: 1,
    timeType: 'linear',
  },
  S1105: {
    time: 1,
    type: CODE_SMELL,
  },
  S1110: {
    time: 1,
    type: CODE_SMELL,
  },
  S1116: {
    time: 2,
    type: CODE_SMELL,
  },
  S1117: {
    time: 5,
    type: CODE_SMELL,
  },
  S1119: {
    time: 30,
    type: CODE_SMELL,
  },
  S1121: {
    time: 5,
    type: CODE_SMELL,
  },
  S1125: {
    time: 5,
    type: CODE_SMELL,
  },
  S1126: {
    time: 2,
    type: CODE_SMELL,
  },
  S1128: {
    time: 2,
    type: CODE_SMELL,
  },
  S1131: {
    time: 1,
    type: CODE_SMELL,
  },
  S1134: {
    time: 0,
    type: CODE_SMELL,
  },
  S1135: {
    time: 0,
    type: CODE_SMELL,
  },
  S1143: {
    time: 30,
    type: BUG,
  },
  S1145: {
    time: 2,
    type: BUG,
  },
  S1154: {
    time: 20,
    type: BUG,
  },
  S1172: {
    time: 5,
    type: CODE_SMELL,
  },
  S1186: {
    time: 5,
    type: CODE_SMELL,
  },
  S1192: {
    time: 2,
    type: CODE_SMELL,
    offset: 2,
    timeType: 'linear',
  },
  S1219: {
    time: 10,
    type: CODE_SMELL,
  },
  S1226: {
    time: 5,
    type: BUG,
  },
  S1264: {
    time: 5,
    type: CODE_SMELL,
  },
  S1314: {
    time: 5,
    type: CODE_SMELL,
  },
  S1321: {
    time: 30,
    type: BUG,
  },
  S1330: {
    time: 5,
    type: CODE_SMELL,
  },
  S1438: {
    time: 1,
    type: CODE_SMELL,
  },
  S1439: {
    time: 20,
    type: CODE_SMELL,
  },
  S1440: {
    time: 60,
    type: CODE_SMELL,
  },
  S1441: {
    time: 1,
    type: CODE_SMELL,
  },
  S1442: {
    time: 10,
    type: VULNERABILITY,
  },
  S1451: {
    time: 5,
    type: CODE_SMELL,
  },
  S1472: {
    time: 5,
    type: CODE_SMELL,
  },
  S1479: {
    time: 30,
    type: CODE_SMELL,
  },
  S1481: {
    time: 5,
    type: CODE_SMELL,
  },
  S1488: {
    time: 2,
    type: CODE_SMELL,
  },
  S1515: {
    time: 30,
    type: CODE_SMELL,
  },
  S1516: {
    time: 5,
    type: CODE_SMELL,
  },
  S1517: {
    time: 15,
    type: BUG,
  },
  S1526: {
    time: 10,
    type: CODE_SMELL,
  },
  S1523: {
    time: 30,
    type: SECURITY_HOTSPOT,
  },
  S1525: {
    time: 5,
    type: VULNERABILITY,
  },
  S1527: {
    time: 5,
    type: CODE_SMELL,
  },
  S1528: {
    time: 5,
    type: CODE_SMELL,
  },
  S1529: {
    time: 5,
    type: BUG,
  },
  S1530: {
    time: 5,
    type: BUG,
  },
  S1531: {
    time: 5,
    type: CODE_SMELL,
  },
  S1532: {
    time: 5,
    type: CODE_SMELL,
  },
  S1533: {
    time: 1,
    type: CODE_SMELL,
  },
  S1534: {
    time: 5,
    type: BUG,
  },
  S1535: {
    time: 5,
    type: BUG,
  },
  S1536: {
    time: 5,
    type: BUG,
  },
  S1537: {
    time: 1,
    type: CODE_SMELL,
  },
  S1539: {
    time: 5,
    type: CODE_SMELL,
  },
  S1541: {
    time: 10,
    type: CODE_SMELL,
    offset: 1,
    timeType: 'linear',
  },
  S1656: {
    time: 3,
    type: BUG,
  },
  S1697: {
    time: 2,
    type: BUG,
  },
  S1736: {
    time: 5,
    type: BUG,
  },
  S1751: {
    time: 5,
    type: BUG,
  },
  S1764: {
    time: 2,
    type: BUG,
  },
  S1774: {
    time: 5,
    type: CODE_SMELL,
  },
  S1788: {
    time: 20,
    type: CODE_SMELL,
  },
  S1821: {
    time: 10,
    type: CODE_SMELL,
  },
  S1848: {
    time: 5,
    type: BUG,
  },
  S1854: {
    time: 15,
    type: CODE_SMELL,
  },
  S1862: {
    time: 10,
    type: BUG,
  },
  S1871: {
    time: 10,
    type: CODE_SMELL,
  },
  S1940: {
    time: 2,
    type: CODE_SMELL,
  },
  S1994: {
    time: 20,
    type: CODE_SMELL,
  },
  S2068: {
    time: 5,
    type: SECURITY_HOTSPOT,
  },
  S2077: {
    time: 20,
    type: SECURITY_HOTSPOT,
  },
  S2123: {
    time: 5,
    type: BUG,
  },
  S2137: {
    time: 10,
    type: BUG,
  },
  S2138: {
    time: 2,
    type: CODE_SMELL,
  },
  S2189: {
    time: 15,
    type: BUG,
  },
  S2201: {
    time: 5,
    type: BUG,
  },
  S2208: {
    time: 5,
    type: CODE_SMELL,
  },
  S2234: {
    time: 5,
    type: BUG,
  },
  S2245: {
    time: 10,
    type: SECURITY_HOTSPOT,
  },
  S2251: {
    time: 5,
    type: BUG,
  },
  S2255: {
    time: 5,
    type: SECURITY_HOTSPOT,
  },
  S2259: {
    time: 10,
    type: BUG,
  },
  S2260: {
    time: 30,
    type: CODE_SMELL,
  },
  S2310: {
    time: 5,
    type: CODE_SMELL,
  },
  S2392: {
    time: 2,
    type: CODE_SMELL,
  },
  S2376: {
    time: 5,
    type: BUG,
  },
  S2424: {
    time: 20,
    type: BUG,
  },
  S2427: {
    time: 2,
    type: BUG,
  },
  S2428: {
    time: 15,
    type: CODE_SMELL,
  },
  S2432: {
    time: 5,
    type: BUG,
  },
  S2508: {
    time: 5,
    type: BUG,
  },
  S2549: {
    time: 30,
    type: BUG,
  },
  S2550: {
    time: 5,
    type: BUG,
  },
  S2583: {
    time: 15,
    type: BUG,
  },
  S2589: {
    time: 10,
    type: CODE_SMELL,
  },
  S2611: {
    time: 15,
    type: VULNERABILITY,
  },
  S2681: {
    time: 5,
    type: CODE_SMELL,
  },
  S2685: {
    time: 30,
    type: CODE_SMELL,
  },
  S2688: {
    time: 5,
    type: BUG,
  },
  S2692: {
    time: 2,
    type: CODE_SMELL,
  },
  S2703: {
    time: 2,
    type: CODE_SMELL,
  },
  S2713: {
    time: 5,
    type: CODE_SMELL,
  },
  S2714: {
    time: 2,
    type: CODE_SMELL,
  },
  S2715: {
    time: 5,
    type: CODE_SMELL,
  },
  S2716: {
    time: 10,
    type: CODE_SMELL,
  },
  S2737: {
    time: 5,
    type: CODE_SMELL,
  },
  S2757: {
    time: 2,
    type: BUG,
  },
  S2762: {
    time: 2,
    type: CODE_SMELL,
    offset: 1,
    timeType: 'linear',
  },
  S2769: {
    time: 2,
    type: BUG,
  },
  S2770: {
    time: 20,
    type: CODE_SMELL,
  },
  S2814: {
    time: 20,
    type: CODE_SMELL,
  },
  S2817: {
    time: 120,
    type: VULNERABILITY,
  },
  S2819: {
    time: 5,
    type: SECURITY_HOTSPOT,
  },
  S2870: {
    time: 5,
    type: CODE_SMELL,
  },
  S2873: {
    time: 5,
    type: BUG,
  },
  S2898: {
    time: 2,
    type: CODE_SMELL,
  },
  S2990: {
    time: 5,
    type: CODE_SMELL,
  },
  S2999: {
    time: 10,
    type: BUG,
  },
  S3001: {
    time: 10,
    type: BUG,
  },
  S3002: {
    time: 15,
    type: CODE_SMELL,
  },
  S3003: {
    time: 5,
    type: CODE_SMELL,
  },
  S3271: {
    time: 60,
    type: CODE_SMELL,
    offset: 5,
    timeType: 'linear',
  },
  S3317: {
    time: 5,
    type: BUG,
  },
  S3353: {
    time: 2,
    type: CODE_SMELL,
  },
  S3358: {
    time: 5,
    type: CODE_SMELL,
  },
  S3402: {
    time: 15,
    type: CODE_SMELL,
  },
  S3403: {
    time: 5,
    type: BUG,
  },
  S3498: {
    time: 1,
    type: CODE_SMELL,
  },
  S3499: {
    time: 1,
    type: CODE_SMELL,
  },
  S3500: {
    time: 15,
    type: BUG,
  },
  S3504: {
    time: 5,
    type: CODE_SMELL,
  },
  S3509: {
    time: 15,
    type: CODE_SMELL,
  },
  S3512: {
    time: 5,
    type: CODE_SMELL,
  },
  S3513: {
    time: 5,
    type: CODE_SMELL,
  },
  S3514: {
    time: 5,
    type: CODE_SMELL,
  },
  S3516: {
    time: 2,
    type: CODE_SMELL,
    offset: 2,
    timeType: 'linear',
  },
  S3523: {
    time: 5,
    type: CODE_SMELL,
  },
  S3524: {
    time: 2,
    type: CODE_SMELL,
  },
  S3525: {
    time: 5,
    type: CODE_SMELL,
  },
  S3531: {
    time: 5,
    type: BUG,
  },
  S3533: {
    time: 5,
    type: CODE_SMELL,
  },
  S3579: {
    time: 10,
    type: CODE_SMELL,
  },
  S3616: {
    time: 5,
    type: BUG,
  },
  S3626: {
    time: 1,
    type: CODE_SMELL,
  },
  S3686: {
    time: 15,
    type: CODE_SMELL,
  },
  S3696: {
    time: 20,
    type: CODE_SMELL,
  },
  S3699: {
    time: 5,
    type: BUG,
  },
  S3723: {
    time: 2,
    type: CODE_SMELL,
  },
  S3735: {
    time: 5,
    type: CODE_SMELL,
  },
  S3757: {
    time: 10,
    type: CODE_SMELL,
  },
  S3758: {
    time: 10,
    type: CODE_SMELL,
  },
  S3759: {
    time: 10,
    type: BUG,
  },
  S3760: {
    time: 2,
    type: CODE_SMELL,
  },
  S3776: {
    time: 5,
    type: CODE_SMELL,
    offset: 1,
    timeType: 'linear',
  },
  S3782: {
    time: 5,
    type: CODE_SMELL,
  },
  S3785: {
    time: 5,
    type: BUG,
  },
  S3786: {
    time: 1,
    type: BUG,
  },
  S3796: {
    time: 5,
    type: BUG,
  },
  S3798: {
    time: 5,
    type: CODE_SMELL,
  },
  S3799: {
    time: 5,
    type: BUG,
  },
  S3800: {
    time: 20,
    type: CODE_SMELL,
  },
  S3801: {
    time: 20,
    type: CODE_SMELL,
  },
  S3812: {
    time: 1,
    type: BUG,
  },
  S3827: {
    time: 10,
    type: BUG,
  },
  S3828: {
    time: 5,
    type: BUG,
  },
  S3834: {
    time: 5,
    type: BUG,
  },
  S3854: {
    time: 5,
    type: BUG,
  },
  S3863: {
    time: 1,
    type: CODE_SMELL,
  },
  S3923: {
    time: 15,
    type: BUG,
  },
  S3972: {
    time: 10,
    type: CODE_SMELL,
  },
  S3973: {
    time: 10,
    type: CODE_SMELL,
  },
  S3981: {
    time: 2,
    type: BUG,
  },
  S3984: {
    time: 2,
    type: BUG,
  },
  S4030: {
    time: 2,
    type: CODE_SMELL,
  },
  S4043: {
    time: 5,
    type: CODE_SMELL,
  },
  S4123: {
    time: 1,
    type: CODE_SMELL,
  },
  S4140: {
    time: 5,
    type: CODE_SMELL,
  },
  S4143: {
    time: 5,
    type: BUG,
  },
  S4144: {
    time: 15,
    type: CODE_SMELL,
  },
  S4139: {
    time: 5,
    type: CODE_SMELL,
  },
  S4158: {
    time: 15,
    type: BUG,
  },
  S4165: {
    time: 5,
    type: CODE_SMELL,
  },
  S4275: {
    time: 5,
    type: BUG,
  },
  S4326: {
    time: 1,
    type: CODE_SMELL,
  },
  S4524: {
    time: 5,
    type: CODE_SMELL,
  },
  S4624: {
    time: 10,
    type: CODE_SMELL,
  },
  S4721: {
    time: 0,
    type: SECURITY_HOTSPOT,
  },
  S4784: {
    time: 0,
    type: SECURITY_HOTSPOT,
  },
  S4787: {
    time: 0,
    type: SECURITY_HOTSPOT,
  },
  S4790: {
    time: 0,
    type: SECURITY_HOTSPOT,
  },
  S4817: {
    time: 0,
    type: SECURITY_HOTSPOT,
  },
  S4818: {
    time: 0,
    type: SECURITY_HOTSPOT,
  },
  S4823: {
    time: 0,
    type: SECURITY_HOTSPOT,
  },
  S4829: {
    time: 0,
    type: SECURITY_HOTSPOT,
  },
  S5122: {
    time: 0,
    type: SECURITY_HOTSPOT,
  },
};
