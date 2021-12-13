warning: LF will be replaced by CRLF in README.md.
The file will have its original line endings in your working directory
warning: LF will be replaced by CRLF in package.json.
The file will have its original line endings in your working directory
[1mdiff --git a/README.md b/README.md[m
[1mindex ab5522f..79c1d1e 100644[m
[1m--- a/README.md[m
[1m+++ b/README.md[m
[36m@@ -1,5 +1,4 @@[m
 # **Aura Helper SFDX**[m
[31m-================[m
 [m
 Aura Helper CLI Tools converted into SFDX Plugin[m
 [m
[36m@@ -11,7 +10,7 @@[m [mAura Helper CLI Tools converted into SFDX Plugin[m
 [![Downloads/week](https://img.shields.io/npm/dw/sfdx-aura-helper.svg)](https://npmjs.org/package/sfdx-aura-helper)[m
 [![License](https://img.shields.io/npm/l/sfdx-aura-helper.svg)](https://github.com/JJLongoria/sfdx-aura-helper/blob/master/package.json)[m
 [m
[31m-SFDX PLugin to work with Salesforce Projects. This application are entire developed using Aura Helper Framework and has powerfull commands to manage your projects, create Continous Integration and DevOps workflows and support developers to make some utils task on every project like import and export data, create package files (including from git differences), compare metadata from two orgs or from your local project and the auth org, and to much more. It is the Aura Helper CLI natural evolution to integrate better to other salesforce tools.[m
[32m+[m[32mSFDX Plugin to work with Salesforce Projects. This application are entire developed using Aura Helper Framework and has powerfull commands to manage your projects, create Continous Integration and DevOps workflows and support developers to make some utils task on every project like import and export data, create package files (including from git differences), compare metadata from two orgs or from your local project and the auth org, and to much more. It is the Aura Helper CLI natural evolution to integrate better to other salesforce tools.[m
 [m
 ## [**Features**](#features)[m
 [m
[36m@@ -77,7 +76,7 @@[m [mAll commands from Aura Helper CLI have the next structure:[m
 [m
 Al commands start by **ah**. For example[m
 [m
[31m-    sfdx ah:.....:..... [command:input] [options][m
[32m+[m[32m    sfdx ah:topic:command [command:input] [options][m
 [m
 ---[m
 [m
[36m@@ -129,6 +128,10 @@[m [mMetadata commands are the commands for work with your metadata files. You can co[m
 [m
     Command for ignore some metadata types. If you use git or other SVC systems, you can construct a .gitignore file or similar for ignore some files from your SVC. But salesforce have some metadata that can't be ignored with git because have into other files, like custom labels, workflows or user permissios for example. This command allow to you to ignore this types of metadata. This command support all metadata types to ignore. (Can delete entire files and folders)[m
 [m
[32m+[m[32m- [**metadata:local:list**](#metadatalocallist)[m
[32m+[m
[32m+[m[32m    Command to describe all or specific Metadata Types like Custom Objects, Custom Fields, Apex Classes... that you have in your local project.[m
[32m+[m
 - [**metadata:local:describe**](#metadatalocaldescribe)[m
 [m
     Command to describe all or specific Metadata Types like Custom Objects, Custom Fields, Apex Classes... that you have in your local project.[m
[36m@@ -240,6 +243,67 @@[m [mIgnore only Custom Application, Custom Labels and Profiles specified in .ahignor[m
     sfdx ah:metadata:local:ignore -t "CustomApplication, Profile, CustomLabels" -i "Path/to/the/file/.myignoreFile.json" -p[m
 [m
 ---[m
[32m+[m[32m### [**metadata:local:list**](#metadatalocallist)[m[41m [m
[32m+[m[32mCommand for list all Metadata Types stored in your local project.[m[41m [m
[32m+[m
[32m+[m[32m### **Usage**:[m
[32m+[m
[32m+[m[32m    sfdx ah:metadata:local:list [-r <filepath>] [--outputfile <filepath>] [--csv] [-p] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL][m
[32m+[m
[32m+[m[32m### **Options**:[m
[32m+[m[32m```[m
[32m+[m[32m    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.[m
[32m+[m[32m    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command[m
[32m+[m[32m    [--output-file <path/to/output/file>]                               Path to file for redirect the output.[m
[32m+[m[32m    [-p | --progress]                                                   Option to report the command progress (into the selected format) or show a[m[41m [m
[32m+[m[32m                                                                        spinner loader[m
[32m+[m[32m    [--csv]                                                             Option to show the result as CSV instead a table if not select --json flag.[m
[32m+[m[32m    [--json]                                                            Format output as JSON.[m
[32m+[m[32m    [--loglevel <LOGLEVEL>]                                             The logging level for this command invocation. Logs are stored in $HOME/.sfdx/sfdx.log.[m[41m     [m
[32m+[m[32m                                                                        Permissible values are: trace, debug, info, warn, error, fatal, TRACE, DEBUG, INFO, WARN, ERROR, FATAL. Default value: warn[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### **JSON Response**:[m
[32m+[m[32m```json[m
[32m+[m[32m    {[m
[32m+[m[32m      "status": 0,[m
[32m+[m[32m      "result": {[m
[32m+[m[32m        [[m
[32m+[m[32m            {[m
[32m+[m[32m                "xmlName": "APIName",[m
[32m+[m[32m                "directoryName": "directoryName",[m
[32m+[m[32m                "suffix": "fileSuffix",[m
[32m+[m[32m                "inFolder": false,[m
[32m+[m[32m                "metaFile": false,[m
[32m+[m[32m            },[m
[32m+[m[32m            {[m
[32m+[m[32m                "xmlName": "APIName",[m
[32m+[m[32m                "directoryName": "directoryName",[m
[32m+[m[32m                "suffix": "fileSuffix",[m
[32m+[m[32m                "inFolder": false,[m
[32m+[m[32m                "metaFile": false,[m
[32m+[m[32m            },[m
[32m+[m[32m            {[m
[32m+[m[32m                // More data...[m
[32m+[m[32m            },[m
[32m+[m[32m        ][m
[32m+[m[32m      }[m
[32m+[m[32m    }[m
[32m+[m[32m```[m
[32m+[m[32m### **Examples**:[m
[32m+[m
[32m+[m[32mList all types with progress an table result (default)[m
[32m+[m
[32m+[m[32m    sfdx ah:metadata:local:list -p[m
[32m+[m
[32m+[m[32mList all types with csv result[m
[32m+[m
[32m+[m[32m    sfdx ah:metadata:local:list --csv[m
[32m+[m
[32m+[m[32mList all types from different project and save the output into a file and json result[m
[32m+[m
[32m+[m[32m    sfdx ah:metadata:local:list -r "path/to/other/project/root" --outputfile "path/to/the/output/file.txt" --json[m
[32m+[m[32m---[m
 [m
 ### [**metadata:local:describe**](#metadatalocaldescribe)[m
 Command to describe all or specific Metadata Types like Custom Objects, Custom Fields, Apex Classes... that you have in your local project.[m
[1mdiff --git a/messages/general.json b/messages/general.json[m
[1mindex 5fc66da..0c0c9ae 100644[m
[1m--- a/messages/general.json[m
[1m+++ b/messages/general.json[m
[36m@@ -5,7 +5,7 @@[m
     "progressFlagDescription": "Option to report the command progress (into the selected format) or show a spinner loader",[m
     "wrongRootPathError": "Wrong --root path (%s). Error: %s",[m
     "projectNotFoundError": "This command is required to run from within an SFDX project",[m
[31m-    "worngParamPath": "'Wrong %s path. Select a valid path. Error: %s",[m
[32m+[m[32m    "wrongParamPath": "'Wrong %s path. Select a valid path. Error: %s",[m
     "gettingAvailableMetadataTypesMessage": "Getting All Available Metadata Types",[m
     "outputSavedMessage": "'Output saved in: %s"[m
 }[m
\ No newline at end of file[m
[1mdiff --git a/messages/localList.json b/messages/localList.json[m
[1mindex 0534e53..27f3438 100644[m
[1m--- a/messages/localList.json[m
[1m+++ b/messages/localList.json[m
[36m@@ -3,8 +3,8 @@[m
     "csvFlagDescription": "Option to show the result as CSV instead a table if not select --json flag",[m
     "noDataToShowError": "Not metadata types found to list",[m
     "examples": [[m
[31m-        "sfdx ah:metadata:local:describe -a -p plaintext -s \"path/to/the/output/file.txt\" --csv",[m
[31m-        "sfdx ah:metadata:local:describe -t \"CustomObject, CustomField, Profile, ValidatiionRule\" -p",[m
[31m-        "sfdx ah:metadata:local:describe -t \"CustomObject, CustomField\" --json"[m
[32m+[m[32m        "sfdx ah:metadata:local:list -p",[m
[32m+[m[32m        "sfdx ah:metadata:local:list --csv",[m
[32m+[m[32m        "sfdx ah:metadata:local:list -r \"path/to/other/project/root\" --outputfile \"path/to/the/output/file.txt\" --json"[m
     ][m
 }[m
\ No newline at end of file[m
[1mdiff --git a/package.json b/package.json[m
[1mindex b6668bb..4740a4e 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -6,14 +6,14 @@[m
   "author": "Juan José Longoria López",[m
   "bugs": "https://github.com/JJLongoria/aura-helper-sfdx/issues",[m
   "dependencies": {[m
[31m-    "@aurahelper/connector": "file:../../nodeJS/Aura Helper Framework/ah-connector",[m
[31m-    "@aurahelper/core": "file:../../nodeJS/Aura Helper Framework/ah-core",[m
[31m-    "@aurahelper/dependencies-manager": "file:../../nodeJS/Aura Helper Framework/ah-dependencies-manager",[m
[31m-    "@aurahelper/git-manager": "file:../../nodeJS/Aura Helper Framework/ah-git-manager",[m
[31m-    "@aurahelper/ignore": "file:../../nodeJS/Aura Helper Framework/ah-ignore",[m
[31m-    "@aurahelper/metadata-factory": "file:../../nodeJS/Aura Helper Framework/ah-metadata-factory",[m
[31m-    "@aurahelper/package-generator": "file:../../nodeJS/Aura Helper Framework/ah-package-generator",[m
[31m-    "@aurahelper/xml-compressor": "file:../../nodeJS/Aura Helper Framework/ah-xml-compressor",[m
[32m+[m[32m    "@aurahelper/connector": "^2.0.0",[m
[32m+[m[32m    "@aurahelper/core": "^2.0.0",[m
[32m+[m[32m    "@aurahelper/dependencies-manager": "^2.0.0",[m
[32m+[m[32m    "@aurahelper/git-manager": "^2.0.2",[m
[32m+[m[32m    "@aurahelper/ignore": "^2.0.0",[m
[32m+[m[32m    "@aurahelper/metadata-factory": "^2.0.0",[m
[32m+[m[32m    "@aurahelper/package-generator": "^2.0.0",[m
[32m+[m[32m    "@aurahelper/xml-compressor": "^2.0.0",[m
     "@oclif/command": "^1",[m
     "@oclif/config": "^1",[m
     "@oclif/errors": "^1",[m
[1mdiff --git a/src/commands/ah/metadata/local/compress.ts b/src/commands/ah/metadata/local/compress.ts[m
[1mindex 10ec855..9c6a3b5 100644[m
[1m--- a/src/commands/ah/metadata/local/compress.ts[m
[1m+++ b/src/commands/ah/metadata/local/compress.ts[m
[36m@@ -84,14 +84,14 @@[m [mexport default class Compress extends SfdxCommand {[m
         compressor.addPaths(paths);[m
       } catch (error) {[m
         const err = error as Error;[m
[31m-        throw new SfdxError(generalMessages.getMessage('worngParamPath', [param, err.message]));[m
[32m+[m[32m        throw new SfdxError(generalMessages.getMessage('wrongParamPath', [param, err.message]));[m
       }[m
     } else {[m
       try {[m
         this.flags.file = CommandUtils.getPaths(this.flags.file, this.flags.root);[m
       } catch (error) {[m
         const err = error as Error;[m
[31m-        throw new SfdxError(generalMessages.getMessage('worngParamPath', ['--file', err.message]));[m
[32m+[m[32m        throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--file', err.message]));[m
       }[m
       compressor.addPaths(this.flags.file);[m
     }[m
[1mdiff --git a/src/commands/ah/metadata/local/describe.ts b/src/commands/ah/metadata/local/describe.ts[m
[1mindex 3089a04..5f443ad 100644[m
[1m--- a/src/commands/ah/metadata/local/describe.ts[m
[1m+++ b/src/commands/ah/metadata/local/describe.ts[m
[36m@@ -70,7 +70,7 @@[m [mexport default class Describe extends SfdxCommand {[m
         this.flags.outputfile = PathUtils.getAbsolutePath(this.flags.outputfile);[m
       } catch (error) {[m
         const err = error as Error;[m
[31m-        throw new SfdxError(generalMessages.getMessage('worngParamPath', ['--output-file', err.message]));[m
[32m+[m[32m        throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--outputfile', err.message]));[m
       }[m
     }[m
     const alias = ProjectUtils.getOrgAlias(this.flags.root);[m
[1mdiff --git a/src/commands/ah/metadata/local/ignore.ts b/src/commands/ah/metadata/local/ignore.ts[m
[1mindex bfbe337..c40cb71 100644[m
[1m--- a/src/commands/ah/metadata/local/ignore.ts[m
[1m+++ b/src/commands/ah/metadata/local/ignore.ts[m
[36m@@ -79,15 +79,15 @@[m [mexport default class Ignore extends SfdxCommand {[m
     if (this.flags.all === undefined && this.flags.type === undefined) {[m
       throw new SfdxError(messages.getMessage('missingTypesToCompressError'));[m
     }[m
[31m-    if (!this.flags.ignoreFile) {[m
[31m-      this.flags.ignoreFile = (this.flags.root as string) + '/' + IGNORE_FILE_NAME;[m
[32m+[m[32m    if (!this.flags.ignorefile) {[m
[32m+[m[32m      this.flags.ignorefile = (this.flags.root as string) + '/' + IGNORE_FILE_NAME;[m
     }[m
     try {[m
[31m-      Validator.validateJSONFile(this.flags.ignoreFile);[m
[31m-      this.flags.ignoreFile = PathUtils.getAbsolutePath(this.flags.ignoreFile);[m
[32m+[m[32m      Validator.validateJSONFile(this.flags.ignorefile);[m
[32m+[m[32m      this.flags.ignorefile = PathUtils.getAbsolutePath(this.flags.ignorefile);[m
     } catch (error) {[m
       const err = error as Error;[m
[31m-      throw new SfdxError(messages.getMessage('worngIgnoreFilePathError', [err.message]));[m
[32m+[m[32m      throw new SfdxError(messages.getMessage('wrongParamPath', ['--ignorefile', err.message]));[m
     }[m
     let types;[m
     if (this.flags.type) {[m
[36m@@ -103,8 +103,8 @@[m [mexport default class Ignore extends SfdxCommand {[m
     }[m
     try {[m
       const metadataDetails = await connector.listMetadataTypes();[m
[31m-      const ignore = new MetadataIgnore(this.flags.ignoreFile);[m
[31m-      ignore.setCompress(this.flags.compress).setSortOrder(this.flags.sortOrder).setTypesToIgnore(types);[m
[32m+[m[32m      const ignore = new MetadataIgnore(this.flags.ignorefile);[m
[32m+[m[32m      ignore.setCompress(this.flags.compress).setSortOrder(this.flags.sortorder).setTypesToIgnore(types);[m
       ignore.onStartProcessType((metadataTypeName) => {[m
         if (this.flags.progress) {[m
           this.ux.log(messages.getMessage('processingMetadataType', [metadataTypeName]));[m
[1mdiff --git a/src/commands/ah/metadata/local/list.ts b/src/commands/ah/metadata/local/list.ts[m
[1mindex 6e3c8e8..3371d0c 100644[m
[1m--- a/src/commands/ah/metadata/local/list.ts[m
[1m+++ b/src/commands/ah/metadata/local/list.ts[m
[36m@@ -2,7 +2,7 @@[m [mimport * as os from 'os';[m
 import { FlagsConfig, SfdxCommand, flags } from '@salesforce/command';[m
 import { Messages, SfdxError } from '@salesforce/core';[m
 import { SFConnector } from '@aurahelper/connector';[m
[31m-import { CoreUtils, FileChecker, MetadataDetail, PathUtils } from '@aurahelper/core';[m
[32m+[m[32mimport { CoreUtils, FileChecker, FileWriter, MetadataDetail, PathUtils } from '@aurahelper/core';[m
 import { MetadataFactory } from '@aurahelper/metadata-factory';[m
 import CommandUtils from '../../../../libs/utils/commandUtils';[m
 const Validator = CoreUtils.Validator;[m
[36m@@ -54,7 +54,7 @@[m [mexport default class Describe extends SfdxCommand {[m
         this.flags.outputfile = PathUtils.getAbsolutePath(this.flags.outputfile);[m
       } catch (error) {[m
         const err = error as Error;[m
[31m-        throw new SfdxError(generalMessages.getMessage('worngParamPath', ['--output-file', err.message]));[m
[32m+[m[32m        throw new SfdxError(generalMessages.getMessage('wrongParamPath', ['--output-file', err.message]));[m
       }[m
     }[m
     const alias = ProjectUtils.getOrgAlias(this.flags.root);[m
[36m@@ -106,6 +106,14 @@[m [mexport default class Describe extends SfdxCommand {[m
         this.ux.log(messages.getMessage('noDataToShowError'));[m
       }[m
     }[m
[32m+[m[32m    if (this.flags.outputfile) {[m
[32m+[m[32m      const baseDir = PathUtils.getDirname(this.flags.outputfile);[m
[32m+[m[32m      if (!FileChecker.isExists(baseDir)) {[m
[32m+[m[32m        FileWriter.createFolderSync(baseDir);[m
[32m+[m[32m      }[m
[32m+[m[32m      FileWriter.createFileSync(this.flags.outputile, JSON.stringify(metadata, null, 2));[m
[32m+[m[32m      this.ux.log(messages.getMessage('outputSavedMessage', [this.flags.outputfile]));[m
[32m+[m[32m    }[m
     return metadata;[m
   }[m
 }[m
[1mdiff --git a/yarn.lock b/yarn.lock[m
[1mindex 18774cc..fd55939 100644[m
[1m--- a/yarn.lock[m
[1m+++ b/yarn.lock[m
[36m@@ -2,76 +2,96 @@[m
 # yarn lockfile v1[m
 [m
 [m
[31m-"@aurahelper/connector@file:../../nodeJS/Aura Helper Framework/ah-connector":[m
[32m+[m[32m"@aurahelper/connector@^2.0.0":[m
   version "2.0.0"[m
[31m-  dependencies:[m
[31m-    "@aurahelper/core" "file:C:/Users/El Puto Kanko/AppData/Local/Yarn/Cache/v6/npm-@aurahelper-connector-2.0.0-39597815-f3c0-4386-b3a8-2bb67dcd5af7-1639341030880/node_modules/@aurahelper/ah-core"[m
[31m-    "@aurahelper/languages" "file:C:/Users/El Puto Kanko/AppData/Local/Yarn/Cache/v6/npm-@aurahelper-connector-2.0.0-39597815-f3c0-4386-b3a8-2bb67dcd5af7-1639341030880/node_modules/@aurahelper/ah-languages"[m
[31m-    "@aurahelper/metadata-factory" "file:C:/Users/El Puto Kanko/AppData/Local/Yarn/Cache/v6/npm-@aurahelper-connector-2.0.0-39597815-f3c0-4386-b3a8-2bb67dcd5af7-1639341030880/node_modules/@aurahelper/ah-metadata-factory"[m
[31m-    "@aurahelper/package-generator" "file:C:/Users/El Puto Kanko/AppData/Local/Yarn/Cache/v6/npm-@aurahelper-connector-2.0.0-39597815-f3c0-4386-b3a8-2bb67dcd5af7-1639341030880/node_modules/@aurahelper/ah-package-generator"[m
[31m-    "@aurahelper/xml-compressor" "file:C:/Users/El Puto Kanko/AppData/Local/Yarn/Cache/v6/npm-@aurahelper-connector-2.0.0-39597815-f3c0-4386-b3a8-2bb67dcd5af7-1639341030880/node_modules/@aurahelper/ah-xml-compressor"[m
[32m+[m[32m  resolved "https://registry.yarnpkg.com/@aurahelper/connector/-/connector-2.0.0.tgz#9ca00af14c6de4d52a098f76999c38181d39c410"[m
[32m+[m[32m  integrity sha512-LoHNDO8mAXD1hP3SngVmNVmrKpkqOsU3y3HE1GAouB6AshRllYdbj5F6wGo/qDTWLCeL5PXuGVKV27YZycKOjg==[m
[32m+[m[32m  dependencies:[m
[32m+[m[32m    "@aurahelper/core" "^2.0.0"[m
[32m+[m[32m    "@aurahelper/languages" "^2.0.0"[m
[32m+[m[32m    "@aurahelper/metadata-factory" "^2.0.0"[m
[32m+[m[32m    "@aurahelper/package-generator" "^2.0.0"[m
[32m+[m[32m    "@aurahelper/xml-compressor" "^2.0.0"[m
     "@salesforce/core" "^2.31.1"[m
 [m
[31m-"@aurahelper/core@file:../../nodeJS/Aura Helper Framework/ah-core":[m
[32m+[m[32m"@aurahelper/core@^2.0.0":[m
   version "2.0.0"[m
[32m+[m[32m  resolved "https://registry.yarnpkg.com/@aurahelper/core/-/core-2.0.0.tgz#96ea06804af96eb4b0e5ef8953db9c19f8adfdc3"[m
[32m+[m[32m  integrity sha512-0EdW7WG7/dCVLqtzV9pNAE2VNVSbmmqlHLlC/c+J6VcxBJhd8ovaaFzY/KD2qYeIzX1IkH3LqOpe4DDg7xuttw==[m
   dependencies:[m
     fs-extra "^9.1.0"[m
     unzipper "^0.10.11"[m
 [m
[31m-"@aurahelper/dependencies-manager@file:../../nodeJS/Aura Helper Framework/ah-dependencies-manager":[m
[32m+[m[32m"@aurahelper/dependencies-manager@^2.0.0":[m
   version "2.0.0"[m
[32m+[m[32m  resolved "https://registry.yarnpkg.com/@aurahelper/dependencies-manager/-/dependencies-manager-2.0.0.tgz#b73c5dc1a305f7f424fd1adb032e2b2c01da7de5"[m
[32m+[m[32m  integrity sha512-v66vXaQJ1I2eDVylk5Ekkact5gYQeVoN0r8x0r38D54qwOaQbIl0DFu1a628n1JVYejtJ60EB+Mbq0BoeHKIqg==[m
   dependencies:[m
[31m-    "@aurahelper/core" "file:C:/Users/El Puto Kanko/AppData/Local/Yarn/Cache/v6/npm-@aurahelper-dependencies-manager-2.0.0-1ee03321-1fd4-440b-9dd0-a4187350781e-1639341030588/node_modules/@aurahelper/ah-core"[m
[31m-    "@aurahelper/languages" "file:C:/Users/El Puto Kanko/AppData/Local/Yarn/Cache/v6/npm-@aurahelper-dependencies-manager-2.0.0-1ee03321-1fd4-440b-9dd0-a4187350781e-1639341030588/node_modules/@aurahelper/ah-languages"[m
[31m-    "@aurahelper/metadata-factory" "file:C:/Users/El Puto Kanko/AppData/Local/Yarn/Cache/v6/npm-@aurahelper-dependencies-manager-2.0.0-1ee03321-1fd4-440b-9dd0-a4187350781e-1639341030588/node_modules/@aurahelper/ah-metadata-factory"[m
[31m-    "@aurahelper/xml-compressor" "file:C:/Users/El Puto Kanko/AppData/Local/Yarn/Cache/v6/npm-@aurahelper-dependencies-manager-2.0.0-1ee03321-1fd4-440b-9dd0-a4187350781e-1639341030588/node_modules/@aurahelper/ah-xml-compressor"[m
[31m-    "@aurahelper/xml-definitions" "file:C:/Users/El Puto Kanko/AppData/Local/Yarn/Cache/v6/npm-@aurahelper-dependencies-manager-2.0.0-1ee03321-1fd4-440b-9dd0-a4187350781e-1639341030588/node_modules/@aurahelper/ah-xml-definitions"[m
[32m+[m[32m    "@aurahelper/core" "^2.0.0"[m
[32m+[m[32m    "@aurahelper/languages" "^2.0.0"[m
[32m+[m[32m    "@aurahelper/metadata-factory" "^2.0.0"[m
[32m+[m[32m    "@aurahelper/xml-compressor" "^2.0.0"[m
[32m+[m[32m    "@aurahelper/xml-definitions" "^2.0.0"[m
 [m
[31m-"@aurahelper/git-manager@file:../../nodeJS/Aura Helper Framework/ah-git-manager":[m
[31m-  version "2.0.0"[m
[32m+[m[32m"@aurahelper/git-manager@^2.0.2":[m
[32m+[m[32m  version "2.0.2"[m
[32m+[m[32m  resolved "https://registry.yarnpkg.com/@aurahelper/git-manager/-/git-manager-2.0.2.tgz#55bfcda9f1c6eb254547a13edc506825762f2611"[m
[32m+[m[32m  integrity sha512-DAAbw8lxs4xiO2jR4nj11/1yc1Cw9Ey/8Hpv5QC+46kqnYaWWh5m1c92ODs/rCxjLgSca4ExoTWjUUkNzMEmmg==[m
   dependencies:[m
[31m-    "@aurahelper/core" "file:C:/Users/El Puto Kanko/AppData/Local/Yarn/Cache/v6/npm-@aurahelper-git-manager-2.0.0-fdf45c7b-23e7-4d36-a3ba-e47fe10e291d-1639341030596/node_modules/@aurahelper/ah-core"[m
[32m+[m[32m    "@aurahelper/core" "^2.0.0"[m
 [m
[31m-"@aurahelper/ignore@file:../../nodeJS/Aura Helper Framework/ah-ignore":[m
[32m+[m[32m"@aurahelper/ignore@^2.0.0":[m
   version "2.0.0"[m
[32m+[m[32m  resolved "https://registry.yarnpkg.com/@aurahelper/ignore/-/ignore-2.0.0.tgz#6d7c59ac0a968410cf5419fe1a8127126ab68bc5"[m
[32m+[m[32m  integrity sha512-KyFza6Iyr9sXjb5rTV4VrrJ9A2k7j3nQQKAF8YlSOGPDzrFPQ2hb9IfCEWLcVQOGPmYpr4xKHmqAa6Dw1DamJw==[m
   dependencies:[m
[31m-    "@aurahelper/core" "file:C:/Users/El Puto Kanko/AppData/Local/Yarn/Cache/v6/npm-@aurahelper-ignore-2.0.0-a38afc74-b158-4348-a887-c211c40da947-1639341028871/node_modules/@aurahelper/ah-core"[m
[31m-    "@aurahelper/languages" "file:C:/Users/El Puto Kanko/AppData/Local/Yarn/Cache/v6/npm-@aurahelper-ignore-2.0.0-a38afc74-b158-4348-a887-c211c40da947-1639341028871/node_modules/@aurahelper/ah-languages"[m
[31m-    "@aurahelper/metadata-factory" "file:C:/Users/El Puto Kanko/AppData/Local/Yarn/Cache/v6/npm-@aurahelper-ignore-2.0.0-a38afc74-b158-4348-a887-c211c40da947-1639341028871/node_modules/@aurahelper/ah-metadata-factory"[m
[31m-    "@aurahelper/xml-compressor" "file:C:/Users/El Puto Kanko/AppData/Local/Yarn/Cache/v6/npm-@aurahelper-ignore-2.0.0-a38afc74-b158-4348-a887-c211c40da947-1639341028871/node_modules/@aurahelper/ah-xml-compressor"[m
[32m+[m[32m    "@aurahelper/core" "^2.0.0"[m
[32m+[m[32m    "@aurahelper/languages" "^2.0.0"[m
[32m+[m[32m    "@aurahelper/metadata-factory" "^2.0.0"[m
[32m+[m[32m    "@aurahelper/xml-compressor" "^2.0.0"[m
 [m
[31m-"@aurahelper/languages@file:../../nodeJS/Aura Helper Framework/ah-languages":[m
[32m+[m[32m"@aurahelper/languages@^2.0.0":[m
   version "2.0.0"[m
[32m+[m[32m  resolved "https://registry.yarnpkg.com/@aurahelper/languages/-/languages-2.0.0.tgz#04a2b6b3f8e9465b5038a55780c1689deb541d23"[m
[32m+[m[32m  integrity sha512-5fIXZoFkSG0YuQcN/fCrM9uKSN4JYFroVWp4G/6/+1nVV1tNKmOzAPobNFatME3nxcWMhDKmVIGRYvieqKWzPA==[m
   dependencies:[m
[31m-    "@aurahelper/core" "file:C:/Users/El Puto Kanko/AppData/Local/Yarn/Cache/v6/npm-@aurahelper-languages-2.0.0-dd718d2b-afbf-4cac-8a03-fd1f6804a91a-1639341028828/node_modules/@aurahe