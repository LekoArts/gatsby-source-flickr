import { describe, it, expect } from "vitest"
import { testPluginOptionsSchema } from "gatsby-plugin-utils"
import { pluginOptionsSchema } from "../plugin-options-schema"

describe(`pluginOptionsSchema`, () => {
  it(`should invalidate incorrect options (root)`, async () => {
    const options = {
      api_key: undefined,
      username: undefined,
      endpoints: `test`,
    }

    const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options)

    expect(isValid).toBe(false)
    expect(errors).toEqual([`"api_key" is required`, `"username" is required`, `"endpoints" must be an array`])
  })
  it(`should invalidate incorrect options (deep)`, async () => {
    const options = {
      api_key: undefined,
      username: undefined,
      endpoints: [
        {
          method: undefined,
          args: `test`,
          extension: {
            method: undefined,
            mapping: {
              test: `test`,
            },
          },
        },
      ],
    }

    const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options)

    expect(isValid).toBe(false)
    expect(errors).toEqual([
      `"api_key" is required`,
      `"username" is required`,
      `"endpoints[0].method" is required`,
      `"endpoints[0].args" must be of type object`,
      `"endpoints[0].extension.method" is required`,
      `"endpoints[0].extension.mapping" must be a string`,
    ])
  })
  it(`should validate correct options`, async () => {
    const options = {
      api_key: `test`,
      username: `test`,
      endpoints: [
        {
          method: `test`,
          args: {
            extras: `test`,
          },
          extension: {
            method: `test`,
            mapping: `test:123`,
          },
        },
      ],
    }

    const { isValid, errors } = await testPluginOptionsSchema(pluginOptionsSchema, options)

    expect(isValid).toBe(true)
    expect(errors).toEqual([])
  })
})
