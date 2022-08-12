// Adapted from https://github.com/davepwsmith/gatsby-source-flickr/blob/0d8fad61819d01d08acc907a9ffb2eb4463d97e4/src/gatsby-node.ts

import type { Got } from "got"
import { SIZES } from "./constants"
import {
  FlickrNode,
  FlickrPhoto,
  ImageUrl,
  Params,
  FlickrResponse,
  ResponseRootKeys,
  UnwrappedResponse,
} from "./types/flickr"

export function transformResponse(res: FlickrPhoto): FlickrNode {
  const output = res

  output._id = res.id
  delete output.id

  Object.keys(SIZES).forEach((suffix) => {
    if (Object.prototype.hasOwnProperty.call(output, `height_${suffix}`)) {
      output[`height_${suffix}`] = parseInt(output[`height_${suffix}`] as string, 10)
    }
    if (Object.prototype.hasOwnProperty.call(output, `width_${suffix}`)) {
      output[`width_${suffix}`] = parseInt(output[`width_${suffix}`] as string, 10)
    }
  })

  if (Object.prototype.hasOwnProperty.call(output, `accuracy`)) {
    output.accuracy = parseInt(output.accuracy as string, 10)
  }
  if (Object.prototype.hasOwnProperty.call(output, `context`)) {
    output.context = parseInt(output.context as string, 10)
  }
  if (Object.prototype.hasOwnProperty.call(output, `latitude`)) {
    output.latitude = parseFloat(output.latitude as string)
  }
  if (Object.prototype.hasOwnProperty.call(output, `longitude`)) {
    output.longitude = parseFloat(output.longitude as string)
  }
  if (Object.prototype.hasOwnProperty.call(output, `views`)) {
    output.views = parseFloat(output.views as string)
  }
  if (Object.prototype.hasOwnProperty.call(output, `datetakengranularity`)) {
    delete output.datetakengranularity
  }
  if (Object.prototype.hasOwnProperty.call(output, `datetakenunknown`)) {
    delete output.datetakenunknown
  }
  if (Object.prototype.hasOwnProperty.call(output, `dateupload`)) {
    output.upload_date = new Date(+output.dateupload * 1000).toISOString()
    delete output.dateupload
  }
  if (Object.prototype.hasOwnProperty.call(output, `date_create`)) {
    output.date_create = new Date(+output.date_create * 1000).toISOString()
  }
  if (Object.prototype.hasOwnProperty.call(output, `date_update`)) {
    output.date_update = new Date(+output.date_update * 1000).toISOString()
  }
  if (Object.prototype.hasOwnProperty.call(output, `lastupdate`)) {
    output.lastupdate_date = new Date(+output.lastupdate * 1000).toISOString()
    delete output.lastupdate
  }
  if (Object.prototype.hasOwnProperty.call(output, `description`)) {
    if (Object.prototype.hasOwnProperty.call(output.description, `_content`)) {
      // @ts-ignore
      output.description = output.description._content
    }
  }
  if (Object.prototype.hasOwnProperty.call(output, `username`)) {
    if (Object.prototype.hasOwnProperty.call(output.username, `_content`)) {
      output.username = output.username._content
    }
  }
  if (Object.prototype.hasOwnProperty.call(output, `photosurl`)) {
    if (Object.prototype.hasOwnProperty.call(output.photosurl, `_content`)) {
      output.photosurl = output.photosurl._content
    }
  }
  if (Object.prototype.hasOwnProperty.call(output, `profileurl`)) {
    if (Object.prototype.hasOwnProperty.call(output.profileurl, `_content`)) {
      output.profileurl = output.profileurl._content
    }
  }
  if (Object.prototype.hasOwnProperty.call(output, `profileurl`)) {
    if (Object.prototype.hasOwnProperty.call(output.profileurl, `_content`)) {
      output.profileurl = output.profileurl._content
    }
  }
  if (Object.prototype.hasOwnProperty.call(output, `title`)) {
    if (Object.prototype.hasOwnProperty.call(output.title, `_content`)) {
      // @ts-ignore
      output.title = output.title._content
    }
  }

  output.imageUrls = {}
  output.geo = {
    permissions: {},
  }

  const geospatial = [
    `longitude`,
    `latitude`,
    `geo_is_public`,
    `geo_is_family`,
    `geo_is_friend`,
    `geo_is_contact`,
    `accuracy`,
    `context`,
    `place_id`,
    `woeid`,
  ]

  // eslint-disable-next-line no-restricted-syntax
  for (const key in output) {
    if (Object.prototype.hasOwnProperty.call(output, key)) {
      const lastElem = key.toString().split(`_`).pop()
      const firstElem = key.toString().split(`_`).shift()

      if (firstElem && lastElem && Object.keys(SIZES).includes(lastElem)) {
        const sizeKey = SIZES[lastElem]
        const newElem = firstElem === `url` ? { [firstElem]: output[key] } : { [firstElem]: output[key] }
        output.imageUrls[sizeKey] = { ...output.imageUrls[sizeKey], ...newElem }
        delete output[key]
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const image in output.imageUrls) {
        if (Object.prototype.hasOwnProperty.call(output.imageUrls, image)) {
          const element: ImageUrl = output.imageUrls[image]

          element.orientation =
            // eslint-disable-next-line no-nested-ternary
            element.width === element.height ? `square` : element.width > element.height ? `landscape` : `portrait`
        }
      }

      if (geospatial.includes(key)) {
        if (firstElem && firstElem === `geo`) {
          output.geo.permissions[key.toString().substring(4)] = output[key]
        } else {
          output.geo[key] = output[key]
        }
        delete output[key]
      }
    }
  }

  delete output.server
  delete output.farm
  delete output.iconserver
  delete output.iconfarm
  delete output.secret

  return output as unknown as FlickrNode
}

interface GetDataArgs {
  method: string
  args?: Params
  userId: string
  flickrGot: Got
}

export function unwrap(res: FlickrResponse): UnwrappedResponse {
  if (Object.prototype.hasOwnProperty.call(res, ResponseRootKeys.Photo)) {
    const data = res[ResponseRootKeys.Photo]
    return {
      type: ResponseRootKeys.Photo,
      data: [data],
    }
  }
  if (Object.prototype.hasOwnProperty.call(res, ResponseRootKeys.Photoset)) {
    const data = res[ResponseRootKeys.Photoset]
    return {
      type: ResponseRootKeys.Photoset,
      data: data.photo,
      total_pages: data.pages,
    }
  }
  if (Object.prototype.hasOwnProperty.call(res, ResponseRootKeys.Photosets)) {
    const data = res[ResponseRootKeys.Photosets]
    return {
      type: ResponseRootKeys.Photosets,
      data: data.photoset,
      total_pages: data.pages,
    }
  }
  if (Object.prototype.hasOwnProperty.call(res, ResponseRootKeys.Collections)) {
    const data = res[ResponseRootKeys.Collections]
    return {
      type: ResponseRootKeys.Collections,
      data: data.collection,
    }
  }
  if (Object.prototype.hasOwnProperty.call(res, ResponseRootKeys.Photos)) {
    const data = res[ResponseRootKeys.Photos]
    return {
      type: ResponseRootKeys.Photos,
      data: data.photo,
      total_pages: data.pages,
    }
  }
  if (Object.prototype.hasOwnProperty.call(res, ResponseRootKeys.Galleries)) {
    const data = res[ResponseRootKeys.Galleries]
    return {
      type: ResponseRootKeys.Galleries,
      data: data.gallery,
      total_pages: data.pages,
    }
  }
  if (Object.prototype.hasOwnProperty.call(res, ResponseRootKeys.Gallery)) {
    const data = res[ResponseRootKeys.Gallery]
    return {
      type: ResponseRootKeys.Gallery,
      data: [data],
    }
  }

  // Fallback to just returning the response
  return {
    type: ResponseRootKeys.Unknown,
    data: [res],
  }
}

export async function fetchPaginatedData({ method, args = {}, userId, flickrGot }: GetDataArgs) {
  const searchParams: Params = {
    user_id: userId,
    per_page: 200,
    page: 1,
    ...args,
    method,
  }

  return flickrGot.paginate.all<UnwrappedResponse, FlickrResponse>(``, {
    responseType: `json`,
    searchParams,
    pagination: {
      countLimit: 60,
      // @ts-ignore
      transform: (response) => unwrap(response.body).data,
      paginate: (response) => {
        const prevSearchParams = response.request.options.searchParams
        const prevPage = Number(prevSearchParams.get(`page`))
        const unwrapped = unwrap(response.body)
        const totalPages = unwrapped?.total_pages

        if (!totalPages || prevPage > totalPages) {
          return false
        }

        return {
          searchParams: {
            ...prevSearchParams,
            page: prevPage + 1,
          },
        }
      },
    },
  })
}
