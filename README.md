sfdx-aura-helper
================

Aura Helper CLI tool converted into SFDX Plugin

[![Version](https://img.shields.io/npm/v/sfdx-aura-helper.svg?logo=npm)](https://npmjs.org/package/sfdx-aura-helper)
[![Total Downloads](https://img.shields.io/npm/dt/sfdx-aura-helper?logo=npm)](https://www.npmjs.com/package/sfdx-aura-helper)
[![Downloads/Month](https://img.shields.io/npm/dm/sfdx-aura-helper?logo=npm)](https://www.npmjs.com/package/sfdx-aura-helper)
[![Issues](https://img.shields.io/github/issues/jjlongoria/sfdx-aura-helper)](https://github.com/JJLongoria/sfdx-aura-helper/issues)
[![Known Vulnerabilities](https://snyk.io/test/github/JJLongoria/sfdx-aura-helper/badge.svg)](https://snyk.io/test/github/JJLongoria/sfdx-aura-helper)
[![Code Size](https://img.shields.io/github/languages/code-size/jjlongoria/sfdx-aura-helper)](https://github.com/JJLongoria/sfdx-aura-helper)
[![License](https://img.shields.io/github/license/jjlongoria/sfdx-aura-helper?logo=github)](https://github.com/JJLongoria/sfdx-aura-helper/blob/master/LICENSE)

<!-- toc -->
<!-- install -->
<!-- usage -->
<!-- commands -->
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
