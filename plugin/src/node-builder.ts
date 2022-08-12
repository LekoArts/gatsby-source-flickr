import type { NodePluginArgs } from "gatsby"
import type { Got } from "got"
import { fetchPaginatedData, transformResponse } from "./api-utils"
import { ERROR_CODES } from "./constants"
import type { FlickrNode } from "./types/flickr"
import type { Endpoint } from "./types/plugin-options"

interface NodeBuilderArgs {
  endpoint: Endpoint
  userId: string
  gatsbyApi: NodePluginArgs
  flickrGot: Got
  backReference?: {
    key: string
    value: string
  }
}

const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1)

export function constructTypeName(method: string): string {
  if (!method.startsWith(`flickr.`)) {
    throw new Error(`Method "${method}" must start with "flickr."`)
  }

  return method.replace(`.get`, `.`).split(`.`).slice(1).map(capitalize).join(``)
}

export async function nodeBuilder({ endpoint, userId, gatsbyApi, flickrGot, backReference }: NodeBuilderArgs) {
  const typeName = constructTypeName(endpoint.method)
  const nodeTypeName = `Flickr${typeName}`

  const itemTimer = gatsbyApi.reporter.activityTimer(`Source from Flickr: ${typeName}`)
  itemTimer.start()

  let items

  try {
    items = await fetchPaginatedData({ flickrGot, method: endpoint.method, args: endpoint.args, userId })

    if (endpoint.extension) {
      try {
        const detailedItems = items.map((item) => {
          const [itemKey, requiredArg] = endpoint.extension.mapping.split(`:`)
          const args = {
            [requiredArg]: item[itemKey],
            ...endpoint.extension.args,
          }

          return nodeBuilder({
            endpoint: { method: endpoint.extension.method, args },
            flickrGot,
            gatsbyApi,
            userId,
            backReference: { key: requiredArg, value: item[itemKey] },
          })
        })

        await Promise.all(detailedItems)
      } catch (error) {
        gatsbyApi.reporter.panicOnBuild({
          id: ERROR_CODES.getExtensionData,
          context: {
            sourceMessage: error.message,
            method: endpoint.method,
            extensionMethod: endpoint.extension.method,
            extensionMapping: endpoint.extension.mapping,
          },
        })
        itemTimer.end()
      }
    }
  } catch (error) {
    gatsbyApi.reporter.panicOnBuild({
      id: ERROR_CODES.getData,
      context: {
        sourceMessage: error.message,
        method: endpoint.method,
      },
    })
    itemTimer.end()
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const item of items) {
    let res: FlickrNode

    try {
      res = transformResponse(item)
    } catch (error) {
      gatsbyApi.reporter.panicOnBuild({
        id: ERROR_CODES.transformResponse,
        context: {
          sourceMessage: error.message,
          method: endpoint.method,
        },
      })
      itemTimer.end()
    }

    gatsbyApi.actions.createNode({
      ...res,
      ...(backReference?.key && { [backReference.key]: backReference.value }),
      id: gatsbyApi.createNodeId(`${nodeTypeName}-${res._id}`),
      parent: null,
      children: [],
      internal: {
        type: nodeTypeName,
        content: JSON.stringify(res),
        contentDigest: gatsbyApi.createContentDigest(res),
      },
    })
  }

  itemTimer.end()
}
