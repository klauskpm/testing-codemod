import {describe} from "vitest";

import {defineInlineTest} from "jscodeshift/src/testUtils";
import transform from '../replace-default-export-with-named';
import {readFile} from "node:fs/promises";
import {join} from "node:path";


const readFixtureFileFactory = (folderName: string) => (filename: string): Promise<string> => {
  return readFile(join(__dirname, '..', '__testfixtures__', `${folderName}/${filename}`), 'utf-8');
}

const readFixtureFile = readFixtureFileFactory('replace-default-export-with-named');

describe("replace-default-export-with-named", async () => {
  defineInlineTest(
    transform,
    {},
    await readFixtureFile('end-const.input.tsx'),
    await readFixtureFile('end-const.output.tsx'),
    'can replace end file default exports for const'
  )

  defineInlineTest(
    transform,
    {},
    await readFixtureFile('end-function.input.tsx'),
    await readFixtureFile('end-function.output.tsx'),
    'can replace end file default exports for function'
  )

  defineInlineTest(
    transform,
    {},
    await readFixtureFile('inline-const.input.tsx'),
    await readFixtureFile('inline-const.output.tsx'),
    'can replace inline default exports for function'
  )
});