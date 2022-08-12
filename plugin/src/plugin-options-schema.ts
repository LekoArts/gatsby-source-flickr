import type { GatsbyNode } from "gatsby"
import type { ObjectSchema } from "gatsby-plugin-utils"
import { DEFAULT_OPTIONS } from "./constants"

const wrapOptions = (innerOptions) => `{
  resolve: \`@lekoarts/gatsby-source-flickr\`,
  options: {
    ${innerOptions.trim()}
  },
}
`

export const pluginOptionsSchema: GatsbyNode["pluginOptionsSchema"] = ({ Joi }): ObjectSchema => {
  const args = Joi.object().description(
    `Pass any required or additional arguments to the method.
    
For example, [\`photosets.getPhotos\`](https://www.flickr.com/services/api/flickr.photosets.getPhotos.html) requires the \`api_key\`, \`photoset_id\`, and \`user_id\`. For convenience reasons, the plugin **automatically adds** the \`api_key\` and \`user_id\` to the arguments. You can override this by passing your own arguments though. So in the example above, you'd only need to pass \`photoset_id\` if you want to get a photoset from your Flickr account.`
  )
  const endpointKeys = Joi.object().keys({
    method: Joi.string()
      .required()
      .description(
        `Refer to the [Flickr API](https://www.flickr.com/services/api/) for available methods. You can use any \`GET\` API.`
      ),
    args,
    extension: Joi.object()
      .keys({
        method: Joi.string()
          .required()
          .description(
            `Refer to the [Flickr API](https://www.flickr.com/services/api/) for available methods. You can use any \`GET\` API.`
          ),
        mapping: Joi.string()
          .required()
          .description(
            `The mapping between a unique identifier from the first API call and the second API call. Delimited by a \`:\`. The left side is the property from the first call, the right side the second call.
            
So for example, with the \`photosets.getList\` method you get the \`id\` of each photoset. The method \`photosets.getPhotos\` requires \`photoset_id\` as an argument (which can come from the previous call). So the mapping should be \`id:photoset_id\`.

When the GraphQL nodes for this extension are created, a backreference to the first API call will be added. So in above example, the GraphQL nodes for the \`photosets.getPhotos\` method will have a \`photoset_id\` property.`
          ),
        args,
      })
      .description(
        `Unfortunately endpoints like [\`photosets.getList\`](https://www.flickr.com/services/api/explore/flickr.photosets.getList) only return the list of photosets, not each detailed photoset itself. They want you to first query the list of photosets to get the \`photoset_id\` and then use that \`photoset_id\` to query the detailed photoset with [\`photosets.getPhotos\`](https://www.flickr.com/services/api/flickr.photosets.getPhotos.html). In this case, you can use the \`extension\` property to make this second API call.`
      ),
  })

  return Joi.object({
    api_key: Joi.string()
      .required()
      .description(
        `Your Flickr API key. Create an account on Flickr, go to [App Garden](https://www.flickr.com/services/apps/create/) to register an app and copy the API key.`
      )
      .meta({ example: wrapOptions(`api_key: \`YOUR_API_KEY\`,`) }),
    username: Joi.string()
      .required()
      .description(`Your Flickr username.`)
      .meta({ example: wrapOptions(`username: \`LekoArts\`,`) }),
    endpoints: Joi.array()
      .description(
        `Allows you to configure the endpoints that the plugin is requesting from Flickr. It sets \`people.getPublicPhotos\` as a default if no \`endpoints\` is defined.`
      )
      .meta({
        example: wrapOptions(
          `endpoints: [
      {
        // Docs: https://www.flickr.com/services/api/flickr.photosets.getPhotos.html
        method: \`flickr.photosets.getPhotos\`,
        args: {
          photoset_id: \`123\`,
          // If you don't want to get the photoset from your Flickr account, you can pass the user_id of another user.
          user_id: \`123\`,
          extras: \`geo,tags,owner_name\`,
        }
      }
    ],`
        ),
      })
      .items(endpointKeys)
      .default(DEFAULT_OPTIONS.endpoints),
  })
}
