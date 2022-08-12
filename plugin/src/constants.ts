export const DEFAULT_OPTIONS = {
  endpoints: [
    {
      method: `flickr.people.getPublicPhotos`,
      args: {
        extras: `description,last_update,date_taken,url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o,media,views,original_format`,
      },
    },
  ],
}

export const BASE_URL = `https://api.flickr.com/services/rest/`

export const SIZES = {
  sq: `sq_75px`,
  q: `sq_150px`,
  t: `_100px`,
  s: `_240px`,
  n: `_320px`,
  m: `_500px`,
  z: `_640px`,
  c: `_800px`,
  l: `_1024px`,
  h: `_1600px`,
  k: `_2048px`,
  o: `original`,
}

export const ERROR_CODES = {
  userIdNotFound: `10000`,
  getData: `10001`,
  transformResponse: `10002`,
  createFlickrUser: `10003`,
  getExtensionData: `10004`,
  sourceNodes: `10005`,
}
