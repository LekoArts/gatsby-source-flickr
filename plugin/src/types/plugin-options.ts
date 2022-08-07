import { PluginOptions as GatsbyPluginOptions } from "gatsby"

export interface PluginOptions extends GatsbyPluginOptions {
  optionA: string
  optionB?: string
}
