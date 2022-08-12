import "dotenv/config"
import type { GatsbyConfig, PluginRef } from "gatsby"
import type { FlickrPluginOptions } from "@lekoarts/gatsby-source-flickr"

const config: GatsbyConfig = {
  siteMetadata: {
    siteTitle: `@lekoarts/gatsby-source-flickr`,
    siteUrl: `https://urltodeployeddemo.com`,
  },
  jsxRuntime: `automatic`,
  graphqlTypegen: true,
  plugins: [
    {
      resolve: `@lekoarts/gatsby-source-flickr`,
      options: {
        api_key: process.env.api_key,
        username: `ars_aurea`,
        endpoints: [
          {
            method: `flickr.people.getPublicPhotos`,
            args: {
              extras: `description,last_update,date_taken,url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o,media,views,original_format`,
            },
          },
          {
            method: `flickr.photosets.getList`,
            extension: {
              method: `flickr.photosets.getPhotos`,
              mapping: `id:photoset_id`,
              args: {
                extras: `description,last_update,date_taken,url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o,media,views,original_format`,
              },
            },
          },
        ],
      } as FlickrPluginOptions,
    },
  ] as PluginRef[],
}

export default config
