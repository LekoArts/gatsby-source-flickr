/* eslint-disable no-console */
import { Joi } from "gatsby-plugin-utils"
import fs from "fs-extra"
import prettier from "prettier"
import Handlebars from "handlebars"
import startCase from "lodash.startcase"
import toc from "markdown-toc"

import { pluginOptionsSchema } from "./src/plugin-options-schema"

const PLUGIN_NAME = `@lekoarts/gatsby-source-flickr`
const DEFAULT_README = `# ${PLUGIN_NAME}

Source images from [Flickr](https://flickr.com/) into [Gatsby](https://www.gatsbyjs.com/). You can leverage any \`GET\` endpoint from the [Flickr REST API](https://www.flickr.com/services/api/) and pull the data directly into Gatsby's GraphQL data layer.

> **Warning**
> This plugin is in Alpha state (hence the v0.x range) and still in development. Please report any issues you find.

<a href="https://github.com/LekoArts/gatsby-source-flickr/blob/main/LICENSE">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="${PLUGIN_NAME} is released under the MIT license." />
</a>
<a href="https://www.npmjs.org/package/${PLUGIN_NAME}">
  <img src="https://img.shields.io/npm/v/${PLUGIN_NAME}.svg" alt="Current npm package version." />
</a>
<a href="https://npmcharts.com/compare/${PLUGIN_NAME}?minimal=true">
  <img src="https://img.shields.io/npm/dm/${PLUGIN_NAME}.svg" alt="Downloads per month on npm." />
</a>
<a href="https://npmcharts.com/compare/${PLUGIN_NAME}?minimal=true">
  <img src="https://img.shields.io/npm/dt/${PLUGIN_NAME}.svg" alt="Total downloads on npm." />
</a>
<a href="https://www.lekoarts.de?utm_source=${PLUGIN_NAME}&utm_medium=Plugin">
  <img alt="Website" src="https://img.shields.io/badge/-website-blue">
</a>
<a href="https://twitter.com/intent/follow?screen_name=lekoarts_de">
  <img src="https://img.shields.io/twitter/follow/lekoarts_de.svg?label=Follow%20@lekoarts_de" alt="Follow @lekoarts_de" />
</a>

## Install

\`\`\`shell
npm install ${PLUGIN_NAME}
\`\`\`

## How to use

Add the plugin to your \`gatsby-config\` file:

\`\`\`js:title=gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: \`${PLUGIN_NAME}\`,
      options: {}
    }
  ]
}
\`\`\`

## Plugin Options

`

const PRETTIER_CONFIG = {
  printWidth: 80,
  semi: false,
  trailingComma: `es5`,
}

/**
 * This script autogenerates the plugin README.md file. If you want to change something in the README, change it here or in the src/plugin-options-schema.ts file.
 */
async function writeReadme() {
  console.info(`Writing README.md...`)

  try {
    const mdString = await getMdString()
    await fs.writeFile(`./README.md`, mdString)
    console.info(`Successfully created README.md`)
  } catch (error) {
    console.error(error)
  }
}

if (process.env.NODE_ENV !== `test`) {
  writeReadme()
}

async function getMdString() {
  const schema = pluginOptionsSchema({ Joi }).describe()
  const mdString = generateMdStringFromSchemaDescription(schema)
  return mdString
}

async function generateMdStringFromSchemaDescription(schema) {
  const template = Handlebars.compile(`{{{defaultReadme}}}
{{{tableOfContents}}}
{{{docs}}}`)

  const docs = joiKeysToMD({
    keys: schema.keys,
  })
  const tableOfContents = toc(docs).content

  const mdContents = template({
    defaultReadme: DEFAULT_README,
    tableOfContents,
    docs,
  })

  const mdStringFormatted = prettier.format(mdContents, {
    parser: `markdown`,
    ...PRETTIER_CONFIG,
  })

  return mdStringFormatted
}

type Types =
  | "any"
  | "alternatives"
  | "array"
  | "boolean"
  | "binary"
  | "date"
  | "function"
  | "link"
  | "number"
  | "object"
  | "string"
  | "symbol"

type joiKeyToMDProps = {
  keys: {
    type?: Types | string
    label?: string
    description?: string
    flags?: object
    notes?: string[]
    tags?: string[]
    metas?: any[]
    example?: any[]
    valids?: any[]
    invalids?: any[]
    unit?: string
    [key: string]: any
  }
  inputMdString?: string
  level?: number
  parent?: string
  parentMetas?: any
}

function joiKeysToMD({ keys, inputMdString = ``, level = 2, parent = null, parentMetas = [] }: joiKeyToMDProps) {
  if (!keys || (parentMetas.length && parentMetas.find((meta) => meta.portableOptions))) {
    return inputMdString
  }

  let mdString = inputMdString

  Object.entries(keys).forEach(([key, value]) => {
    const isRequired = value.flags && value.flags.presence === `required`

    const title = `${parent ? `${parent}.` : ``}${key}${isRequired ? ` (**required**)` : ``}`

    mdString += `${`#`.repeat(level + 1)} ${title}`

    if (value.flags.description) {
      mdString += `\n\n`
      const description = value.flags.description.trim()
      mdString += description.endsWith(`.`) ? description : `${description}.`
    }

    if (value.type) {
      const { trueType } = (value.metas && value.metas.find((meta) => `trueType` in meta)) || {}

      mdString += `\n\n`
      mdString += `**Field type**: \`${(trueType || value.type)
        .split(`|`)
        .map((typename) => startCase(typename))
        .join(` | `)}\``
    }

    if ((value.flags && `default` in value.flags) || (value.metas && value.metas.find((meta) => `default` in meta))) {
      const defaultValue =
        ((value.metas && value.metas.find((meta) => `default` in meta)) || {}).default || value.flags.default

      let printedValue

      if (typeof defaultValue === `string`) {
        printedValue = defaultValue
      } else if (Array.isArray(defaultValue)) {
        printedValue = JSON.stringify(defaultValue)
      } else if ([`boolean`, `function`, `number`].includes(typeof defaultValue)) {
        printedValue = defaultValue.toString()
      } else if (defaultValue === null) {
        printedValue = `null`
      }

      if (typeof printedValue === `string`) {
        mdString += `\n\n`
        mdString += `**Default value**: ${
          printedValue.includes(`\n`) ? `\n\`\`\`js\n${printedValue}\n\`\`\`` : `\`${printedValue}\``
        }`
      }
    }

    if (value.metas) {
      const examples = value.metas.filter((meta) => `example` in meta)
      examples.forEach(({ example }) => {
        mdString += `\n\n\`\`\`js\n${example}\`\`\`\n`
      })
    }

    mdString += `\n\n`

    if (value.keys) {
      mdString = joiKeysToMD({
        keys: value.keys,
        inputMdString: mdString,
        level: level + 1,
        parent: title,
        parentMetas: value.metas,
      })
    }

    if (value.items && value.items.length) {
      value.items.forEach((item) => {
        if (item.keys) {
          mdString = joiKeysToMD({
            keys: item.keys,
            inputMdString: mdString,
            level: level + 1,
            parent: `${title}[]`,
            parentMetas: value.metas,
          })
        }
      })
    }
  })

  return mdString
}
