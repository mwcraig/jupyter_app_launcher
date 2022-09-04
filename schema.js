// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

const childProcess = require('child_process');
const json2ts = require('json-schema-to-typescript');
const fs = require('fs');
const prettier = require('prettier');

const SCHEMA_PATH = 'src/schema.ts';

async function generateInterface(schemaPath, filepath) {
  const bannerComment =
    '/* eslint-disable */ \n/**\n* This file was automatically generated by json-schema-to-typescript.\n* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,\n* and run jlpm build:schema to regenerate this file.\n*/';
  const prettierConfig = {
    singleQuote: true,
    trailingComma: 'none',
    arrowParens: 'avoid'
  };

  const content = await json2ts.compileFromFile(schemaPath, {
    unreachableDefinitions: true,
    unknownAny: false,
    bannerComment,
    format: true,
    style: {
      singleQuote: true
    }
  });

  const formatted = prettier.format(content, {
    ...prettierConfig,
    filepath
  });
  return formatted;
}

function writeFile() {
  const schemaPath = 'jupyter_app_launcher/schema/config.schema.json';

  const schemaContent = generateInterface(schemaPath, SCHEMA_PATH);
  schemaContent.then(content => fs.writeFileSync(SCHEMA_PATH, content));
}

if (require.main === module) {
  writeFile();
}
