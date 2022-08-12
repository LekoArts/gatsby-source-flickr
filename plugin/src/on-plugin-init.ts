import type { GatsbyNode } from "gatsby"
import { ERROR_CODES } from "./constants"

export const onPluginInit: GatsbyNode["onPluginInit"] = ({ reporter }) => {
  reporter.setErrorMap({
    [ERROR_CODES.userIdNotFound]: {
      text: (context) =>
        `Couldn't find a user_id for the username "${context.username}". Did you enter the correct username?

Original error: ${context.sourceMessage}`,
      level: `ERROR`,
      category: `USER`,
    },
    [ERROR_CODES.getData]: {
      text: (context) =>
        `There was an error getting the data for "${context.method}".

Original error: ${context.sourceMessage}`,
      level: `ERROR`,
    },
    [ERROR_CODES.transformResponse]: {
      text: (context) =>
        `There was an error transforming the API response of "${context.method}" to a valid Node shape.

Original error: ${context.sourceMessage}`,
      level: `ERROR`,
    },
    [ERROR_CODES.createFlickrUser]: {
      text: (context) =>
        `There was an error creating the "FlickrUser" node.

Original error: ${context.sourceMessage}`,
      level: `ERROR`,
    },
    [ERROR_CODES.getExtensionData]: {
      text: (context) =>
        `There was an error getting the extension data for "${context.method}".
Extension: ${context.extensionMethod}
Mapping: ${context.extensionMapping}

Original error: ${context.sourceMessage}`,
      level: `ERROR`,
    },
    [ERROR_CODES.sourceNodes]: {
      text: (context) =>
        `There was an error during sourceNodes lifecycle.

Original error: ${context.sourceMessage}`,
      level: `ERROR`,
    },
  })
}
