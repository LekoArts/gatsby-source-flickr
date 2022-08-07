import type { GatsbyNode } from "gatsby"
import type { ObjectSchema } from "gatsby-plugin-utils"
import { DEFAULT_OPTIONS } from "./constants"

const wrapOptions = (innerOptions) => `{
	resolve: \`plugin\`,
	options: {
    ${innerOptions.trim()}
  },
}
`

export const pluginOptionsSchema: GatsbyNode["pluginOptionsSchema"] = ({ Joi }): ObjectSchema =>
  Joi.object({
    optionA: Joi.string()
      .required()
      .description(`Example description for optionA`)
      .meta({ example: wrapOptions(`optionA: "Hello World",`) }),
    optionB: Joi.string()
      .default(DEFAULT_OPTIONS.optionB)
      .description(`Example description for optionB`)
      .meta({ example: wrapOptions(`optionB: "Hello World Again",`) }),
  })
