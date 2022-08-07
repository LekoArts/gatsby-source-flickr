import type { GatsbyNode } from "gatsby"
import type { PluginOptions } from "./types/plugin-options"
import { ERROR_CODES } from "./constants"

export const onPluginInit: GatsbyNode["onPluginInit"] = ({ reporter }, pluginOptions: PluginOptions) => {
  reporter.setErrorMap({
    [ERROR_CODES.errorA]: {
      text: (context) => context.sourceMessage,
      level: `ERROR`,
      category: `USER`,
    },
  })

  // TODO: Remove me for production usage
  reporter.info(`[plugin]: ${JSON.stringify(pluginOptions, null, 2)}`)
}
