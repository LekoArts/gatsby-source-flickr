import type { GatsbyNode } from "gatsby"

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`#graphql
    type FlickrPhotosetsList implements Node {
      content: [FlickrPhotosetsPhotos] @link(by: "photoset_id", from: "_id")
    }
  `)
}
