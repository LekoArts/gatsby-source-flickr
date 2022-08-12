import type { GatsbyNode } from "gatsby"
import { ERROR_CODES } from "./constants"
import { flickrGotInstance } from "./flickr-got"
import { nodeBuilder } from "./node-builder"
import { FindByUsernameResponse, PeopleGetInfoResponse } from "./types/flickr"
import type { FlickrNodePluginOptions } from "./types/plugin-options"

export const sourceNodes: GatsbyNode["sourceNodes"] = async (gatsbyApi, pluginOptions: FlickrNodePluginOptions) => {
  const { api_key, username, endpoints } = pluginOptions

  const flickrGot = await flickrGotInstance({ api_key })

  let userId: string

  try {
    const res: FindByUsernameResponse = await flickrGot(``, {
      searchParams: { method: `flickr.people.findByUsername`, username },
    }).json()
    userId = res.user.nsid
  } catch (error) {
    gatsbyApi.reporter.panicOnBuild({
      id: ERROR_CODES.userIdNotFound,
      context: {
        sourceMessage: error.message,
        username,
      },
    })
  }

  try {
    const { person }: PeopleGetInfoResponse = await flickrGot(``, {
      searchParams: { method: `flickr.people.getInfo`, user_id: userId },
    }).json()

    gatsbyApi.actions.createNode({
      _id: person.id,
      ispro: person.ispro,
      username: person.username._content,
      description: person.description._content,
      photosurl: person.photosurl._content,
      profileurl: person.profileurl._content,
      photos: {
        firstdate: new Date(+person.photos.firstdate._content * 1000),
        firstdatetaken: person.photos.firstdatetaken._content,
        count: person.photos.count._content,
      },
      id: gatsbyApi.createNodeId(`FlickrUser-${userId}`),
      parent: null,
      children: [],
      internal: {
        type: `FlickrUser`,
        contentDigest: gatsbyApi.createContentDigest(person),
      },
    })
  } catch (error) {
    gatsbyApi.reporter.panicOnBuild({
      id: ERROR_CODES.createFlickrUser,
      context: {
        sourceMessage: error.message,
      },
    })
  }

  try {
    await Promise.all(endpoints.map((endpoint) => nodeBuilder({ endpoint, flickrGot, userId, gatsbyApi })))
  } catch (error) {
    gatsbyApi.reporter.panicOnBuild({
      id: ERROR_CODES.sourceNodes,
      context: {
        sourceMessage: error.message,
      },
    })
  }
}
