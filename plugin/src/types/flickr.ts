// Adapted from https://github.com/davepwsmith/gatsby-source-flickr/blob/0d8fad61819d01d08acc907a9ffb2eb4463d97e4/src/index.d.ts
// and https://github.com/trailimage/flickr/blob/9596c1307e42fe6f9b3a9ac85a4b117c7164ff4d/src/types.ts

/*
INPUT
*/

const enum SizeCode {
  Thumb = `url_t`,
  Square75 = `url_sq`,
  Square150 = `url_q`,
  Small240 = `url_s`,
  Small320 = `url_n`,
  Medium500 = `url_m`,
  Medium640 = `url_z`,
  Medium800 = `url_c`,
  Large1024 = `url_l`,
  Large1600 = `url_h`,
  Large2048 = `url_k`,
  Original = `url_o`,
}

const enum TypeName {
  User = `user_id`,
  Set = `photoset_id`,
  Photo = `photo_id`,
}

const enum Status {
  Okay = `ok`,
  Failed = `fail`,
}

const enum Format {
  /** @see https://www.flickr.com/services/api/response.json.html */
  JSON = `json`,
  /** @see https://www.flickr.com/services/api/response.xmlrpc.html */
  XML = `xml`,
}

const enum Sort {
  DatePostedAsc = `date-posted-asc`,
  DatePostedDesc = `date-posted-desc`,
  DateTakenAsc = `date-taken-asc`,
  DateTakenDesc = `date-taken-desc`,
  InterestingDesc = `interestingness-desc`,
  InterestingAsc = `interestingness-asc`,
  Relevance = `relevance`,
}

/**
 * @see http://www.flickr.com/services/api/flickr.photos.licenses.getInfo.html
 */
const enum License {
  AllRightsReserved = 0,
  Attribution = 4,
  Attribution_NoDervis = 6,
  Attribution_NonCommercial_NoDerivs = 3,
  Attribution_NonCommercial = 2,
  Attribution_NonCommercial_ShareAlike = 1,
  Attribution_ShareAlike = 4,
  NoKnownRestriction = 7,
  UnitedStatesGovernmentWork = 8,
}
/**
 * @see http://www.flickr.com/services/api/flickr.photos.setSafetyLevel.html
 */
const enum SafetyLevel {
  Safe = 1,
  Moderate = 2,
  Restricted = 3,
}

/**
 * Parameters required or allowed with a Flickr API request.
 * @see https://www.flickr.com/services/api/flickr.photos.search.html
 */
export interface Params {
  [key: string]: string | number | boolean
  /** @see https://www.flickr.com/services/api/misc.api_keys.html */
  api_key?: string
  format?: `${Format}`
  nojsoncallback?: 0 | 1
  method?: string
  /** Comma-delimited list of method-specific, extra fields to return */
  extras?: string
  tags?: string
  sort?: `${Sort}`
  /**
   * Numer of items to return per page of results. The maximum is 500.
   */
  per_page?: number
  [TypeName.Photo]?: string
  [TypeName.User]?: string
  [TypeName.Set]?: string
}

interface Collection {
  id: string
  title: string
  description: string
  iconlarge: string
  iconsmall: string
  collection: Collection[]
  set: SetSummary[]
}

interface Content {
  _content: string
}

interface EditAbility {
  cancomment: boolean
  canaddmeta: boolean
}

interface Exif {
  tagspace: string
  tagspaceid: number
  tag: string
  label: string
  raw: Content
}

interface FarmLocation {
  id: string
  secret: string
  server: string
  farm: number
}

interface Location {
  latitude: number | string
  longitude: number | string
  accuracy: number
  context: number | string
  county: Place
  region: Place
  country: Place
}

interface LocationPermission extends Visibility {
  iscontent: boolean
}

interface Owner {
  nsid: string
  username: string
  realname: string
  location: string
  iconserver: string
  iconfarm: number
  path_alias: string
}

interface Permission {
  permcomment: number
  permaddmeta: number
}

interface PhotoDates {
  /** Timestamp */
  posted: number
  /** ISO */
  taken: string
  takengranularity: number
  takenunknown: boolean
  /** Timestamp */
  lastupdate: number
}

export interface PhotoInfo extends FarmLocation {
  dateuploaded: number
  isfavorite: boolean
  license: `${License}`
  safety_level: `${SafetyLevel}`
  rotation: boolean
  originalsecret: string
  originalformat: string
  owner: Owner
  title: Content
  description: Content
  visibility: Visibility
  dates: PhotoDates
  views: number
  permissions: Permission
  editability: EditAbility
  publiceditability: EditAbility
  usage: Usage
  comments: Content
  notes: any
  /** Flickr changed their API from uppercase to lower for EXIF */
  EXIF: Exif[]
  exif: Exif[]
  tags: {
    tag: TagSummary[]
  }
  location: Location
  geoperms: LocationPermission
  media: string
  urls: {
    url: URL[]
  }
}

interface PaginationInfo {
  page: number
  pages: number
  perpage: number
  per_page: number
  total: number
  stat: `${Status}`
}

interface SetPhotos extends PaginationInfo {
  id: string
  /** ID of primary photo */
  primary: string
  owner: string
  ownername: string
  photo: FlickrPhoto[]
  title: string
  count_view: number
  count_comments: number
  count_photos: number
  count_videos: number
}

interface SizeInfo {
  [key: string]: string | undefined
  [SizeCode.Small240]?: string
  height_s?: string
  width_s?: string

  [SizeCode.Large1600]?: string
  height_h?: string
  width_h?: string

  [SizeCode.Large2048]?: string
  height_k?: string
  width_k?: string

  [SizeCode.Large1024]?: string
  height_l?: string
  width_l?: string

  [SizeCode.Medium500]?: string
  height_m?: string
  width_m?: string

  [SizeCode.Original]?: string
  height_o?: string
  width_o?: string
}

export interface FlickrPhoto extends Place, FarmLocation, Visibility, SizeInfo {
  [key: string]: any
  title: string
  isprimary: boolean
  tags?: string
  description?: Content
  datetaken?: string
  datetakengranularity?: string
  latitude?: string | number
  longitude?: string | number
  context?: number | string
  geo_is_family?: boolean
  geo_is_friend?: boolean
  geo_is_contact?: boolean
  geo_is_public?: boolean
  lastupdate: string
  pathalias?: string
  exif: Exif[]
}

interface ResponsePhotos extends PaginationInfo {
  photo: FlickrPhoto[]
}

interface ResponseGalleries extends PaginationInfo {
  user_id: string
  gallery: SetInfo[]
}

interface PhotoSets extends PaginationInfo {
  photoset: FlickrPhoto[]
}

interface Place extends Content {
  place_id: string
  woeid: string
}

export const enum ResponseRootKeys {
  Photoset = `photoset`,
  Photosets = `photosets`,
  Collections = `collections`,
  Photo = `photo`,
  Photos = `photos`,
  Galleries = `galleries`,
  Gallery = `gallery`,
  Unknown = `unknown`,
}

export interface FlickrResponse {
  photoset?: SetPhotos
  photosets?: PhotoSets
  collections?: Tree
  photo?: PhotoInfo
  sizes?: SizeList
  stat: `${Status}`
  code?: number
  message?: string
  photos?: ResponsePhotos
  galleries?: ResponseGalleries
  gallery?: SetInfo
  who?: {
    tags: {
      tag: Tag[]
    }
  }
}

export interface UnwrappedResponse {
  type: `${ResponseRootKeys}`
  data: PhotoInfo[] | FlickrPhoto[] | Collection[] | ResponsePhotos | SetInfo[] | FlickrResponse[]
  total_pages?: number
}

interface SetInfo extends FarmLocation {
  title: Content
  description: Content
  owner: string
  username: string
  primary: string
  photos: number
  count_views: number
  count_comments: number
  count_photos: number
  count_vidoes: number
  can_comment: boolean
  date_create: number
  /** Timestamp */
  date_update: string
  gallery_id: string
  url: string
}

interface SetSummary {
  id: string
  title: string
  description: string
}

interface Size {
  label: string
  width: number
  height: number
  source: string
  url: string
  media: string
}

interface SizeList {
  size: Size[]
}

interface Tag {
  clean: string
  raw: Content[]
}

interface TagSummary extends Content {
  id: string
  author: string
  authorname: string
  machine_tag: number
}

interface Tree {
  collection: Collection[]
}

interface URL extends Content {
  type: string
}

interface Usage {
  candownload: boolean
  canblog: boolean
  canprint: boolean
  canshare: boolean
}

interface Visibility {
  ispublic: boolean
  isfriend: boolean
  isfamily: boolean
}

/*
OUTPUT
*/

export interface ImageUrl {
  url: string
  height: number
  width: number
  orientation: "landscape" | "portrait" | "square"
}

export interface ImageUrls {
  sq_75px: ImageUrl
  sq_150px: ImageUrl
  _100px: ImageUrl
  _240px: ImageUrl
  _320px: ImageUrl
  _500px: ImageUrl
  _640px: ImageUrl
  _800px: ImageUrl
  _1024px: ImageUrl
  _1600px: ImageUrl
  _2048px: ImageUrl
  original: ImageUrl
}

interface Geo {
  permissions: {
    is_public: number
    is_friend: number
    is_family: number
    is_contact: number
  }
  latitude?: number
  longitude?: number
  accuracy?: number
  context?: number
  woeid: number | string
  placeid: number | string
}

export interface FlickrNode {
  _id: string
  owner: string
  ownername?: string
  title: string
  license?: number
  description?: Content
  upload_date?: Date
  lastupdate_date?: Date
  datetaken?: string
  views?: number
  tags?: string
  machine_tags?: string
  geo?: Geo
  media?: string
  media_status?: string
  imageUrls?: ImageUrls
  [key: string]: any
}

export interface PeopleGetInfoResponse {
  person: {
    id: string
    nsid: string
    ispro: number
    is_deleted: number
    iconserver: string
    iconfarm: number
    path_alias: string
    has_stats: number
    username: Content
    description: Content
    photosurl: Content
    profileurl: Content
    mobileurl: Content
    photos: {
      firstdate: Content
      firstdatetaken: Content
      count: Content
    }
  }
  stat: `${Status}`
}

export interface FindByUsernameResponse {
  user: {
    id: string
    nsid: string
    username: {
      _content: string
    }
    stat: string
  }
}
