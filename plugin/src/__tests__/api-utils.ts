import { describe, it, expect } from "vitest"
import { transformResponse, unwrap } from "../api-utils"
import { FlickrPhoto, ResponseRootKeys } from "../types/flickr"

// Fixtures
import fixturePhoto from "./fixtures/photo.json"
import fixturePhotos from "./fixtures/photos.json"
import fixturePhotoset from "./fixtures/photoset.json"
import fixturePhotosets from "./fixtures/photosets.json"
import fixtureCollections from "./fixtures/collections.json"
import fixtureGalleries from "./fixtures/galleries.json"
import fixtureGallery from "./fixtures/gallery.json"

const transformResponseInput: FlickrPhoto = {
  id: `test`,
  accuracy: `10`,
  context: `10`,
  latitude: `1.123`,
  longitude: `1.123`,
  views: `1.123`,
  datetakengranularity: `test`,
  datetakenunknown: `test`,
  dateupload: `1660296142`,
  lastupdate: `1660296142`,
  description: {
    _content: `test`,
  },
  server: `test`,
  height_h: `1600`,
  width_h: `1600`,
  height_m: `250`,
  width_m: `500`,
  height_s: `240`,
  width_s: `100`,
  title: `test`,
  farm: 10,
  isfamily: true,
  isprimary: true,
  isfriend: true,
  ispublic: true,
  secret: `test`,
  place_id: `test`,
  woeid: `test`,
  exif: [
    {
      label: `test`,
      raw: {
        _content: `test`,
      },
      tag: `test`,
      tagspace: `test`,
      tagspaceid: 1,
    },
  ],
  _content: `test`,
}

describe(`transformResponse`, () => {
  it(`handles the weird response from Flickr 😒`, () => {
    expect(transformResponse(transformResponseInput)).toEqual({
      _content: `test`,
      _id: `test`,
      description: `test`,
      exif: [
        {
          label: `test`,
          raw: {
            _content: `test`,
          },
          tag: `test`,
          tagspace: `test`,
          tagspaceid: 1,
        },
      ],
      geo: {
        accuracy: 10,
        context: 10,
        latitude: 1.123,
        longitude: 1.123,
        permissions: {},
        place_id: `test`,
        woeid: `test`,
      },
      imageUrls: {
        _1600px: {
          height: 1600,
          orientation: `square`,
          width: 1600,
        },
        _500px: {
          height: 250,
          orientation: `landscape`,
          width: 500,
        },
        _240px: {
          height: 240,
          orientation: `portrait`,
          width: 100,
        },
      },
      isfamily: true,
      isfriend: true,
      isprimary: true,
      ispublic: true,
      lastupdate_date: `2022-08-12T09:22:22.000Z`,
      title: `test`,
      upload_date: `2022-08-12T09:22:22.000Z`,
      views: 1.123,
    })
  })
})

describe(`unwrap`, () => {
  it(`handles unknown type`, () => {
    // @ts-ignore
    expect(unwrap({ hello: `world` })).toEqual({ data: [{ hello: `world` }], type: ResponseRootKeys.Unknown })
  })
  it(`handles ${ResponseRootKeys.Photo} type`, () => {
    // @ts-ignore
    expect(unwrap(fixturePhoto)).toEqual({
      data: [fixturePhoto.photo],
      type: ResponseRootKeys.Photo,
    })
  })
  it(`handles ${ResponseRootKeys.Photoset} type`, () => {
    // @ts-ignore
    expect(unwrap(fixturePhotoset)).toEqual({
      data: fixturePhotoset.photoset.photo,
      type: ResponseRootKeys.Photoset,
      total_pages: 1,
    })
  })
  it(`handles ${ResponseRootKeys.Photosets} type`, () => {
    // @ts-ignore
    expect(unwrap(fixturePhotosets)).toEqual({
      data: fixturePhotosets.photosets.photoset,
      type: ResponseRootKeys.Photosets,
      total_pages: 1,
    })
  })
  it(`handles ${ResponseRootKeys.Collections} type`, () => {
    // @ts-ignore
    expect(unwrap(fixtureCollections)).toEqual({
      data: fixtureCollections.collections.collection,
      type: ResponseRootKeys.Collections,
    })
  })
  it(`handles ${ResponseRootKeys.Photos} type`, () => {
    // @ts-ignore
    expect(unwrap(fixturePhotos)).toEqual({
      data: fixturePhotos.photos.photo,
      type: ResponseRootKeys.Photos,
      total_pages: 1,
    })
  })
  it(`handles ${ResponseRootKeys.Galleries} type`, () => {
    // @ts-ignore
    expect(unwrap(fixtureGalleries)).toEqual({
      data: fixtureGalleries.galleries.gallery,
      type: ResponseRootKeys.Galleries,
      total_pages: 1,
    })
  })
  it(`handles ${ResponseRootKeys.Gallery} type`, () => {
    // @ts-ignore
    expect(unwrap(fixtureGallery)).toEqual({
      data: [fixtureGallery.gallery],
      type: ResponseRootKeys.Gallery,
    })
  })
})
