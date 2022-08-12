import type { IPluginRefOptions, PluginOptions as GatsbyPluginOptions } from "gatsby"
import type { Params } from "./flickr"

interface Extension {
  method: string
  mapping: string
  args?: Params
}
export interface Endpoint {
  method: string
  args?: Params
  extension?: Extension
}

export interface FlickrPluginOptions extends IPluginRefOptions {
  api_key: string
  username: string
  endpoints?: Endpoint[]
}

export interface FlickrNodePluginOptions extends GatsbyPluginOptions {
  api_key: string
  username: string
  endpoints?: Endpoint[]
}
