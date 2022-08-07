import type { GatsbyConfig, PluginRef } from "gatsby"
import type { PluginOptions } from "@lekoarts/gatsby-plugin-starter"

const config: GatsbyConfig = {
  siteMetadata: {
    siteTitle: `Demo`,
    siteUrl: `https://urltodeployeddemo.com`,
  },
  jsxRuntime: `automatic`,
  plugins: [
    {
      resolve: `@lekoarts/gatsby-plugin-starter`,
      options: {
        optionA: `valueA`,
        optionB: `valueB`,
      } as PluginOptions,
    },
  ] as PluginRef[],
}

export default config
