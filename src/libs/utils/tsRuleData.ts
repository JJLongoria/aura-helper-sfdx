import { BUG, CODE_SMELL, RuleData, SECURITY_HOTSPOT, VULNERABILITY } from './codeScanValues';

export const TS_RULE_DATA: { [key: string]: RuleData } = {
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
  SkipedUnitTests: {
    time: 10,
    type: CODE_SMELL,
    offset: 10,
    timeType: 'linear',
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
    time: 5,
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
  S134: {
    time: 10,
    type: CODE_SMELL,
  },
  S138: {
    time: 20,
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
  S1128: {
    time: 2,
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
  S1301: {
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
  S1523: {
    time: 30,
    type: SECURITY_HOTSPOT,
  },
  S1526: {
    time: 10,
    type: CODE_SMELL,
  },
  S1525: {
    time: 5,
    type: VULNERABILITY,
  },
  S1529: {
    time: 5,
    type: BUG,
  },
  S1530: {
    time: 5,
    type: BUG,
  },
  S1533: {
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
  S1751: {
    time: 5,
    type: BUG,
  },
  S1764: {
    time: 2,
    type: BUG,
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
  S1874: {
    time: 15,
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
  S2255: {
    time: 5,
    type: SECURITY_HOTSPOT,
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
  S2427: {
    time: 2,
    type: BUG,
  },
  S2589: {
    time: 10,
    type: CODE_SMELL,
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
  S2737: {
    time: 5,
    type: CODE_SMELL,
  },
  S2757: {
    time: 2,
    type: BUG,
  },
  S2814: {
    time: 20,
    type: CODE_SMELL,
  },
  S2870: {
    time: 5,
    type: CODE_SMELL,
  },
  S2871: {
    time: 5,
    type: CODE_SMELL,
  },
  S2933: {
    time: 2,
    type: CODE_SMELL,
  },
  S2966: {
    time: 15,
    type: CODE_SMELL,
  },
  S3257: {
    time: 1,
    type: CODE_SMELL,
  },
  S3317: {
    time: 5,
    type: BUG,
  },
  S3353: {
    time: 2,
    type: CODE_SMELL,
  },
  S3402: {
    time: 15,
    type: CODE_SMELL,
  },
  S3498: {
    time: 1,
    type: CODE_SMELL,
  },
  S3499: {
    time: 1,
    type: CODE_SMELL,
  },
  S3504: {
    time: 5,
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
  S3524: {
    time: 2,
    type: CODE_SMELL,
  },
  S3533: {
    time: 5,
    type: CODE_SMELL,
  },
  S3626: {
    time: 1,
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
  S3776: {
    time: 5,
    type: CODE_SMELL,
    offset: 1,
    timeType: 'linear',
  },
  S3786: {
    time: 1,
    type: BUG,
  },
  S3799: {
    time: 5,
    type: BUG,
  },
  S3801: {
    time: 20,
    type: CODE_SMELL,
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
  S3984: {
    time: 2,
    type: BUG,
  },
  S4023: {
    time: 2,
    type: CODE_SMELL,
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
  S4124: {
    time: 5,
    type: BUG,
  },
  S4137: {
    time: 5,
    type: CODE_SMELL,
  },
  S4138: {
    time: 5,
    type: CODE_SMELL,
  },
  S4136: {
    time: 1,
    type: CODE_SMELL,
  },
  S4139: {
    time: 5,
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
  S4156: {
    time: 5,
    type: CODE_SMELL,
  },
  S4157: {
    time: 2,
    type: CODE_SMELL,
  },
  S4158: {
    time: 15,
    type: BUG,
  },
  S4204: {
    time: 5,
    type: CODE_SMELL,
  },
  S4275: {
    time: 5,
    type: BUG,
  },
  S4322: {
    time: 2,
    type: CODE_SMELL,
  },
  S4323: {
    time: 5,
    type: CODE_SMELL,
  },
  S4324: {
    time: 2,
    type: CODE_SMELL,
  },
  S4325: {
    time: 1,
    type: CODE_SMELL,
  },
  S4326: {
    time: 1,
    type: CODE_SMELL,
  },
  S4327: {
    time: 10,
    type: CODE_SMELL,
  },
  S4328: {
    time: 2,
    type: CODE_SMELL,
  },
  S4335: {
    time: 5,
    type: BUG,
  },
  S4524: {
    time: 5,
    type: CODE_SMELL,
  },
  S4619: {
    time: 5,
    type: BUG,
  },
  S4621: {
    time: 1,
    type: CODE_SMELL,
  },
  S4622: {
    time: 5,
    type: CODE_SMELL,
  },
  S4623: {
    time: 1,
    type: CODE_SMELL,
  },
  S4624: {
    time: 10,
    type: CODE_SMELL,
  },
  S4634: {
    time: 0,
    type: CODE_SMELL,
  },
  S4721: {
    time: 0,
    type: SECURITY_HOTSPOT,
  },
  S4782: {
    time: 1,
    type: CODE_SMELL,
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
  S4798: {
    time: 5,
    type: CODE_SMELL,
  },
  S4817: {
    time: 0,
    type: SECURITY_HOTSPOT,
  },
  S4818: {
    time: 0,
    type: SECURITY_HOTSPOT,
  },
  S4822: {
    time: 5,
    type: BUG,
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
