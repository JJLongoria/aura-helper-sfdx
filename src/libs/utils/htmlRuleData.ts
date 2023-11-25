import { BUG, CODE_SMELL, RuleData, VULNERABILITY } from './codeScanValues';

export const HTML_RULE_DATA: { [key: string]: RuleData } = {
  AvoidCommentedOutCodeCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  AvoidHtmlCommentCheck: {
    time: 2,
    type: CODE_SMELL,
  },
  AvoidInlineStyles: {
    time: 5,
    type: CODE_SMELL,
  },
  BoldAndItalicTagsCheck: {
    time: 2,
    type: BUG,
  },
  ChildElementIllegalCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  ChildElementRequiredCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  ComplexityCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  DoctypePresenceCheck: {
    time: 5,
    type: BUG,
  },
  DoubleQuotesCheck: {
    time: 1,
    type: CODE_SMELL,
  },
  DuplicatedBlocks: {
    time: 10,
    type: CODE_SMELL,
    offset: 10,
    timeType: 'linear',
  },
  DynamicJsIncludeCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  FailedUnitTests: {
    time: 10,
    type: BUG,
    offset: 10,
    timeType: 'linear',
  },
  FieldsetWithoutLegendCheck: {
    time: 5,
    type: BUG,
  },
  FileLengthCheck: {
    time: 60,
    type: CODE_SMELL,
  },
  FlashUsesBothObjectAndEmbedCheck: {
    time: 10,
    type: CODE_SMELL,
  },
  FrameWithoutTitleCheck: {
    time: 5,
    type: BUG,
  },
  HeaderCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  IllegalAttributeCheck: {
    time: 2,
    type: CODE_SMELL,
  },
  IllegalElementCheck: {
    time: 2,
    type: CODE_SMELL,
  },
  IllegalNamespaceCheck: {
    time: 2,
    type: CODE_SMELL,
  },
  IllegalTabCheck: {
    time: 2,
    type: CODE_SMELL,
  },
  IllegalTagLibsCheck: {
    time: 60,
    type: CODE_SMELL,
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
  InputWithoutLabelCheck: {
    time: 5,
    type: BUG,
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
  InternationalizationCheck: {
    time: 15,
    type: BUG,
  },
  ItemTagNotWithinContainerTagCheck: {
    time: 10,
    type: BUG,
  },
  JspScriptletCheck: {
    time: 30,
    type: CODE_SMELL,
  },
  LibraryDependencyCheck: {
    time: 0,
    type: CODE_SMELL,
  },
  LinksIdenticalTextsDifferentTargetsCheck: {
    time: 15,
    type: CODE_SMELL,
  },
  LinkToImageCheck: {
    time: 15,
    type: CODE_SMELL,
  },
  LinkToNothingCheck: {
    time: 15,
    type: BUG,
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
  MultiplePageDirectivesCheck: {
    time: 2,
    type: CODE_SMELL,
  },
  NonConsecutiveHeadingCheck: {
    time: 10,
    type: CODE_SMELL,
  },
  PageWithoutFaviconCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  PageWithoutTitleCheck: {
    time: 5,
    type: BUG,
  },
  ParentElementIllegalCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  ParentElementRequiredCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  RequiredAttributeCheck: {
    time: 5,
    type: CODE_SMELL,
  },
  ServerSideImageMapsCheck: {
    time: 60,
    type: BUG,
  },
  SkippedUnitTests: {
    time: 10,
    type: CODE_SMELL,
    offset: 10,
    timeType: 'linear',
  },
  TableHeaderHasIdOrScopeCheck: {
    time: 5,
    type: BUG,
  },
  TableWithoutCaptionCheck: {
    time: 5,
    type: BUG,
  },
  UnclosedTagCheck: {
    time: 2,
    type: BUG,
  },
  UnifiedExpressionCheck: {
    time: 2,
    type: BUG,
  },
  UnnecessaryTypeAttribute: {
    time: 5,
    type: CODE_SMELL,
  },
  UnsupportedTagsInHtml5Check: {
    time: 20,
    type: BUG,
  },
  UseAltAttributeForImages: {
    time: 5,
    type: CODE_SMELL,
  },
  WhiteSpaceAroundCheck: {
    time: 1,
    type: CODE_SMELL,
  },
  WmodelsWindowCheck: {
    time: 10,
    type: BUG,
  },

  S1134: {
    time: 5,
    type: CODE_SMELL,
  },
  S1135: {
    time: 5,
    type: CODE_SMELL,
  },
  S1436: {
    time: 5,
    type: CODE_SMELL,
  },
  S1827: {
    time: 5,
    type: CODE_SMELL,
  },
  S1829: {
    time: 5,
    type: CODE_SMELL,
  },
  S4084: {
    time: 5,
    type: CODE_SMELL,
  },
  S4645: {
    time: 2,
    type: BUG,
  },
  S5148: {
    time: 1,
    type: VULNERABILITY,
  },
  S5254: {
    time: 5,
    type: BUG,
  },
  S5255: {
    time: 5,
    type: CODE_SMELL,
  },
  S5256: {
    time: 5,
    type: CODE_SMELL,
  },
  S5257: {
    time: 5,
    type: CODE_SMELL,
  },
  S5258: {
    time: 5,
    type: CODE_SMELL,
  },
  S5260: {
    time: 0,
    type: BUG,
  },
  S5264: {
    time: 5,
    type: CODE_SMELL,
  },
};
