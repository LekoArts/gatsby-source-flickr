import got, { Got } from "got"
import { BASE_URL } from "./constants"
import type { Params } from "./types/flickr"

export const flickrGotInstance = ({ api_key }): Got =>
  got.extend({
    prefixUrl: BASE_URL,
    method: `GET`,
    headers: {
      "user-agent": `gatsby-source-flickr (https://github.com/LekoArts/gatsby-source-flickr)`,
    },
    searchParams: {
      api_key,
      format: `json`,
      nojsoncallback: 1,
    } as Params,
  })
