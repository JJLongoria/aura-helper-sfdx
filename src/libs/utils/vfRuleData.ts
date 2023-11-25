import { BUG, CODE_SMELL, RuleData, SECURITY_HOTSPOT, VULNERABILITY } from './codeScanValues';

export const VF_RULE_DATA: { [key: string]: RuleData } = {
  AvoidApexInScript: {
    time: 30,
    type: CODE_SMELL,
  },
  AvoidDotNamespace: {
    time: 5,
    type: CODE_SMELL,
  },
  AvoidExternalResources: {
    time: 15,
    type: VULNERABILITY,
  },
  AvoidHardCodedPageLink: {
    time: 5,
    type: CODE_SMELL,
  },
  AvoidHardCodedResourceReferences: {
    time: 5,
    type: CODE_SMELL,
  },
  AvoidHighActionPollerInterval: {
    time: 5,
    type: CODE_SMELL,
  },
  AvoidHtmlCommentCheck: {
    time: 2,
    type: CODE_SMELL,
  },
  AvoidLinkingToRecordIds: {
    time: 30,
    type: CODE_SMELL,
  },
  AvoidMultipleForms: {
    time: 15,
    type: CODE_SMELL,
  },
  AvoidTabCharacter: {
    time: 2,
    type: CODE_SMELL,
  },
  BoldTagsCheck: {
    time: 10,
    type: CODE_SMELL,
  },
  CrossSiteScriptingReflected: {
    time: 10,
    type: VULNERABILITY,
  },
  DoubleQuotesCheck: {
    time: 2,
    type: CODE_SMELL,
  },
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
  HeaderCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  HotstopGetSessionIdUsage: {
    time: 30,
    type: SECURITY_HOTSPOT,
  },
  ImgWithoutAltCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  ImgWithoutWidthOtHeightCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  InlineStyleAttributesCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  InlineStyleCheck: {
    time: 5,
    type: VULNERABILITY,
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
  InputImgWithoutAltCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  InputImgWithoutWidthOtHeightCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  ItalicTagCheck: {
    time: 10,
    type: CODE_SMELL,
  },
  LightningAvoidHardcodedSalesforceDomain: {
    time: 60,
    type: CODE_SMELL,
  },
  LightningAvoidUsingSession: {
    time: 60,
    type: CODE_SMELL,
  },
  LightningEnhancedListCheck: {
    time: 30,
    type: CODE_SMELL,
  },
  LightningIframeCheck: {
    time: 30,
    type: CODE_SMELL,
  },
  LightningPageCheck: {
    time: 30,
    type: CODE_SMELL,
  },
  LongJavaScriptCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  MaxLineLengthCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  MetaRefreshCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  MouseEventWithoutKeyboardEquivalentCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  NonConsecutiveHeadingCheck: {
    time: 10,
    type: CODE_SMELL,
  },
  NoOnClickJavascript: {
    time: 15,
    type: CODE_SMELL,
  },
  OldPageApiVersion: {
    time: 15,
    type: CODE_SMELL,
  },
  PasswordAutocompleteCheck: {
    time: 10,
    type: VULNERABILITY,
  },
  RequireConfirmationToken: {
    time: 15,
    type: CODE_SMELL,
  },
  SkippedUnitTests: {
    time: 10,
    type: CODE_SMELL,
    offset: 10,
    timeType: 'linear',
  },
  unknown: {
    time: 5,
    type: CODE_SMELL,
  },
  UnencodedScript: {
    time: 15,
    type: VULNERABILITY,
  },
  UnencodedStyle: {
    time: 15,
    type: VULNERABILITY,
  },
  UnescapedAttributes: {
    time: 15,
    type: VULNERABILITY,
  },
  UnsupportedTagsInHtml5Check: {
    time: 5,
    type: CODE_SMELL,
  },
  VfCsrf: {
    time: 30,
    type: VULNERABILITY,
  },
  VfHtmlStyleTagXss: {
    time: 15,
    type: VULNERABILITY,
  },
  VfUnescapeEl: {
    time: 15,
    type: VULNERABILITY,
  },
  XPathRule: {
    time: 0,
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
  'handle-callback-err': {
    time: 15,
    type: BUG,
  },
  'no-catch-shadow': {
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
  'no-div-regex': {
    time: 2,
    type: CODE_SMELL,
  },
  'no-else-return': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-empty': {
    time: 5,
    type: BUG,
  },
  'no-empty-character-class': {
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
  'no-extend-native': {
    time: 30,
    type: CODE_SMELL,
  },
  'no-extra-boolean-cast': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-extra-bind': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-floating-var': {
    time: 2,
    type: CODE_SMELL,
  },
  'no-func-assign': {
    time: 5,
    type: BUG,
  },
  'no-global-assign': {
    time: 20,
    type: BUG,
  },
  'no-implied-eval': {
    time: 30,
    type: VULNERABILITY,
  },
  'no-invalid-regexp': {
    time: 10,
    type: BUG,
  },
  'no-iterator': {
    time: 10,
    type: CODE_SMELL,
  },
  'no-irregular-whitespace': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-label-var': {
    time: 10,
    type: BUG,
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
  'no-octal-space': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-param-reassign': {
    time: 10,
    type: CODE_SMELL,
  },
  'new-parens': {
    time: 2,
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
  'no-underscore-dangle': {
    time: 5,
    type: CODE_SMELL,
  },
  'no-undef': {
    time: 5,
    type: BUG,
  },
  'no-unreachable': {
    time: 5,
    type: BUG,
  },
  'no-unused-expressions': {
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
};
