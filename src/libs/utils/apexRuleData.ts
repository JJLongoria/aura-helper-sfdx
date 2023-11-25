import { BUG, CODE_SMELL, RuleData, SECURITY_HOTSPOT, VULNERABILITY } from './codeScanValues';

export const APEX_RULE_DATA: { [key: string]: RuleData } = {
  AuraEnabledWithoutCatchBlock: {
    time: 15,
    type: CODE_SMELL,
  },
  AbstractClassWithoutAbstractMethod: {
    time: 5,
    type: CODE_SMELL,
  },
  AbstractClassWithoutAnyMethod: {
    time: 5,
    type: CODE_SMELL,
  },
  AbstractNaming: {
    time: 5,
    type: CODE_SMELL,
  },
  AddEmptyString: {
    time: 5,
    type: CODE_SMELL,
  },
  ApexAssertionsShouldIncludeMessage: {
    time: 10,
    type: CODE_SMELL,
  },
  ApexCSRF: {
    time: 30,
    type: VULNERABILITY,
  },
  ApexUnitTestClassShouldHaveAsserts: {
    time: 15,
    type: CODE_SMELL,
  },
  ApexUnitTestClassShouldHaveRunAs: {
    time: 15,
    type: CODE_SMELL,
  },
  ApexUnitTestMethodShouldHaveIsTestAnnotation: {
    time: 5,
    type: CODE_SMELL,
  },
  ApexUnitTestShouldNotUseSeeAllDataTrue: {
    time: 15,
    type: CODE_SMELL,
  },
  ApexBadCrypto: {
    time: 30,
    type: SECURITY_HOTSPOT,
  },
  ApexCRUDViolation: {
    time: 10,
    type: SECURITY_HOTSPOT,
  },
  ApexDangerousMethods: {
    time: 20,
    type: SECURITY_HOTSPOT,
  },
  ApexDoc: {
    time: 5,
    type: CODE_SMELL,
  },
  ApexOpenRedirect: {
    time: 15,
    type: VULNERABILITY,
  },
  ApexSharingViolations: {
    time: 10,
    type: SECURITY_HOTSPOT,
  },
  ApexSOQLInjection: {
    time: 60,
    type: VULNERABILITY,
  },
  ApexSuggestUsingNamedCred: {
    time: 10,
    type: SECURITY_HOTSPOT,
  },
  ApexXSSFromEscapeFalse: {
    time: 15,
    type: VULNERABILITY,
  },
  ApexXSSFromURLParam: {
    time: 15,
    type: VULNERABILITY,
  },
  ArrayIsStoredDirectly: {
    time: 5,
    type: VULNERABILITY,
  },
  AssertEqualsOrder: {
    time: 5,
    type: CODE_SMELL,
  },
  AssignmentInOperand: {
    time: 10,
    type: CODE_SMELL,
  },
  AssigmentToNonFinalStatic: {
    time: 5,
    type: BUG,
  },
  AtLeastOneConstructor: {
    time: 5,
    type: CODE_SMELL,
  },
  AuraControllerNaming: {
    time: 30,
    type: CODE_SMELL,
  },
  AvoidBranchingStatementAsLastInLoop: {
    time: 10,
    type: CODE_SMELL,
  },
  AvoidCatchingGenericException: {
    time: 15,
    type: CODE_SMELL,
  },
  AvoidCatchingNPE: {
    time: 5,
    type: CODE_SMELL,
  },
  AvoidCatchingThrowable: {
    time: 20,
    type: CODE_SMELL,
  },
  AvoidConstantsInterface: {
    time: 10,
    type: CODE_SMELL,
  },
  AvoidDebugStatements: {
    time: 2,
    offset: 2,
    type: CODE_SMELL,
    timeType: 'linear',
  },
  AvoidDeeplyNestedIfStmts: {
    time: 10,
    type: CODE_SMELL,
  },
  AvoidDirectAccessTriggerMap: {
    time: 15,
    type: BUG,
  },
  AvoidDMLInUnitTests: {
    time: 20,
    type: CODE_SMELL,
  },
  AvoidDmlStatementsInLoops: {
    time: 15,
    type: CODE_SMELL,
  },
  AvoidDuplicateLiterals: {
    time: 2,
    offset: 2,
    type: CODE_SMELL,
    timeType: 'linear',
  },
  AvoidFieldNameMatchingMethodName: {
    time: 10,
    type: CODE_SMELL,
  },
  AvoidFieldNameMatchingTypeName: {
    time: 10,
    type: CODE_SMELL,
  },
  AvoidFinalLocalVariable: {
    time: 10,
    type: CODE_SMELL,
  },
  AvoidForLoopToJustAddElementsToCollection: {
    time: 10,
    type: CODE_SMELL,
  },
  AvoidGetSetMethods: {
    time: 15,
    type: CODE_SMELL,
  },
  AvoidGlobalModifier: {
    time: 30,
    type: CODE_SMELL,
  },
  AvoidHardCodedCredential: {
    time: 30,
    type: VULNERABILITY,
  },
  AvoidHardCodedError: {
    time: 15,
    type: CODE_SMELL,
  },
  AvoidHardcodingId: {
    time: 15,
    type: BUG,
  },
  AvoidHttpReferer: {
    time: 30,
    type: VULNERABILITY,
  },
  AvoidInsercureCookies: {
    time: 30,
    type: VULNERABILITY,
  },
  AvoidInsecureMessageDigests: {
    time: 30,
    type: VULNERABILITY,
  },
  AvoidInstanceofChecksInCatchClause: {
    time: 10,
    type: CODE_SMELL,
  },
  AvoidInstantiatingObjectsInLoops: {
    time: 15,
    type: CODE_SMELL,
  },
  AvoidLiteralsInIfCondition: {
    time: 10,
    type: CODE_SMELL,
  },
  AvoidLogicInTrigger: {
    time: 15,
    type: CODE_SMELL,
  },
  AvoidLoosingExceptionInformation: {
    time: 10,
    type: BUG,
  },
  AvoidMethodsBeforeInitializers: {
    time: 10,
    type: BUG,
  },
  AvoidMultipleUnaryOperators: {
    time: 5,
    type: CODE_SMELL,
  },
  AvoidNestedSwitchStmts: {
    time: 10,
    type: CODE_SMELL,
  },
  AvoidNonExistentAnnotations: {
    time: 10,
    type: CODE_SMELL,
  },
  AvoidNotFinalPublicStaticFields: {
    time: 30,
    type: BUG,
  },
  AvoidOutboundCallsInBatchApex: {
    time: 15,
    type: CODE_SMELL,
  },
  AvoidPublicFields: {
    time: 30,
    type: VULNERABILITY,
  },
  AvoidPrefixingMethodParameters: {
    time: 10,
    type: CODE_SMELL,
  },
  AvoidProtectedFieldInFinalClass: {
    time: 5,
    type: CODE_SMELL,
  },
  AvoidReassigningParameters: {
    time: 5,
    type: BUG,
  },
  AvoidReversedOperators: {
    time: 10,
    type: BUG,
  },
  AvoidRethrowingException: {
    time: 10,
    type: CODE_SMELL,
  },
  AvoidSalesforceSystemClassNames: {
    time: 15,
    type: CODE_SMELL,
  },
  AvoidSizeOfSoql: {
    time: 20,
    type: BUG,
  },
  AvoidSoqlAggregate: {
    time: 60,
    type: CODE_SMELL,
  },
  AvoidSoqlInControllerGetter: {
    time: 30,
    type: CODE_SMELL,
  },
  AvoidSoqlInLoops: {
    time: 15,
    type: CODE_SMELL,
  },
  AvoidSoslInLoops: {
    time: 15,
    type: CODE_SMELL,
  },
  AvoidSoqlWithNegativeLogic: {
    time: 15,
    type: CODE_SMELL,
  },
  AvoidSoqlWithNullInWhere: {
    time: 15,
    type: CODE_SMELL,
  },
  AvoidSoqlWithoutLimits: {
    time: 15,
    type: CODE_SMELL,
  },
  AvoidTabCharacter: {
    time: 2,
    type: CODE_SMELL,
  },
  AvoidThrowingNewInstanceOfSameException: {
    time: 10,
    type: CODE_SMELL,
  },
  AvoidUsingBatchApexInTrigger: {
    time: 15,
    type: CODE_SMELL,
  },
  AvoidUsingHardCodeIP: {
    time: 30,
    type: VULNERABILITY,
  },
  AvoidUsingHardCodedId: {
    time: 30,
    type: BUG,
  },
  AvoidUsingSeeAllData: {
    time: 30,
    type: CODE_SMELL,
  },
  AvoidUsingTestIsRunningTest: {
    time: 20,
    type: CODE_SMELL,
  },
  BadCrypto: {
    time: 30,
    type: VULNERABILITY,
  },
  BooleanGetMethodName: {
    time: 10,
    type: CODE_SMELL,
  },
  BrokenMatchCast: {
    time: 10,
    type: BUG,
  },
  BrokenNullCheck: {
    time: 2,
    type: BUG,
  },
  CallSuperInConstructor: {
    time: 5,
    type: CODE_SMELL,
  },
  CallSupperTwiceInContructor: {
    time: 20,
    type: CODE_SMELL,
  },
  CatchBlockShouldDoMoreThanRethrow: {
    time: 5,
    type: CODE_SMELL,
  },
  ClassNamedException: {
    time: 15,
    type: CODE_SMELL,
  },
  ClassNamingConventions: {
    time: 30,
    type: CODE_SMELL,
  },
  ClassWithoutTestCases: {
    time: 15,
    type: CODE_SMELL,
  },
  ClassWithoutTestClass: {
    time: 30,
    type: CODE_SMELL,
  },
  CognitiveComplexity: {
    time: 20,
    type: CODE_SMELL,
  },
  CollapsibleIfStatements: {
    time: 5,
    type: CODE_SMELL,
  },
  CommentContent: {
    time: 5,
    type: CODE_SMELL,
  },
  CommentedOutCode: {
    time: 5,
    type: CODE_SMELL,
  },
  CommentRequired: {
    time: 5,
    type: CODE_SMELL,
  },
  CommentSize: {
    time: 5,
    type: CODE_SMELL,
  },
  CommentedTodo: {
    time: 10,
    type: CODE_SMELL,
  },
  ConfusingTernary: {
    time: 10,
    type: CODE_SMELL,
  },
  ControllerNaming: {
    time: 30,
    type: CODE_SMELL,
  },
  ConstructorCallsOverridableMethod: {
    time: 10,
    type: BUG,
  },
  CouplingBetweenObjects: {
    time: 120,
    type: CODE_SMELL,
  },
  Csrf: {
    time: 30,
    type: VULNERABILITY,
  },
  CyclomaticComplexity: {
    time: 10,
    type: CODE_SMELL,
    offset: 1,
    timeType: 'linear',
  },
  DebugsShouldUseLoggingLevel: {
    time: 5,
    type: CODE_SMELL,
  },
  DivisionByZeroPossible: {
    time: 15,
    type: BUG,
  },
  DMLWithoutSharingEnabled: {
    time: 15,
    type: VULNERABILITY,
  },
  DirectAccessToTriggerArray: {
    time: 15,
    type: BUG,
  },
  DoNotThrowExceptionInFinally: {
    time: 30,
    type: BUG,
  },
  DUDataflowAnomalyAnalysis: {
    time: 5,
    type: CODE_SMELL,
  },
  DuplicatedBlocks: {
    time: 10,
    type: CODE_SMELL,
    offset: 10,
    timeType: 'linear',
  },
  EagerlyLoadedDescribeSObjectResult: {
    time: 10,
    type: CODE_SMELL,
  },
  EmptyCatchBlock: {
    time: 5,
    type: CODE_SMELL,
  },
  EmptyFinallyBlock: {
    time: 5,
    type: CODE_SMELL,
  },
  EmptyIfStmt: {
    time: 5,
    type: CODE_SMELL,
  },
  EmptyInitializer: {
    time: 5,
    type: CODE_SMELL,
  },
  EmptyMethodInAbstractClassShouldBeAbstract: {
    time: 5,
    type: CODE_SMELL,
  },
  EmptyStatementBlock: {
    time: 5,
    type: CODE_SMELL,
  },
  EmptyStatementNotInLoop: {
    time: 2,
    type: CODE_SMELL,
  },
  EmptyStaticInitializer: {
    time: 5,
    type: CODE_SMELL,
  },
  EmptySwitchLabel: {
    time: 5,
    type: CODE_SMELL,
  },
  EmptySwitchStatements: {
    time: 5,
    type: CODE_SMELL,
  },
  EmptyTryBlock: {
    time: 5,
    type: CODE_SMELL,
  },
  EmptyTryOrFinallyBlock: {
    time: 5,
    type: CODE_SMELL,
  },
  EmptyWhileStmt: {
    time: 5,
    type: CODE_SMELL,
  },
  EqualsNull: {
    time: 15,
    type: BUG,
  },
  ExceptionAsFlowControl: {
    time: 20,
    type: CODE_SMELL,
  },
  ExceptionClassNaming: {
    time: 10,
    type: CODE_SMELL,
  },
  ExcessiveClassLength: {
    time: 60,
    type: CODE_SMELL,
  },
  ExcessiveMethodLength: {
    time: 20,
    type: CODE_SMELL,
  },
  ExcessiveParameterList: {
    time: 20,
    type: CODE_SMELL,
  },
  ExcessivePublicCount: {
    time: 60,
    type: CODE_SMELL,
  },
  exception: {
    time: 0,
    type: CODE_SMELL,
  },
  FailedUnitTests: {
    time: 10,
    type: BUG,
    timeType: 'linear',
  },
  FieldDeclarationsShouldBeAtStart: {
    time: 5,
    type: CODE_SMELL,
  },
  FieldDeclarationsShouldBeAtStartOfClass: {
    time: 5,
    type: CODE_SMELL,
  },
  FieldLevelSecurity: {
    time: 30,
    type: VULNERABILITY,
  },
  FieldNamingConventions: {
    time: 15,
    type: CODE_SMELL,
  },
  FinalFieldCouldBeStatic: {
    time: 10,
    type: CODE_SMELL,
  },
  ForLoopShouldBeWhileLoop: {
    time: 5,
    type: CODE_SMELL,
  },
  ForLoopsMustUseBraces: {
    time: 2,
    type: CODE_SMELL,
  },
  FormalParameterNamingConventions: {
    time: 10,
    type: CODE_SMELL,
  },
  FutureMethodInLoop: {
    time: 15,
    type: CODE_SMELL,
  },
  GodClass: {
    time: 120,
    type: CODE_SMELL,
  },
  HotspotCookies: {
    time: 5,
    type: SECURITY_HOTSPOT,
  },
  HotspotDeserialization: {
    time: 5,
    type: SECURITY_HOTSPOT,
  },
  HotspotEncrypt: {
    time: 5,
    type: SECURITY_HOTSPOT,
  },
  HotspotTypeReflection: {
    time: 5,
    type: SECURITY_HOTSPOT,
  },
  HotspotUserInfoGetSessionIdUsage: {
    time: 5,
    type: SECURITY_HOTSPOT,
  },
  IdempotentOperations: {
    time: 10,
    type: BUG,
  },
  IfElseStmtsMustUseBraces: {
    time: 2,
    type: CODE_SMELL,
  },
  IfStmtsMustUseBraces: {
    time: 2,
    type: CODE_SMELL,
  },
  InmutableField: {
    time: 5,
    type: CODE_SMELL,
  },
  InaccessibleAuraEnabledGetter: {
    time: 10,
    type: BUG,
  },
  InsufficientEmptyStringCheck: {
    time: 15,
    type: CODE_SMELL,
  },
  InsecureEndpoint: {
    time: 30,
    type: VULNERABILITY,
  },
  InsufficientBranchCoverage: {
    time: 5,
    type: CODE_SMELL,
    timeType: 'linear',
  },
  InsufficientCommentDensity: {
    time: 2,
    type: CODE_SMELL,
    timeType: 'linear',
  },
  InsufficientLineCoverage: {
    time: 2,
    type: CODE_SMELL,
    timeType: 'linear',
  },
  JumbledIncrementer: {
    time: 10,
    type: BUG,
  },
  LawOfDemeter: {
    time: 120,
    type: CODE_SMELL,
  },
  LeftBracesLinePositions: {
    time: 2,
    type: CODE_SMELL,
  },
  LeftBracesSpacingPositions: {
    time: 2,
    type: CODE_SMELL,
  },
  LocalVariableCouldBeFinal: {
    time: 10,
    type: CODE_SMELL,
  },
  LocalVariableNamingConventions: {
    time: 10,
    type: CODE_SMELL,
  },
  LogicInversion: {
    time: 2,
    type: CODE_SMELL,
  },
  LogicVariable: {
    time: 2,
    type: CODE_SMELL,
  },
  MethodCouldBeStatic: {
    time: 5,
    type: CODE_SMELL,
  },
  MethodNamingConventions: {
    time: 30,
    type: CODE_SMELL,
  },
  MethodReturnsInternalArray: {
    time: 5,
    type: CODE_SMELL,
  },
  MethodWithSameNameAsEnclosingClass: {
    time: 20,
    type: CODE_SMELL,
  },
  MisleadingVariableName: {
    time: 30,
    type: CODE_SMELL,
  },
  MisplacedNullCheck: {
    time: 10,
    type: BUG,
  },
  MissingStaticMethodInNonInstantiatableClass: {
    time: 5,
    type: BUG,
  },
  MultipleTriggersOnObject: {
    time: 30,
    type: CODE_SMELL,
  },
  NcssConstructorCount: {
    time: 20,
    type: CODE_SMELL,
  },
  NcssMethodCount: {
    time: 20,
    type: CODE_SMELL,
  },
  NcssTypeCount: {
    time: 20,
    type: CODE_SMELL,
  },
  NonStaticInitializer: {
    time: 30,
    type: CODE_SMELL,
  },
  NonUnitTestContainsAsserts: {
    time: 15,
    type: CODE_SMELL,
  },
  NPathComplexity: {
    time: 60,
    type: CODE_SMELL,
  },
  NullAssignment: {
    time: 2,
    type: CODE_SMELL,
  },
  OldApiVersion: {
    time: 15,
    type: CODE_SMELL,
  },
  OneDeclarationPerLine: {
    time: 5,
    type: CODE_SMELL,
  },
  OnlyOneReturn: {
    time: 20,
    type: CODE_SMELL,
  },
  OpenRedirect: {
    time: 15,
    type: VULNERABILITY,
  },
  OperationWithLimitsInLoop: {
    time: 15,
    type: CODE_SMELL,
  },
  OutboundEmailSend: {
    time: 15,
    type: CODE_SMELL,
  },
  OverrideBothEqualsAndHashcode: {
    time: 15,
    type: CODE_SMELL,
  },
  PossibleIncrementerBug: {
    time: 10,
    type: BUG,
  },
  PositionLiteralsFirstInComparisons: {
    time: 10,
    type: BUG,
  },
  PreserveStackTrace: {
    time: 10,
    type: BUG,
  },
  PropertyNamingConventions: {
    time: 20,
    type: CODE_SMELL,
  },
  ReturnEmptyArrayRatherThanNull: {
    time: 30,
    type: BUG,
  },
  ReturnFromFinallyBlock: {
    time: 30,
    type: BUG,
  },
  RightBracesLinePositions: {
    time: 2,
    type: CODE_SMELL,
  },
  RightBracesSpacingPositions: {
    time: 2,
    type: CODE_SMELL,
  },
  SimpleRedirectAction: {
    time: 10,
    type: CODE_SMELL,
  },
  ShortClassName: {
    time: 10,
    type: CODE_SMELL,
  },
  ShortMethodName: {
    time: 20,
    type: CODE_SMELL,
  },
  ShortVariable: {
    time: 2,
    type: CODE_SMELL,
  },
  SimplifyBooleanReturns: {
    time: 2,
    type: CODE_SMELL,
  },
  SimplifyConditional: {
    time: 5,
    type: CODE_SMELL,
  },
  SimplifyTernary: {
    time: 5,
    type: CODE_SMELL,
  },
  SingleMethodSingleton: {
    time: 10,
    type: CODE_SMELL,
  },
  SingularField: {
    time: 10,
    type: CODE_SMELL,
  },
  SkippedUnitTests: {
    time: 10,
    type: CODE_SMELL,
    timeType: 'linear',
  },
  SOQLInjection: {
    time: 60,
    type: VULNERABILITY,
  },
  StatementsShouldBeOnSeparateLines: {
    time: 3,
    type: CODE_SMELL,
  },
  StaticCanNotBeUsedInInnerClass: {
    time: 10,
    type: BUG,
  },
  StdCyclomaticComplexity: {
    time: 10,
    type: CODE_SMELL,
    offset: 1,
    timeType: 'linear',
  },
  StringInstantiation: {
    time: 2,
    type: CODE_SMELL,
  },
  StringToString: {
    time: 2,
    type: CODE_SMELL,
  },
  SuspiciousConstantFieldName: {
    time: 10,
    type: CODE_SMELL,
  },
  SwitchDensity: {
    time: 5,
    type: CODE_SMELL,
  },
  SwitchStmtsShouldHaveDefault: {
    time: 15,
    type: CODE_SMELL,
  },
  SystemDebug: {
    time: 5,
    type: VULNERABILITY,
  },
  TestClassWithoutTestCases: {
    time: 15,
    type: CODE_SMELL,
  },
  TestMethodsMustBeInTestClasses: {
    time: 10,
    type: CODE_SMELL,
  },
  ThrowFromFinallyBlock: {
    time: 30,
    type: BUG,
  },
  TooFewBranchesForASwitchStatement: {
    time: 15,
    type: CODE_SMELL,
  },
  TooManyFields: {
    time: 20,
    type: CODE_SMELL,
  },
  TooManyMethods: {
    time: 60,
    type: CODE_SMELL,
  },
  TrackNoSonar: {
    time: 2,
    type: CODE_SMELL,
  },
  TrackSuppressWarnings: {
    time: 2,
    type: CODE_SMELL,
  },
  UncommentedEmptyConstructor: {
    time: 5,
    type: CODE_SMELL,
  },
  UncommentedEmptyMethod: {
    time: 5,
    type: CODE_SMELL,
  },
  UnconditionalIfStatement: {
    time: 15,
    type: BUG,
  },
  UnescapedOutput: {
    time: 15,
    type: VULNERABILITY,
  },
  UnescapedSource: {
    time: 30,
    type: VULNERABILITY,
  },
  UnitAssertionsShouldIncludeMessage: {
    time: 10,
    type: CODE_SMELL,
  },
  UnitTestContainsTooManyAsserts: {
    time: 20,
    type: CODE_SMELL,
  },
  UnitTestsShouldIncludeAssert: {
    time: 30,
    type: BUG,
  },
  UnitTestsShouldIncludeStartTest: {
    time: 15,
    type: CODE_SMELL,
  },
  UnnecesaryBooleanAssertion: {
    time: 5,
    type: BUG,
  },
  UnnecesaryCaseChange: {
    time: 5,
    type: CODE_SMELL,
  },
  UnnecesaryConstructor: {
    time: 5,
    type: CODE_SMELL,
  },
  UnnecesaryConversionTemporary: {
    time: 5,
    type: CODE_SMELL,
  },
  UnnecesaryFinalModifier: {
    time: 2,
    type: CODE_SMELL,
  },
  UnnecesaryLocalBeforeReturn: {
    time: 2,
    type: CODE_SMELL,
  },
  UnnecesaryParentheses: {
    time: 1,
    type: CODE_SMELL,
  },
  UnnecesaryReturn: {
    time: 2,
    type: CODE_SMELL,
  },
  UnnecesaryWrapperObjectCreation: {
    time: 5,
    type: CODE_SMELL,
  },
  UnreachableCode: {
    time: 15,
    type: CODE_SMELL,
  },
  UnusedFormalParameter: {
    time: 5,
    type: CODE_SMELL,
  },
  UnusedLocalVariable: {
    time: 5,
    type: CODE_SMELL,
  },
  UnusedMethod: {
    time: 5,
    type: CODE_SMELL,
  },
  UnusedModifier: {
    time: 5,
    type: CODE_SMELL,
  },
  UnusedNullCheckInEquals: {
    time: 2,
    type: BUG,
  },
  UnusedPrivateField: {
    time: 5,
    type: CODE_SMELL,
  },
  UnusedPrivateMethod: {
    time: 5,
    type: CODE_SMELL,
  },
  URLDataflowAnomalyAnalysis: {
    time: 5,
    type: BUG,
  },
  UseCollectionIsEmpty: {
    time: 5,
    type: CODE_SMELL,
  },
  UseLocaleWithCaseConversions: {
    time: 5,
    type: BUG,
  },
  UseObjectForClearerAPI: {
    time: 120,
    type: CODE_SMELL,
  },
  UseSingleton: {
    time: 5,
    type: CODE_SMELL,
  },
  UseAssertInsteadOfAssertEquals: {
    time: 5,
    type: CODE_SMELL,
  },
  UseAssertEqualsInsteadOfAssert: {
    time: 5,
    type: CODE_SMELL,
  },
  UseAssertEqualsInsteadOfAssertEquality: {
    time: 5,
    type: CODE_SMELL,
  },
  UseAnnotationOnTestClass: {
    time: 15,
    type: CODE_SMELL,
  },
  UselessOperationOnImmutable: {
    time: 2,
    type: BUG,
  },
  UselessParentheses: {
    time: 2,
    type: CODE_SMELL,
  },
  UselessStringValueOf: {
    time: 5,
    type: CODE_SMELL,
  },
  VariableCouldBeTransient: {
    time: 10,
    type: CODE_SMELL,
  },
  VariableDeclarationHidesAnother: {
    time: 15,
    type: CODE_SMELL,
  },
  VariableNamingConventions: {
    time: 10,
    type: CODE_SMELL,
  },
  WhileLoopsMustUseBraces: {
    time: 2,
    type: CODE_SMELL,
  },
  XpathRule: {
    time: 0,
    type: CODE_SMELL,
  },
};
