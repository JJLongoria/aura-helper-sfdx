import { CoreUtils, FileChecker } from '@aurahelper/core';
const Validator = CoreUtils.Validator;
const Utils = CoreUtils.Utils;

export default class CommandUtils {
  public static getPaths(paths: string | string[], root: string, isFolder?: boolean): string[] {
    const result: string[] = [];
    if (!root.endsWith('/') && !root.endsWith('\\')) {
      root += '/';
    }
    const resultTmp: string[] = Utils.forceArray(paths) as string[];
    for (let typeTmp of resultTmp) {
      typeTmp = typeTmp.trim();
      const path = typeTmp.startsWith('./') && typeTmp !== root ? root + typeTmp.substring(2) : typeTmp;
      if (!isFolder) {
        result.push(Validator.validateFilePath(path.trim()));
      } else {
        result.push(Validator.validateFolderPath(path.trim()));
      }
    }
    return result;
  }
}
