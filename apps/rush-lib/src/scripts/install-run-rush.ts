// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See the @microsoft/rush package's LICENSE file for license information.

// THIS FILE WAS GENERATED BY A TOOL. ANY MANUAL MODIFICATIONS WILL GET OVERWRITTEN WHENEVER RUSH IS UPGRADED.
//
// This script is intended for usage in an automated build environment where the Rush command may not have
// been preinstalled, or may have an unpredictable version.  This script will automatically install the version of Rush
// specified in the rush.json configuration file (if not already installed), and then pass a command-line to it.
// An example usage would be:
//
//    node common/scripts/install-run-rush.js install
//
// For more information, see: https://rushjs.io/pages/maintainer/setup_new_repo/

import * as path from 'path';
import * as fs from 'fs';

import {
  installAndRun,
  findRushJsonFolder,
  RUSH_JSON_FILENAME,
  runWithErrorAndStatusCode
} from './install-run';

const PACKAGE_NAME: string = '@microsoft/rush';

function getRushVersion(): string {
  const rushJsonFolder: string = findRushJsonFolder();
  const rushJsonPath: string = path.join(rushJsonFolder, RUSH_JSON_FILENAME);
  try {
    const rushJsonContents: string = fs.readFileSync(rushJsonPath, 'utf-8');
    // Use a regular expression to parse out the rushVersion value because rush.json supports comments,
    // but JSON.parse does not and we don't want to pull in more dependencies than we need to in this script.
    const rushJsonMatches: string[] = rushJsonContents.match(/\"rushVersion\"\s*\:\s*\"([0-9a-zA-Z.+\-]+)\"/)!;
    return rushJsonMatches[1];
  } catch (e) {
    throw new Error(
      `Unable to determine the required version of Rush from rush.json (${rushJsonFolder}). ` +
      'The \'rushVersion\' field is either not assigned in rush.json or was specified ' +
      'using an unexpected syntax.'
    );
  }
}

function run(): void {
  const [
    nodePath, /* Ex: /bin/node */
    scriptPath, /* /repo/common/scripts/install-run-rush.js */
    ...packageBinArgs /* [build, --to, myproject] */
  ]: string[] = process.argv;

  const scriptName: string = path.basename(scriptPath);
  const bin: string = scriptName.toLowerCase() === 'install-run-rushx.js' ? 'rushx' : 'rush';
  if (!nodePath || !scriptPath) {
    throw new Error('Unexpected exception: could not detect node path or script path');
  }

  if (process.argv.length < 3) {
    console.log(`Usage: ${scriptName} <command> [args...]`);
    console.log(`Example: ${scriptName} build --to myproject`);
    process.exit(1);
  }

  runWithErrorAndStatusCode(() => {
    const version: string = getRushVersion();
    console.log(`The rush.json configuration requests Rush version ${version}`);

    return installAndRun(PACKAGE_NAME, version, bin, packageBinArgs);
  });
}

run();
