# **Aura Helper SFDX**

Aura Helper CLI Tools converted into SFDX Plugin

[![Version](https://img.shields.io/npm/v/sfdx-aura-helper.svg)](https://npmjs.org/package/sfdx-aura-helper)
[![CircleCI](https://circleci.com/gh/JJLongoria/sfdx-aura-helper/tree/master.svg?style=shield)](https://circleci.com/gh/JJLongoria/sfdx-aura-helper/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/JJLongoria/sfdx-aura-helper?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/sfdx-aura-helper/branch/master)
[![Greenkeeper](https://badges.greenkeeper.io/JJLongoria/sfdx-aura-helper.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/JJLongoria/sfdx-aura-helper/badge.svg)](https://snyk.io/test/github/JJLongoria/sfdx-aura-helper)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-aura-helper.svg)](https://npmjs.org/package/sfdx-aura-helper)
[![License](https://img.shields.io/npm/l/sfdx-aura-helper.svg)](https://github.com/JJLongoria/sfdx-aura-helper/blob/master/package.json)

SFDX Plugin to work with Salesforce Projects. This application are entire developed using Aura Helper Framework and has powerfull commands to manage your projects, create Continous Integration and DevOps workflows and support developers to make some utils task on every project like import and export data, create package files (including from git differences), compare metadata from two orgs or from your local project and the auth org, and to much more. It is the Aura Helper CLI natural evolution to integrate better to other salesforce tools.

## [**Features**](#features)

- Simplify your work with **Salesforce and Git** with the command for *create packages* (for deploy and delete) from git changes. **Compare** two *branches*, *commits* or *tags* for create the files for deploy your package.
- **Repair** file *dependencies errors* on your project files or **Check only** to resolve errors manually.
- **Compress your XML Files** structure for make easy *identify changes* and resolve *git conflicts*. Also need less storage and work faster.
- **Retrieve special Metadata Types** like *profiles* or *permissions* sets (and others) with all data without retrieve any file more with a simple command.
- **Compare** your *local data* with your *authorized organization* for get the differences for delete, retrieve or anything you want. Or **Compare** the Metadata Types *between two orgs* to see the differences.
- **Merge** diferent **package** or **destructive** files into one file with only one command. 
- **Ignore** any metadata type from your local project or from the package files for maintance different configuration into your sandbox and production enviroments with simple file and command.
- Specially designed for **DevOps workflows**.
- And much more

### **Specially Designed for DevOps Workflows**

---

<br/>

Supported Operative Systems:
- Windows
- Linux
- Mac OS X

--- 

## *Table of Contents*

- [**Installation Guide**](#installation-guide)

- [**Aura Helper SFDX Commands**](#ah-sfdx-commands)

- [**Ignore File**](#ignore-file)

- [**Metadata JSON Format**](#metadata-json-format)

---

# [**Installation Guide**](#installation-guide)

You can install the plugins using [SFDX plugins manager](#installation-sfdx) or cloning the repository and link it with sfdx.

## [**SFDX Plugins manager (Recommended)**](#installation-sfdx)

To install Aura Helper SFDX run the next command:

    sfdx plugins:install aura-helper-sfdx

## [**Clone Repository Installation**](#installation-clone)

To install cloning the source code repository, follow the next steps

1. Clone the repository
2. Go to the root project folder
3. Run the next command   

        sfdx plugins:link

# [**Aura Helper SFDX Commands**](#ah-sfdx-commands)
All commands from Aura Helper CLI have the next structure: 

    sfdx <command:name> [command:input] [options]

Al commands start by **ah**. For example

    sfdx ah:topic:command [command:input] [options]

---

### *Commands Group*

- [**Help**](#help)
<p></p>

- [**Metadata Commands**](#metadata-commands)
  - [**Local Metadata Commands**](#local-metadata-commands)
  - [**Org Metadata Commands**](#org-metadata-commands)
<p></p>

- [**Data Commands**](#data-commands)
<p></p>

- [**Core Commands**](#core-commands)

---

# [**Help**](#help)
If you need help with Aura Helper CLI, you can run:

    sfdx help ah

or

    sfdx help ah:topic

or


    sfdx help ah:command

or

    sfdx help ah:topic:command

# [**Metadata Commands**](#metadata-commands)
Metadata commands are the commands for work with your metadata files. You can compress xml files, list or describe metadata types that you have on your org or in your local project. Can compare local and org metadata or ignore some metadata types according .ahignore.json file (see [**Ignore File**](#ignore-file) section). Also you can repair project metadata dependencies and much more. These commands are bellow two big groups. [**Local**](#local-metadata-commands) and [**Org**](#org-metadata-commands) commands. The Local commands work only with the metadata types that you have in your local project. The Org commands are commands for work with the data in your auth org.

## [**Local Metadata Commands**](#local-metadata-commands)

- [**metadata:local:compress**](#metadatalocalcompress)

    Command for compress XML files for ocuppy less data storage, and make more usefull with SVC systems like Git. With XML Files compressed, the file confilcts on merges are to much easy to resolve.

- [**metadata:local:ignore**](#metadatalocalignore)

    Command for ignore some metadata types. If you use git or other SVC systems, you can construct a .gitignore file or similar for ignore some files from your SVC. But salesforce have some metadata that can't be ignored with git because have into other files, like custom labels, workflows or user permissios for example. This command allow to you to ignore this types of metadata. This command support all metadata types to ignore. (Can delete entire files and folders)

- [**metadata:local:list**](#metadatalocallist)

    Command to describe all or specific Metadata Types like Custom Objects, Custom Fields, Apex Classes... that you have in your local project.

- [**metadata:local:describe**](#metadatalocaldescribe)

    Command to describe all or specific Metadata Types like Custom Objects, Custom Fields, Apex Classes... that you have in your local project.

---
### [**metadata:local:compress**](#metadatalocalcompress)
Command for compress XML files for ocuppy less data storage, and make more usefull with SVC systems like Git. With XML Files compressed, the file confilcts on merges are to much easy to resolve.

### **Usage**:

    sfdx ah:metadata:local:compress [-r <filepath>] [-s simpleFirst|complexFirst|alphabetAsc|alphabetDesc] [-a | -d <array> | -f <array>] [-p] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder. 
                                                                        first. Values: simpleFirst, complexFirst, alphabetAsc, alphabetDesc
    -a | --all                                                          Compress all XML files with support compression in your project.
    -d | --directory <path/to/directory>[,<path/to/directory>...]       Compress XML Files from specific directory or directories separated by commas.  
                                                                        This options does not take effect if you 
                                                                        choose compress all.
    -f | --file <path/to/file> [, <path/to/file>...]                    Compress the specified XML file or files separated by commas. This options does not take effect if you                                                                 choose compress directory or all.
    [-s | --sort-order <sortOrder>]                                     Sort order for the XML elements when compress XML files. By default, the elements are sorted with 
                                                                        simple XML elements
    [-p | --progress]                                                   Option to report the command progress (into the selected format) or show a spinner loader
    [--json]                                                            Format output as JSON.
    [--loglevel <LOGLEVEL>]                                             The logging level for this command invocation. Logs are stored in $HOME/.sfdx/sfdx.log.     
                                                                        Permissible values are: trace, debug, info, warn, error, fatal, TRACE, DEBUG, INFO, WARN, ERROR, FATAL. Default value: warn
```
### **JSON Response**:
```json
    {
      "status": 0,
      "result": {
        "message": "Compress XML files finish successfully",
        "totalFiles": 0,    // Total files processed
        "compressed": 0,    // Total files compressed
        "failed": 0         // Total files failed
      }
    }
```

### **Examples**:

Compress All XML metadata files on your salesforce project:

    sfdx ah:metadata:local:compress -a

Compress All XML Files for objects folder (and subfolders) with json response:

    sfdx ah:metadata:local:compress -d force-app/main/default/objects --json

Compress Account XML File with progress report:

    sfdx ah:metadata:local:compress -f force-app/main/default/objects/Account/Account.object-meta-xml -p

Compress objects folder (and subfolders) and applications folder

    sfdx ah:metadata:local:compress -d force-app/main/default/objects, force-app/main/default/applications

Compress Account and Case object file with json response:

    sfdx ah:metadata:local:compress -f force-app/main/default/objects/Account/Account.object-meta-xml, force-app/main/default/objects/Case/Case.object-meta-xml --json

---

### [**metadata:local:ignore**](#metadatalocalignore)
Command for ignore some metadata types. If you use git or other SVC systems, you can construct a .gitignore file or similar for ignore some files from your SVC. But salesforce have some metadata that can't be ignored with git because have into other files, like custom labels, workflows or user permissios for example. This command allow to you to ignore this types of metadata. This command support all metadata types to ignore. (Can delete entire files and folders)

### **Usage**:

    sfdx ah:metadata:local:ignore [-r <filepath>] [-s simpleFirst|complexFirst|alphabetAsc|alphabetDesc] [-a | -t <array>] [-i <filepath>] [-c] [-p] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    -a | --all                                                          Ignore all metadata types according to the ignore file.
    -t | --type <MetadataTypeName>[,<MetadataTypeName>...]              Ignore the specified metadata types according to the ignore file. You can select a sigle or a list 
                                                                        separated by commas.
    [-i | --ignore-file <path/to/ignore/file>]                          Path to the ignore file. Use this if you not want to use the project root ignore file or have 
                                                                        different name. By default use .ahignore.json file from your project root.
    [-c | --compress]                                                   Add this option for compress modified files for ignore operation.
    [-s | --sort-order <sortOrder>]                                     Sort order for the XML elements when compress XML files. By default, the elements are sorted with 
                                                                        simple XML elements 
    [-p | --progress]                                                   Option to report the command progress (into the selected format) or show a 
                                                                        spinner loader
    [--json]                                                            Format output as JSON.
    [--loglevel <LOGLEVEL>]                                             The logging level for this command invocation. Logs are stored in $HOME/.sfdx/sfdx.log.     
                                                                        Permissible values are: trace, debug, info, warn, error, fatal, TRACE, DEBUG, INFO, WARN, ERROR, FATAL. Default value: warn
```

### **JSON Response**:
```json
    {
      "status": 0,
      "result": {
        "message": "Ignore metadata finished successfully",
      }
    }
```
### **Examples**:

Ignore All metadata types specified in .ahignore.json file with progress report, colors and compressing files with JSON response

    sfdx ah:metadata:local:ignore -a --json

Ignore only Custom Application, Custom Labels and Profiles specified in .ahignore.json file with another .ahignore.json with progress report

    sfdx ah:metadata:local:ignore -t "CustomApplication, Profile, CustomLabels" -i "Path/to/the/file/.myignoreFile.json" -p

---
### [**metadata:local:list**](#metadatalocallist) 
Command for list all Metadata Types stored in your local project. 

### **Usage**:

    sfdx ah:metadata:local:list [-r <filepath>] [--outputfile <filepath>] [--csv] [-p] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command
    [--output-file <path/to/output/file>]                               Path to file for redirect the output.
    [-p | --progress]                                                   Option to report the command progress (into the selected format) or show a 
                                                                        spinner loader
    [--csv]                                                             Option to show the result as CSV instead a table if not select --json flag.
    [--json]                                                            Format output as JSON.
    [--loglevel <LOGLEVEL>]                                             The logging level for this command invocation. Logs are stored in $HOME/.sfdx/sfdx.log.     
                                                                        Permissible values are: trace, debug, info, warn, error, fatal, TRACE, DEBUG, INFO, WARN, ERROR, FATAL. Default value: warn
```

### **JSON Response**:
```json
    {
      "status": 0,
      "result": {
        [
            {
                "xmlName": "APIName",
                "directoryName": "directoryName",
                "suffix": "fileSuffix",
                "inFolder": false,
                "metaFile": false,
            },
            {
                "xmlName": "APIName",
                "directoryName": "directoryName",
                "suffix": "fileSuffix",
                "inFolder": false,
                "metaFile": false,
            },
            {
                // More data...
            },
        ]
      }
    }
```
### **Examples**:

List all types with progress an table result (default)

    sfdx ah:metadata:local:list -p

List all types with csv result

    sfdx ah:metadata:local:list --csv

List all types from different project and save the output into a file and json result

    sfdx ah:metadata:local:list -r "path/to/other/project/root" --outputfile "path/to/the/output/file.txt" --json
---

### [**metadata:local:describe**](#metadatalocaldescribe)
Command to describe all or specific Metadata Types like Custom Objects, Custom Fields, Apex Classes... that you have in your local project.

### **Usage**:

    sfdx ah:metadata:local:describe [-r <filepath>] [-a | -t <array>] [--outputfile <filepath>] [--csv] [-p] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    -a | --all                                                          Describe all metadata types stored in your local project
    -t | --type <MetadataTypeName>[,<MetadataTypeName>...]              Describe the specified metadata types. You can select a single metadata or a list separated by commas. 
                                                                        This option does not take effect if you choose describe all.
    [-g | --group]                                                      Option to group global Quick Actions into GlobalActions group, false to list as object and item
    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command
    [--output-file <path/to/output/file>]                               Path to file for redirect the output.
    [-p | --progress]                                                   Option to report the command progress (into the selected format) or show a 
                                                                        spinner loader
    [--csv]                                                             Option to show the result as CSV instead a table if not select --json flag.
    [--json]                                                            Format output as JSON.
    [--loglevel <LOGLEVEL>]                                             The logging level for this command invocation. Logs are stored in $HOME/.sfdx/sfdx.log.     
                                                                        Permissible values are: trace, debug, info, warn, error, fatal, TRACE, DEBUG, INFO, WARN, ERROR, FATAL. Default value: warn
```

### **JSON Response**:
See [**Metadata JSON Format**](#metadata-json-format) section to understand about Metadata JSON Object returned by Aura Helper
```json
    {
      "status": 0,
      "result": {
        // Metadata JSON Object
      }
    }
```
### **Examples**:

Describe all metadata types stored in your local project with progress report and save the response into a file and csv response

    sfdx ah:metadata:local:describe -a -p plaintext -s "path/to/the/output/file.txt" --csv

Describe Custom Objects, Custom Fields, Profiles and ValidationRules with progress report and show results as table (by default)

    sfdx ah:metadata:local:describe -t "CustomObject, CustomField, Profile, ValidatiionRule" -p   

Describe Custom Objects and Custom Fields with json response

    sfdx ah:metadata:local:describe -t "CustomObject, CustomField" --json 

---


## [**Org Metadata Commands**](#org-metadata-commands)

# [**Data Commands**](#data-commands)

# [**Core Commands**](#core-commands)

---

# [**Ignore File**](#ignore-file)

The ignore file is a JSON file used on ignore and create package commands. On this file you can specify metadata types, objects and elements for ignore or delete from your local project or package files. You can have a main ignore file on your root project (like gitignore) named .ahignore.json for use automatically, or have different ignore files and specify it on the commands when you need tou use.

The ignore file have the next structure
```json
    {
        // Basic structure
        "MetadataTypeAPIName": {
            "MetadataObject1",
            "MetadataObject2"
        }

        // Advance Structure
        "MetadataTypeAPIName": {
            "MetadataObject1:MetadataItem1",
            "MetadataObject1:MetadataItem2",
            "MetadataObject2:*",
            "*",
            "*:*" // Only valid on Custom Objects
        }

        // Special for Permissions
        "MetadataTypeAPIName": {
            "UserPermission:MetadataObject1:PermissionName",
            "UserPermission:MetadataObject2:*",
            "UserPermission:*:PermissionName"
        }
    }
```
### Example:
```json
    {
        "CustomLabels": {
            "labelName1",                   // Ignore or remove the custom label "labelName1"
            "labelName2",                   // Ignore or remove the custom label "labelName2",
            "*"                             // Ignore or remove all Custom Labels
        },
        "AssignmentRules":{
            "Case:Assign1",                 // Ignore or remove the Assignent Rule "Assign1" from the object Case
            "Lead:*",                       // Ignore or remove all Assignment Rules from Lead
            "*"                             // Ignore or remove all Assignment Rules
        },
        "CustomObject": {
            "Account",                      // Ignore or remove the Account Object
            "Case:*",                       // Ignore or remove all related objects from case, including the object (Bussines Process, Fields, Validation Rules...),
            "*",                            // Ignore or remove all custom objects (only the object not the related metadata)
            "*:*",                          // Ignore or remove all custom objects and the related metadata (Bussines Process, Fields, Validation Rules...)
        },
        "Report": {
            "ReportFolder",                 // Ignore or remove the entire folder
            "ReportFolder1:ReportName2",    // Ignore or remove the report "ReportName2" from "ReportFolder1" folder.
            "*",                            // Ignore or remove all reports.
        },
        "Workflow": {
            "Account",                      // Ignore or remove the Account worflows (Rules, Task, Alerts...)
            "*"                             // Ignore or  remove all workflows (Rules, Task, Alerts...) from all objects 
        },
        "WorkflowRule": {
            "Case:*",                       // Ignore or remove all Workflow rules from case object
            "Account:Rule1",                // Ignore or remove "Rule1" from Account workflows,
            "*"                             // Ignore or remove all Worflow rules from all objects
        },
        "Profile": {
            "UserPermission:*:Permission1", // Remove the "Permission1" User Permission from all profiles
            "UserPermission:TestProfile:*", // Remove all User permissions from TestProfile file
            "UserPermission:Admin:Perm1",   // Remove the Perm1 User Permission from Admin profile
            "TestProfile2",                 // Ignore or remove  the "TestProfile" profile 
            "*"                             // Ignore or remove all profiles
        }
    }
```
#### IMPORTANT

    Some Metadata Types have singular and plural name like CustomLabels, MatchingRules, EscalationRules... For ignore or remove this types you must use the plural name, if use the singular name the ignore process not take effect with this types.

---

# [**Metadata JSON Format**](#metadata-file)

The describe metadata commands and compare commands return the metadata in a JSON format, the same format for create the package througth a JSON file. This means that the output of the describe or compare commands can be used as input for create the package from JSON file. The next structure are the full JSON structure file:
```json
    {
        "MetadataAPIName": {
            "name": "MetadataAPIName",                                  // Required. Contains the Metadata Type API Name (like object Key)
            "checked": false,                                           // Required. Field for include this type on package or not
            "path": "path/to/the/metadata/folder",                      // Optional. Path to the Metadata Type folder in local project
            "suffix": "fileSuffix",                                     // Optional. Metadata File suffix
            "childs": {                                                 // Object with a collection of childs (Field required but can be an empty object)
                "MetadataObjectName":{
                    "name": "MetadataObjectName",                       // Required. Contains the Metadata Object API Name (like object Key)
                    "checked": false,                                   // Required. Field for include this object on package or not
                    "path": "path/to/the/metadata/file/or/folder",      // Optional. Path to the object file or folder path
                    "childs": {                                         // Object with a collection of childs (Field required but can be an empty object)
                        "MetadataItemName": {
                            "name": "MetadataItemName",                   // Required. Contains the Metadata Item API Name (like object Key)
                            "checked": false,                           // Required. Field for include this object on package or not
                            "path": "path/to/the/metadata/file"
                        },
                        "MetadataItemName2": {
                            ...
                        },
                        ...,
                        ...,
                        ...
                    }
                }
                "MetadataObjectName2":{
                   ...
                },
                ...,
                ...,
                ...
            }
        }
    }
```

### Example:
```json
    {
        "CustomObject": {
            "name": "CustomObject",
            "checked": false,
            "path":  "path/to/root/project/force-app/main/default/objects",
            "suffix": "object",
            "childs": {
                "Account": {
                    "name": "Account",
                    "checked": true,            // Add Account Object to the package
                    "path": "path/to/root/project/force-app/main/default/objects/Account/Account.object-meta.xml",
                    "childs": {}
                },
                "Case": {
                    "name": "Case",
                    "checked": true,            // Add Case Object to the package
                    "path": "path/to/root/project/force-app/main/default/objects/Case/Case.object-meta.xml",
                    "childs": {}
                },
                ...,
                ...,
                ...
            }
        },
        "CustomField": {
            "name": "CustomField",
            "checked": false,
            "path":  "path/to/root/project/force-app/main/default/objects",
            "suffix": "field",
            "childs": {
                "Account": {
                    "name": "Account",
                    "checked": false,            
                    "path": "path/to/root/project/force-app/main/default/objects/Account/fields",
                    "childs": {
                        "customField__c": {
                            "name": "customField__c",
                            "checked": true,    // Add customField__c to the package
                            "path": "path/to/root/project/force-app/main/default/objects/Account/fields/customField__c.field-meta.xml",
                        },
                        ...,
                        ...,
                        ...
                    }
                },
                "Case": {
                    "name": "Case",
                    "checked": false,           
                    "path": "path/to/root/project/force-app/main/default/objects/Case/fields",
                    "childs": {
                        "CaseNumber": {
                            "name": "CaseNumber",
                            "checked": true,    // Add CaseNumber to the package
                            "path": "path/to/root/project/force-app/main/default/objects/Account/fields/CaseNumber.field-meta.xml",
                        },
                        ...,
                        ...,
                        ...
                    }
                },
                ...,
                ...,
                ...
            }
        }
    }
```
































<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g sfdx-aura-helper
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
sfdx-aura-helper/0.0.0 win32-x64 node-v16.10.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx hello:org [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-helloorg--n-string--f--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx hello:org [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

print a greeting and your org IDs

```
USAGE
  $ sfdx hello:org [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --force                                                                       example boolean flag
  -n, --name=name                                                                   name to print

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -v, --targetdevhubusername=targetdevhubusername                                   username or alias for the dev hub
                                                                                    org; overrides default dev hub org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx hello:org --targetusername myOrg@example.com --targetdevhubusername devhub@org.com
  sfdx hello:org --name myname --targetusername myOrg@example.com
```

_See code: [src/commands/hello/org.ts](https://github.com/JJLongoria/sfdx-aura-helper/blob/v0.0.0/src/commands/hello/org.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
