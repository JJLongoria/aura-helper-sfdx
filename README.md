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

- Simplify your work with **Salesforce and Git** with the command for [**create packages**](#package-git-create) (for deploy and delete) from git changes. **Compare** two *branches*, *commits* or *tags* for create the files for deploy your package.
- [**Repair**](#metadatalocalrepair) file *dependencies errors* on your project files or [**Check only**](#metadatalocalrepair) to resolve errors manually.
- [**Compress your XML Files**](#metadata-commands) structure for make easy *identify changes* and resolve *git conflicts*. Also need less storage and work faster.
- [**Retrieve special Metadata Types**](#metadatalocalretrievespecial) like *profiles* or *permissions* sets (and others) with all data without retrieve any file more with a simple command. Also can [**Retrieve special Metadata Types**](#metadataorgretrievespecial) from the connected org.
- **Compare** your *local data* with your *authorized organization* for get the differences for delete, retrieve or anything you want. Or **Compare** the Metadata Types *between two orgs* to see the differences.
- [**Merge**](#package-merge-create) diferent **package** or **destructive** files into one file with only one command. 
- [**Ignore**](#metadatalocalignore) any metadata type from your local project or from the package files for maintance different configuration into your sandbox and production enviroments with simple file and command.
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
All commands from Aura Helper SFDX have the next structure: 

    sfdx <command:name> [command:input] [options]

Al commands start by **ah**. For example

    sfdx ah:topic:command [command:input] [options]

---

### *Commands Group*

Aura Helper SFDX has little bit different commands organizations. To make it more usefull and easy to use, all options to create packages files using Aura Helper has its own topics to organize it better. Now has specific commands to create packages from git, json file or merge package files.

- [**Help**](#help)
<p></p>

- [**Metadata Commands**](#metadata-commands)
  - [**Local Metadata Commands**](#local-metadata-commands)
  - [**Org Metadata Commands**](#org-metadata-commands)
<p></p>

- [**Package Commands**](#package-commands)
  - [**git**](#package-command-git)
  - [**json**](#package-command-json)
  - [**merge**](#package-command-merge)

- [**Data Commands**](#data-commands)
<p></p>

- [**Core Commands**](#core-commands)

---

# [**Help**](#help)
If you need help with Aura Helper SFDX, you can run:

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

- [**ah:metadata:local:compress**](#metadatalocalcompress)

    Command for compress XML files for ocuppy less data storage, and make more usefull with SVC systems like Git. With XML Files compressed, the file confilcts on merges are to much easy to resolve.

- [**ah:metadata:local:ignore**](#metadatalocalignore)

    Command for ignore some metadata types. If you use git or other SVC systems, you can construct a .gitignore file or similar for ignore some files from your SVC. But salesforce have some metadata that can't be ignored with git because have into other files, like custom labels, workflows or user permissios for example. This command allow to you to ignore this types of metadata. This command support all metadata types to ignore. (Can delete entire files and folders)

- [**ah:metadata:local:list**](#metadatalocallist)

    Command to describe all or specific Metadata Types like Custom Objects, Custom Fields, Apex Classes... that you have in your local project.

- [**ah:metadata:local:describe**](#metadatalocaldescribe)

    Command to describe all or specific Metadata Types like Custom Objects, Custom Fields, Apex Classes... that you have in your local project.

- [**ah:metadata:local:repair**](#metadatalocalrepair)

    Command to Check or Repair dependencies errors on your local project. (Only check data and types stored in your local project, do not connect to the org)

- [**ah:metadata:local:special:retrieve**](#metadatalocalretrievespecial)

    Command for retrieve the special metadata types stored in your local project. The special types are the types generated at runtime when retrieving data from org according the package data. Files like permission sets, profiles or translations. For example, with this command you can retrieve all permissions from a profile without retrieve anything more. Also you can retrieve only the Custom Object XML Files without retrieve anything more.

---


## [**ah:metadata:local:compress**](#metadatalocalcompress)
Command for compress XML files for ocuppy less data storage, and make more usefull with SVC systems like Git. With XML Files compressed, the file confilcts on merges are to much easy to resolve.

### **Usage**:

    sfdx ah:metadata:local:compress [-r <filepath>] [-s simpleFirst|complexFirst|alphabetAsc|alphabetDesc] [-a | -d <array> | -f <array>] [-p] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder. 
    -a | --all                                                          Compress all XML files with support compression in your project.
    -d | --directory <path/to/directory>[,<path/to/directory>...]       Compress XML Files from specific directory or directories separated by commas.  
                                                                        This options does not take effect if you 
                                                                        choose compress all.
    -f | --file <path/to/file> [, <path/to/file>...]                    Compress the specified XML file or files separated by commas. This options does not take effect if you                                                                 choose compress directory or all.
    [-s | --sort-order <sortOrder>]                                     Sort order for the XML elements when compress XML files. By default, the elements are sorted with 
                                                                        simple XML elements first. Values: simpleFirst, complexFirst, alphabetAsc, alphabetDesc
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

## [**ah:metadata:local:ignore**](#metadatalocalignore)
Command for ignore some metadata types. If you use git or other SVC systems, you can construct a .gitignore file or similar for ignore some files from your SVC. But salesforce have some metadata that can't be ignored with git because have into other files, like custom labels, workflows or user permissios for example. This command allow to you to ignore this types of metadata. This command support all metadata types to ignore. (Can delete entire files and folders)

### **Usage**:

    sfdx ah:metadata:local:ignore [-r <filepath>] [-s simpleFirst|complexFirst|alphabetAsc|alphabetDesc] [-a | -t <array>] [-i <filepath>] [-c] [-p] [--json] [--loglevel  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

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
                                                                        simple XML elements first. Values: simpleFirst, complexFirst, alphabetAsc, alphabetDesc
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

## [**ah:metadata:local:list**](#metadatalocallist) 
Command for list all Metadata Types stored in your local project. 

### **Usage**:

    sfdx ah:metadata:local:list [-r <filepath>] [--outputfile <filepath>] [--csv] [-p] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    [--output-file <path/to/output/file>]                               Path to file for redirect the output.
    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command
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

## [**ah:metadata:local:describe**](#metadatalocaldescribe)
Command to describe all or specific Metadata Types like Custom Objects, Custom Fields, Apex Classes... that you have in your local project.

### **Usage**:

    sfdx ah:metadata:local:describe [-r <filepath>] [-a | -t <array>] [--outputfile <filepath>] [--csv] [-p] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    -a | --all                                                          Describe all metadata types stored in your local project
    -t | --type <MetadataTypeName>[,<MetadataTypeName>...]              Describe the specified metadata types. You can select a single metadata or a list separated by commas. 
                                                                        This option does not take effect if you choose describe all.
    [-g | --group]                                                      Option to group global Quick Actions into GlobalActions group, false to list as object and item
    [--output-file <path/to/output/file>]                               Path to file for redirect the output.
    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command
    [-p | --progress]                                                   Option to report the command progress (into the selected format) or show a 
                                                                        spinner loader
    [--csv]                                                             Option to show the result as CSV instead a table if not select --json flag.
    [--json]                                                            Format output as JSON.
    [--loglevel <LOGLEVEL>]                                             The logging level for this command invocation. Logs are stored in $HOME/.sfdx/sfdx.log.     
                                                                        Permissible values are: trace, debug, info, warn, error, fatal, TRACE, DEBUG, INFO, WARN, ERROR, FATAL. Default value: warn
```

### **JSON Response**:
See [**Metadata JSON Format**](#metadata-json-format) section to learn about Metadata JSON Object returned by Aura Helper
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

## [**ah:metadata:local:repair**](#metadatalocalrepair)
Command to Check or Repair dependencies errors on your local project. (Only check data and types stored in your local project, do not connect to the org)

### **Usage**:

    sfdx ah:metadata:local:repair [-a | -t <array>] [-o] [-c] [-s simpleFirst|complexFirst|alphabetAsc|alphabetDesc] [-u] [-i <filepath>] [--outputfile <filepath>] [-p] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    [-a | --all]                                                        Check or Repair all supported metadata types. (Support up to API v53.0)
    [-t | --type <MetadataType>[,<Type:Object>,<Type:Object:Item>...]]  Check or Repair specified metadata types. You can choose single type or a list separated by commas, also 
                                                                        you can choose to repair a specified objects like "MetadataTypeAPIName:MetadataObjectAPIName" or "MetadataTypeAPIName:ObjectAPIName:ItemAPIName". For example, "CustomApplication:AppName1" for repair only AppName1 Custom App. This option does not take effet if select repair all.
    [-c | --compress]                                                   Add this option for compress modified files for ignore operation.
    [-s | --sort-order <sortOrder>]                                     Sort order for the XML elements when compress XML files. By default, the elements are sorted with 
                                                                        simple XML elements first. Values: simpleFirst, complexFirst, alphabetAsc, alphabetDesc
    
    [-u | -useignore]                                                   Option to ignore to check or repair the metadata included in ignore file
    [-i | --ignorefile]                                                 Path to the ignore file. Use this if you don't want to use the project root ignore file or has a 
                                                                        different name.
    [--output-file <path/to/output/file>]                               Path to file for redirect the output.
    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command
    [-p | --progress]                                                   Option to report the command progress (into the selected format) or show a 
                                                                        spinner loader
    [--json]                                                            Format output as JSON.
    [--loglevel <LOGLEVEL>]                                             The logging level for this command invocation. Logs are stored in $HOME/.sfdx/sfdx.log.     
                                                                        Permissible values are: trace, debug, info, warn, error, fatal, TRACE, DEBUG, INFO, WARN, ERROR, FATAL. Default value: warn
```

### **JSON Repair Response**:
See [**Dependencies Repair Response**](#repair-response) section to learn about Repair Response
```json
    {
      "status": 0,
      "result": {
            "MetadataTypeName": {
                "metadataType": "MetadataTypeName"
                "errors": [
                    {
                        "file": "path/to/file"
                        "errors": [
                            {
                                "elementPath": "xmlSuperParentTag>xmlParentTag>xmlTag",
                                "value": "error value",
                                "metadataType": "error Metadata Type",
                                "metadataObject": "error Metadata Object",
                                "metadataItem": "error Metadata Item",
                                "xmlElement": {
                                    // xml Element error data
                                }
                            },
                            {
                                ...
                            },
                            {
                                ...
                            }
                        ]
                    },
                    {
                        ...
                    },
                    {
                        ...
                    }
                ]
            }
        }
    }
```

### **JSON Check Response**:
See [**Dependencies Check Response**](#check-response) section to learn about Repair Response
```json
    {
      "status": 0,
      "result": {
            "MetadataTypeName": [
                {
                    "object": "MetadataObject",
                    "item": "MetadataItem",
                    "line": 16,
                    "startColumn": 146,
                    "endColumn": 166,
                    "message": "MetadataTypeName named MetadataObject.MetadataItem does not exists",
                    "severity": "Warning",
                    "file": "/path/to/file"
                },
                {
                    "object": "MetadataObject",
                    "item": "MetadataItem",
                    "line": 17,
                    "startColumn": 146,
                    "endColumn": 166,
                    "message": "MetadataTypeName named MetadataObject.MetadataItem does not exists",
                    "severity": "Warning",
                    "file": "/path/to/file"
                },
            ],
            "MetadataTypeName": [
                {
                    ...
                },
                {
                    ...
                }
            ]
        }
    }
```
### **Examples**:

Repair all supported types and compress repaired files

    sfdx ah:metadata:local:repair -a -c

Repair Custom Aplication named App1, All profiles, Two permission sets Perm1 and Perm2 and one Custom Field

    sfdx ah:metadata:local:repair -t "CustomApplication:App1,Profile,PermissionSet:Perm1,PermissionSet:Perm2,CustomField:Account:Custom_field__c"

Check only the errors on profiles and save the output on a file

    sfdx ah:metadata:local:repair -t "Profile" -o ""path/to/the/output/errors.txt""

---

## [**ah:metadata:local:special:retrieve**](#metadatalocalretrievespecial)
Command for retrieve the special metadata types stored in your local project. The special types are the types generated at runtime when retrieving data from org according the package data. Files like permission sets, profiles or translations. For example, with this command you can retrieve all permissions from a profile without retrieve anything more. Also you can retrieve only the Custom Object XML Files without retrieve anything more.

### **Usage**:

    sfdx ah:metadata:local:special:retrieve [-r <filepath>] [-a | -t <array>] [-i] [--downloadall] [-c] [-s simpleFirst|complexFirst|alphabetAsc|alphabetDesc] [-p] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    [-a | --all]                                                        Retrieve all supported metadata types (Profile,PermissionSet,Translations,RecordType,CustomObject)
    [-t | --type <MetadataType>[,<Type:Object>,<Type:Object:Item>...]]  Retrieve specifics metadata types. You can choose one or a comma separated list of elements. Also you can 
                                                                        choose retrieve a specific profile, object o record type. Schema -> "Type1" or "Type1,Type2" or "Type1:Object1, Type1:Object2" or "Type1:Object1:Item1" for example:  "Profile, PermissinSet" to retrieve all profiles and permission sets. "Profile:Admin" to retrieve the admin profile. "RecordType:Account:RecordType1" to retrieve the RecordType1 for the object Account or "RecordType:Account" to retrieve all Record Types for Account
    [-i | --includeorg]                                                 With this option, you can retrieve the data from org and not only for local, but only retrieve the types 
                                                                        that you have in your local.
    [--downloadall]                                                     Option to download all Metadata Types from any Namespaces (including managed packages). If this options is 
                                                                        not selected, only download and retrieve data from your org namespace
    [-c | --compress]                                                   Add this option for compress modified files for ignore operation.
    [-s | --sort-order <sortOrder>]                                     Sort order for the XML elements when compress XML files. By default, the elements are sorted with 
                                                                        simple XML elements first. Values: simpleFirst, complexFirst, alphabetAsc, alphabetDesc
    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command
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
            "id": "RetrieveId",
            "status": "RetrieveStatus",
            "done": true,   
            "success": true,
            "inboundFiles": [
                {
                    "fullName": "fileFullName",
                    "state": "fileState",
                    "type": "MetadataType",
                    "filePath": "path/to/retrieved/file",
                },
                {
                    ...
                }
            ],
            "packages": [
                {
                    "name": "packageName",
                },
                {
                    ...
                }
            ],
            "warnings": [
                {
                    "fileName": "fileNameValue",
                    "problem": "problemDescription",
                },
                {
                    ...
                }
            ],
        }
    }
```
### **Examples**:

Retrieve all supported types only including org data and only org namespace data, progress report and file compression

    sfdx ah:metadata:local:special:retrieve -a -c -i -o

Retrieve All Profiles, Perm1 and Perm2 Permission Sets, all Case RecordTypes and RtName Account Recordtype with colorized output and progress report

    sfdx ah:metadata:local:special:retrieve -t "Profile, PermissionSet:Perm1, PermissionSet:Perm2, RecordType:Case, RecordType:Account:RtName"

---

## [**Org Metadata Commands**](#org-metadata-commands)

- [**metadata:org:list**](#metadataorglist)

    Command for list all Metadata Types stored in your auth org

- [**metadata:org:describe**](#metadataorgdescribe)

    Command to describe all or specific Metadata Types likes Custom Objects, Custom Fields, Apex Classes... that you have in your auth org

- [**ah:metadata:org:compare**](#metadataorgcompare)

    Command for compare your local project with your auth org for get the differences. The result are the metadata types and objects that you have in your org, but don't have in your local project.

- [**ah:metadata:org:between:compare**](#metadataorgcomparebetween)

    Command to compare two organization to get the differences. Return the metadata that exists on target but not exists on source

- [**metadata:org:special:retrieve**](#metadataorgretrievespecial)

    Command to retrieve the special metadata types stored in your auth org. The special types are all types generated at runtime when retrieving metadata according the package data. Files like permission sets, profiles or translations. For example, with this command you can retrieve all permissions from a profile without retrieve anything more. Also you can retrieve only the Custom Object XML Files without retrieve anything more.

- [**ah:metadata:org:permissions:get**](#metadataorgpermissions)

    Command to get all available User permisions in your org.

- [**ah:metadata:org:apex:execute**](#metadataorgapexexecutor)

    Command to execute an Anonymous Apex script from file against the auth org N times.


---

## [**ah:metadata:org:list**](#metadataorglist) 
Command for list all Metadata Types stored in your local project. 

### **Usage**:

    sfdx ah:metadata:local:list [-r <filepath>] [--outputfile <filepath>] [--csv] [-p] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    [--output-file <path/to/output/file>]                               Path to file for redirect the output.
    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command
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

    sfdx ah:metadata:org:list -p

List all types with csv result

    sfdx ah:metadata:org:list --csv

List all types from different project and save the output into a file and json result

    sfdx ah:metadata:org:list -r "path/to/other/project/root" --outputfile "path/to/the/output/file.txt" --json
---


## [**ah:metadata:org:describe**](#metadataorgapexexecutor)
Command to describe all or specific Metadata Types likes Custom Objects, Custom Fields, Apex Classes... that you have in your auth org

### **Usage**:

    sfdx ah:metadata:org:describe [-r <filepath>] [-a | -t <array>] [--group] [--downloadall] [--outputfile <filepath>] [--csv] [-p] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    -a | --all                                                          Describe all metadata types
    -t | --type <MetadataTypeName>[,<MetadataTypeName>...]              Describe the specified metadata types. You can select a single metadata or a list separated by commas. 
                                                                        This option does not take effect if you choose describe all.
    [-g | --group]                                                      Option to group global Quick Actions into GlobalActions group, false to list as object and item
    [--downloadall]                                                     Option to download all Metadata Types from any Namespaces (including managed packages). If this options is 
                                                                        not selected, only download data from your org namespace
    [--output-file <path/to/output/file>]                               Path to file for redirect the output.
    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command
    [-p | --progress]                                                   Option to report the command progress (into the selected format) or show a 
                                                                        spinner loader
    [--csv]                                                             Option to show the result as CSV instead a table if not select --json flag.
    [--json]                                                            Format output as JSON.
    [--loglevel <LOGLEVEL>]                                             The logging level for this command invocation. Logs are stored in $HOME/.sfdx/sfdx.log.     
                                                                        Permissible values are: trace, debug, info, warn, error, fatal, TRACE, DEBUG, INFO, WARN, ERROR, FATAL. Default value: warn
```

### **JSON Response**:
See [**Metadata JSON Format**](#metadata-json-format) section to learn about Metadata JSON Object returned by Aura Helper
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


## [**ah:metadata:org:compare**](#metadataorgcompare)
Command for compare your local project with your auth org for get the differences. The result are the metadata types and objects that you have in your org, but don't have in your local project.

### **Usage**:

    sfdx ah:metadata:org:compare [-r <filepath>] [--outputfile <filepath>] [-p] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command
    [-p | --progress]                                                   Option to report the command progress (into the selected format) or show a 
                                                                        spinner loader
    [--csv]                                                             Option to show the result as CSV instead a table if not select --json flag.
    [--json]                                                            Format output as JSON.
    [--loglevel <LOGLEVEL>]                                             The logging level for this command invocation. Logs are stored in $HOME/.sfdx/sfdx.log.     
                                                                        Permissible values are: trace, debug, info, warn, error, fatal, TRACE, DEBUG, INFO, WARN, ERROR, FATAL. Default value: warn
```

### **JSON Response**:
See [**Metadata JSON Format**](#metadata-json-format) section to learn about Metadata JSON Object returned by Aura Helper
```json
    {
      "status": 0,
      "result": {
        // Metadata JSON Object
      }
    }
```
### **Examples**:

Compare the local and org data with json result

    aura-helper metadata:org:compare --json

Compare the local and org data with csv result

    aura-helper metadata:org:compare --csv

Compare the local and org data with table result

    aura-helper metadata:org:compare

---

## [**ah:metadata:org:between:compare**](#metadataorgcomparebetween)
Command to compare two organization to get the differences. Return the metadata that exists on target but not exists on source

### **Usage**:

    sfdx ah:metadata:org:between:compare -t <string> [-r <filepath>] [-s <string>] [--outputfile <filepath>] [-p] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command
    [-s | --source]                                                     Source Salesforce org to compare. If you want to compare your active org with other, this options is not 
                                                                        necessary because use the --root option for get the project's auth org. If you choose source, --root will be ignored
    [-t | --target]                                                     Target Salesforce org to compare
    [-p | --progress]                                                   Option to report the command progress (into the selected format) or show a spinner loader
    [--csv]                                                             Option to show the result as CSV instead a table if not select --json flag.
    [--json]                                                            Format output as JSON.
    [--loglevel <LOGLEVEL>]                                             The logging level for this command invocation. Logs are stored in $HOME/.sfdx/sfdx.log.     
                                                                        Permissible values are: trace, debug, info, warn, error, fatal, TRACE, DEBUG, INFO, WARN, ERROR, FATAL. Default value: warn
```

### **JSON Response**:
See [**Metadata JSON Format**](#metadata-json-format) section to learn about Metadata JSON Object returned by Aura Helper
```json
    {
      "status": 0,
      "result": {
        // Metadata JSON Object
      }
    }
```
### **Examples**:

Compare project org with another

    sfdx ah:metadata:org:between:compare -t test.username@salesforceOrg.com.qa

Compare between to orgs

    sfdx ah:metadata:org:between:compare -s test.username@salesforceOrg.com.uat -t test.username@salesforceOrg.com.qa

---

## [**ah:metadata:org:special:retrieve**](#metadataorgretrievespecial)
Command to retrieve the special metadata types stored in your auth org. The special types are all types generated at runtime when retrieving metadata according the package data. Files like permission sets, profiles or translations. For example, with this command you can retrieve all permissions from a profile without retrieve anything more. Also you can retrieve only the Custom Object XML Files without retrieve anything more.

### **Usage**:

    sfdx ah:metadata:org:special:retrieve [-r <filepath>] [-a | -t <array>] [--downloadall] [-c] [-s simpleFirst|complexFirst|alphabetAsc|alphabetDesc] [-p] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    [-a | --all]                                                        Retrieve all supported metadata types (Profile,PermissionSet,Translations,RecordType,CustomObject)
    [-t | --type <MetadataType>[,<Type:Object>,<Type:Object:Item>...]]  Retrieve specifics metadata types. You can choose one or a comma separated list of elements. Also you can 
                                                                        choose retrieve a specific profile, object o record type. Schema -> "Type1" or "Type1,Type2" or "Type1:Object1, Type1:Object2" or "Type1:Object1:Item1" for example:  "Profile, PermissinSet" to retrieve all profiles and permission sets. "Profile:Admin" to retrieve the admin profile. "RecordType:Account:RecordType1" to retrieve the RecordType1 for the object Account or "RecordType:Account" to retrieve all Record Types for Account
    [--downloadall]                                                     Option to download all Metadata Types from any Namespaces (including managed packages). If this options is 
                                                                        not selected, only download and retrieve data from your org namespace
    [-c | --compress]                                                   Add this option for compress modified files for ignore operation.
    [-s | --sort-order <sortOrder>]                                     Sort order for the XML elements when compress XML files. By default, the elements are sorted with 
                                                                        simple XML elements first. Values: simpleFirst, complexFirst, alphabetAsc, alphabetDesc
    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command
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
            "id": "RetrieveId",
            "status": "RetrieveStatus",
            "done": true,   
            "success": true,
            "inboundFiles": [
                {
                    "fullName": "fileFullName",
                    "state": "fileState",
                    "type": "MetadataType",
                    "filePath": "path/to/retrieved/file",
                },
                {
                    ...
                }
            ],
            "packages": [
                {
                    "name": "packageName",
                },
                {
                    ...
                }
            ],
            "warnings": [
                {
                    "fileName": "fileNameValue",
                    "problem": "problemDescription",
                },
                {
                    ...
                }
            ],
        }
    }
```
### **Examples**:

Retrieve all supported types with only org namespace data and file compression

    sfdx ah:metadata:org:special:retrieve -a -c

Retrieve All Profiles, Perm1 and Perm2 Permission Sets, all Case RecordTypes and RtName Account Recordtype

    sfdx ah:metadata:org:special:retrieve -t "Profile, PermissionSet:Perm1, PermissionSet:Perm2, RecordType:Case, RecordType:Account:RtName"

---


## [**ah:metadata:org:permissions:get**](#metadataorgpermissions)
Command to get all available User permisions in your org.

### **Usage**:

    sfdx ah:metadata:org:permissions:get [-r <filepath>] [--outputfile <filepath>] [--csv] [-p] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    [--output-file <path/to/output/file>]                               Path to file for redirect the output.
    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command
    [--csv]                                                             Option to show the result as CSV instead a table if not select --json flag.
    [--json]                                                            Format output as JSON.
    [--loglevel <LOGLEVEL>]                                             The logging level for this command invocation. Logs are stored in $HOME/.sfdx/sfdx.log.     
                                                                        Permissible values are: trace, debug, info, warn, error, fatal, TRACE, DEBUG, INFO, WARN, ERROR, FATAL. Default value: warn
```

### **JSON Response**:
```json
    {
        "status": 0,
        "result": [
            "ActivateContract",
            "ActivateOrder",
            "ActivitiesAccess",
            "AddDirectMessageMembers",
            "AllowUniversalSearch",
            ...
        ]
    }
```
### **Examples**:

Execute an script 3 times without printing log with colorized output and progress report

    sfdx ah:metadata:org:apex:execute -f "path/to/script.apex" -i 3

Execute an script 10 times wit printing log, colorized output and progress report

    sfdx ah:metadata:org:apex:execute -f "path/to/script.apex" --iterations 10 --printlog

---



## [**ah:metadata:org:apex:execute**](#metadataorgapexexecutor)
Command for retrieve the special metadata types stored in your local project. The special types are the types generated at runtime when retrieving data from org according the package data. Files like permission sets, profiles or translations. For example, with this command you can retrieve all permissions from a profile without retrieve anything more. Also you can retrieve only the Custom Object XML Files without retrieve anything more.

### **Usage**:

    sfdx ah:metadata:org:apex:execute (-f <filepath> | undefined | undefined) [-r <filepath>] [-i <number>] [-l] [-p] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    -f | --file                                                         Path to the Anonymous Apex Script file
    [-i | --iterations]                                                 Option to select the scritp execution number. For example, 3 for execute the script 3 times
    [-l | --printlog]                                                   Option to print the result log of every execution
    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command
    [--json]                                                            Format output as JSON.
    [--loglevel <LOGLEVEL>]                                             The logging level for this command invocation. Logs are stored in $HOME/.sfdx/sfdx.log.     
                                                                        Permissible values are: trace, debug, info, warn, error, fatal, TRACE, DEBUG, INFO, WARN, ERROR, FATAL. Default value: warn
```

### **JSON Response**:
```json
    {
        "status": 0,
        "result": {
            "message": "Apex execution finished succesfully"
        }
    }
```
### **Examples**:

Execute an script 3 times without printing log with colorized output and progress report

    sfdx ah:metadata:org:apex:execute -f "path/to/script.apex" -i 3

Execute an script 10 times wit printing log, colorized output and progress report

    sfdx ah:metadata:org:apex:execute -f "path/to/script.apex" --iterations 10 --printlog

---


# [**Package Commands**](#package-commands)
The Package commands are commands to create Package or Destructive XML files from different sources. You can create Package or Destructive XML files from git. Compare two branches, commits, tags...  to create package files with git changes, or create package files usings a Metadata JSON Object (See [**Metadata JSON Format**](#metadata-file) section to understand about it), or merge several Package or Destructive files into one file by type, all into only one file or other options to merge. 

## [**GIT**](#package-command-git)

- [**ah:package:git:create**](#package-git-create)

    Create a Package XML file and/or Destructive XML file from Git Changes to create a delta package to deploy and/or delete Metadata. Compare between two branches, commits or tags (even only your active branch) to create the files.

## [**JSON**](#package-command-json)

- [**ah:package:json:create**](#package-git-create)

    Create a Package XML file or Destructive XML file from a JSON Metadata File

## [**Merge**](#package-command-merge)

- [**ah:package:merge**](#package-merge-create)

    Create a Package XML file and/or Destructive XML file(s) from several package or destructive files.

---

## [**ah:package:git:create**](#package-git-create)
Create a Package XML file and/or Destructive XML file from Git Changes to create a delta package to deploy and/or delete Metadata. Compare between two branches, commits or tags (even only your active branch) to create the files.

### **Usage**:

    sfdx ah:package:git:create [-r <filepath>] [--outputpath <filepath>] [-f package|p|destructive|d|both|b] [-b] [-s <string>] [-t <string>] [-r] [-u] [-i <filepath>] [--ignoredestructive] [--destructiveignorefile <filepath>] [-p] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    [--outputpath <target/files/path>]                                  Path to save the generated files. By default is your manifest folder
    [-f | --filetype] <fileTypeValue>                                   Option to select the generated file type(s). You can choose between package (p), destructive (d) or 
                                                                        both (b). Both by default.
    [-s | --source]                                                     Source branch, commit, tag... to compare changes and create delta files. That is the new code source 
                                                                        or the "source salesforce org to get changes". You can select only source to create files from active branch changes (If not select source, also get the active branch)
    [-t | --target]                                                     Target branch, commit, tag... to compare changes and create delta files. That is the old code source 
                                                                        or the "target salesforce org to deploy changes"
    [-b | --deletebefore]                                               Option to create the Descructive XML file to deploy it before package file (delete files before deploy 
                                                                        new changes insted delete files after deploy changes).
    [-u | -useignore]                                                   Option to ignore the metadata included in ignore file from the package
    [-i | --ignorefile]                                                 Path to the ignore file. Use this if you don't want to use the project root ignore file or has a 
                                                                        different name.
    [--ignoredestructive]                                               Option to ignore metadata from destructive changes created file
    [--destructiveignorefile]                                           Path to use different ignore file to ignore destructive changes instead the ignore file to ignore 
                                                                        changes to deploy
    [-r | --raw]                                                        Option to return the raw data instead create xml files. This option returns a JSON Object with the 
                                                                        extracted data from git changes. Only work with --json flag
    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command
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
        "package": "path/to/the/created/package/file",                          // undefined if file not created
        "destructiveChanges": "path/to/the/created/destructive/file",           // undefined if file not created
        "destructiveChangesPost": "path/to/the/created/destructive/post/file"   // undefined if file not created
      }
    }
```

### **JSON RAW Response**:
See [**Metadata JSON Format**](#metadata-json-format) section to understand about Metadata JSON Object returned by Aura Helper

```json
    {
      "status": 0,
      "result": {
        "toDeploy": {
            // Metadata JSON Object with metadata to Deploy
        },
        "toDelete": {
            // Metadata JSON Object with metadata to Delete
        },
      }
    }
```

### **Examples**:

Create both files with not commited changes on active branch (default behaviour without parameters)

    sfdx ah:package:git:create

Create both files with changes between to the active branch and another branch. 

    sfdx ah:package:git:create -f both -t Develop --json

Create package file only with changes between two commits (the source commit must be the most recent commit from both)

    sfdx ah:package:git:create -f package -s 1n3a5d3 -t 4a345da

Create destructive file only to delete metadata before deploy and raw response with changes between to tags (source must be the most recent tag from both) with:

    sfdx ah:package:git:create -f destructive --deletebefore -s v2.0.0 -t v1.0.0 --raw --json

Create both files with changes between to branches, using ignore files to package and destructive files (using project ignore to package file).

    sfdx ah:package:git:create -f both -s UAT -t main -u --ignoredestructive --destructiveignorefile "./.ahignoreDestructive.json" --json

---

## [**ah:package:json:create**](#package-json-create)
Create a Package XML file or Destructive XML file from a JSON Metadata File

### **Usage**:

    sfdx ah:package:json:create -s <filepath> [-r <filepath>] [--outputpath <filepath>] [-d] [-b] [-u] [-i <filepath>] [-w] [-p] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    [--outputpath <target/files/path>]                                  Path to save the generated file. By default is your manifest folder
    -s | --source                                                       Metadata JSON file path to create the Package or Destructive file
    [-d | --todelete]                                                   Option to create the package to delete metadata (Destructive XML File).
    [-b | --deletebefore]                                               Option to create the Descructive XML file to deploy it before package file (delete files before deploy 
                                                                        new changes insted delete files after deploy changes).
    [-w | --wildcards]                                                  Option to use wildcards instead the explicit names when apply.
    [-u | -useignore]                                                   Option to ignore the metadata included in ignore file from the package
    [-i | --ignorefile]                                                 Path to the ignore file. Use this if you don't want to use the project root ignore file or has a 
                                                                        different name.
    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command
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
        "package": "path/to/the/created/package/file",                          // undefined if file not created
        "destructiveChanges": "path/to/the/created/destructive/file",           // undefined if file not created
        "destructiveChangesPost": "path/to/the/created/destructive/post/file"   // undefined if file not created
      }
    }
```
### **Examples**:

Create package XML file using data from JSON file

    sfdx ah:package:json:create -s path/to/metadata/json/file.json

Create package XML file using data from JSON file and use project ignore file to ignore Metadata from package 

    sfdx ah:package:json:create -s path/to/metadata/json/file.json -u

Create destructive XML file using data from JSON file and use project ignore file to ignore Metadata from package 

    sfdx ah:package:json:create -s path/to/metadata/json/file.json --todelete -u

Create destructive XML file using data from JSON file to deploy before package XML file.

    sfdx ah:package:json:create -s path/to/metadata/json/file.json --todelete --deletebefore


---

## [**ah:package:merge**](#package-merge-create)
Create a Package XML file and/or Destructive XML file(s) from several package or destructive files.

### **Usage**:

    sfdx ah:package:merge -s <array> [--outputpath <filepath>] [--bytype | --fullpackage | --fulldestructive | --onlypackage | --onlydestructive] [-b] [-u] [-i <filepath>  [--ignoredestructive] [--destructiveignorefile <filepath>] [-p] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

### **Options**:
```
    [-r | --root <path/to/project/root>]                                Path to project root. By default is your current folder.
    [--outputpath <target/files/path>]                                  Path to save the generated file(s). By default is your manifest folder
    -s | --source                                                       Paths to the package XML and/or Destructive XML files separated by commas
    [--bytype]                                                          Merge packages by type, that is, the package XML files into ine package xml file and destructive files 
                                                                        into one destructive. Default option.
    [--onlypackage]                                                     Merge only the package XML files into one package XML file
    [--onlydestructive]                                                 Merge only the destructive XML files into one destructive XML file
    [--fullpackage]                                                     Merge all package and destructive XML files into one package XML file
    [--fulldestructive]                                                 Merge all package and destructive XML files into one destructive XML file
    [-b | --deletebefore]                                               Option to create the Descructive XML file to deploy it before package file (delete files before deploy 
                                                                        new changes insted delete files after deploy changes).
    [-u | -useignore]                                                   Option to ignore the metadata included in ignore file from the package
    [-i | --ignorefile]                                                 Path to the ignore file. Use this if you don't want to use the project root ignore file or has a 
                                                                        different name.
    [--ignoredestructive]                                               Option to ignore metadata from destructive changes created file
    [--destructiveignorefile]                                           Path to use different ignore file to ignore destructive changes instead the ignore file to ignore 
                                                                        changes to deploy
    [--apiversion <apiVersion>]                                         Override the api version used for api requests made by this command
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
        "package": "path/to/the/created/package/file",                          // undefined if file not created
        "destructiveChanges": "path/to/the/created/destructive/file",           // undefined if file not created
        "destructiveChangesPost": "path/to/the/created/destructive/post/file"   // undefined if file not created
      }
    }
```
### **Examples**:

Merge package and destructive files by type (default behaviour)

    sfdx ah:package:merge -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, path/to/destructiveChangesPost1.xml"

Merge package and destructive files by type and create the destructive XML file to deploy before 

    sfdx ah:package:merge -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, path/to/destructiveChangesPost1.xml" --bytype --deletebefore

Merge only package XML files into one package XML file (destructive files will be omitted)

    sfdx ah:package:merge -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, path/to/destructiveChangesPost1.xml" --onlypackage

Merge only destructive XML files into one destructive XML file (package files will be omitted)

    sfdx ah:package:merge -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, path/to/destructiveChangesPost1.xml" --onlydestructive

Merge only destructive XML files into one destructive XML file (package files will be omitted) and create destructive to deploy before

    sfdx ah:package:merge -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, path/to/destructiveChangesPost1.xml" --onlydestructive --deletebefore

Merge all files into only one package XML file (including destructives)

    sfdx ah:package:merge -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, path/to/destructiveChangesPost1.xml" --fullpackage

Merge all files into only one destructive XML file (including packages)

    sfdx ah:package:merge -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, path/to/destructiveChangesPost1.xml" --fulldestructive

Merge all files into only one destructive XML file (including packages) to deploy before

    sfdx ah:package:merge -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, path/to/destructiveChangesPost1.xml" --fulldestructive --deletebefore

---


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
# [**Dependencies Repair Response**](#repair-response)
When you repair dependencies with any option (compress or not, repair specified types...) the response error has the next structure:
```json
    {
        "MetadataTypeName": {
            "metadataType": "MetadataTypeName"
            "errors": [
                {
                    "file": "path/to/file"
                    "errors": [
                        {
                            "elementPath": "xmlSuperParentTag>xmlParentTag>xmlTag",
                            "value": "error value",
                            "metadataType": "error Metadata Type",
                            "metadataObject": "error Metadata Object",
                            "metadataItem": "error Metadata Item",
                            "xmlElement": {
                                // xml Element error data
                            }
                        },
                        {
                            ...
                        },
                        {
                            ...
                        }
                    ]
                },
                {
                    ...
                },
                {
                    ...
                }
            ]
        }
    }
```
### **Example**:

```json
    {
        "CustomApplication": {
            "metadataType": "CustomApplication"
            "errors": [
                {
                    "file": "..../force-app/main/default/applications/customApplicationExample.app-meta.xml"
                    "errors": [
                        {
                            "elementPath": "actionOverrides>content",
                            "value": "FlexiPageExample",
                            "metadataType": "FlexiPage",
                            "metadataObject": "FlexiPageExample",
                            "xmlElement": {
                                "actionName": "View",
                                "comment": "Action override description",
                                "content": "FlexiPageExample",
                                "formFactor": "Large",
                                "pageOrSobjectType": "Account",
                                "skipRecordTypeSelect": false,
                                "type": "Flexipage"
                            }
                        },
                        {
                            ...
                        },
                        {
                            ...
                        }
                    ]
                },
                {
                    ...
                },
                {
                    ...
                }
            ]
        },
        "PermissionSet": {
            "metadataType": "PermissionSet"
            "errors": [
                {
                    "file": "..../force-app/main/default/permissionsets/permissionSetExample.app-meta.xml"
                    "errors": [
                        {
                            "elementPath": "fieldPermissions>field",
                            "value": "Account.custom_field__c",
                            "metadataType": "CustomField",
                            "metadataObject": "Account",
                            "metadataItem": "custom_field__c",
                            "xmlElement": {
                                "editable": false,
                                "field": "Account.custom_field__c",
                                "readable": false
                            }
                        },
                        {
                            ...
                        },
                        {
                            ...
                        }
                    ]
                },
                {
                    ...
                },
                {
                    ...
                }
            ]
        }
    }
```

# [**Dependencies Check Response**](#check-response)
When you only check dependencies errors the response error has the next structure:

```json
    {
        "MetadataTypeName": [
            {
                "object": "MetadataObject",
                "item": "MetadataItem",
                "line": 16,
                "startColumn": 146,
                "endColumn": 166,
                "message": "MetadataTypeName named MetadataObject.MetadataItem does not exists",
                "severity": "Warning",
                "file": "/path/to/file"
            },
            {
                "object": "MetadataObject",
                "item": "MetadataItem",
                "line": 17,
                "startColumn": 146,
                "endColumn": 166,
                "message": "MetadataTypeName named MetadataObject.MetadataItem does not exists",
                "severity": "Warning",
                "file": "/path/to/file"
            },
        ],
        "MetadataTypeName": [
            {
                ...
            },
            {
                ...
            }
        ]
    }
```

### **Example**:

```json
    {
        "CustomApplication": [
            {
                "object": "FlexiPageExample",
                "line": 16,
                "startColumn": 146,
                "endColumn": 166,
                "message": "FlexiPage named FlexiPageExample does not exists",
                "severity": "Warning",
                "file": "..../force-app/main/default/applications/customApplicationExample.app-meta.xml"
            },
            {
                "object": "FlexiPageExample",
                "line": 17,
                "startColumn": 146,
                "endColumn": 166,
                "message": "FlexiPage named FlexiPageExample does not exists",
                "severity": "Warning",
                "file": "..../force-app/main/default/applications/customApplicationExample.app-meta.xml"
            },
        ],
        "PermissionSet": [
            {
                "object": "Account",
                "item": "custom_field__c",
                "line": 1771,
                "startColumn": 56,
                "endColumn": 85,
                "message": "CustomField named Account.custom_field__c does not exists",
                "severity": "Warning",
                "file": "..../force-app/main/default/permissionsets/permissionSetExample.permissionset-meta.xml"
            },
            {
                "object": "Account",
                "item": "custom_field2__c",
                "line": 1772,
                "startColumn": 56,
                "endColumn": 85,
                "message": "CustomField named Account.custom_field2__c does not exists",
                "severity": "Warning",
                "file": "..../force-app/main/default/permissionsets/permissionSetExample.permissionset-meta.xml"
            },
        ]
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
