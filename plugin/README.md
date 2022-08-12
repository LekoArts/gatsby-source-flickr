# @lekoarts/gatsby-source-flickr

Source images from [Flickr](https://flickr.com/) into [Gatsby](https://www.gatsbyjs.com/). You can leverage any `GET` endpoint from the [Flickr REST API](https://www.flickr.com/services/api/) and pull the data directly into Gatsby's GraphQL data layer.

> **Warning**
> This plugin is in Alpha state (hence the v0.x range) and still in development. Please report any issues you find.

<a href="https://github.com/LekoArts/gatsby-source-flickr/blob/main/LICENSE">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="@lekoarts/gatsby-source-flickr is released under the MIT license." />
</a>
<a href="https://www.npmjs.org/package/@lekoarts/gatsby-source-flickr">
  <img src="https://img.shields.io/npm/v/@lekoarts/gatsby-source-flickr.svg" alt="Current npm package version." />
</a>
<a href="https://npmcharts.com/compare/@lekoarts/gatsby-source-flickr?minimal=true">
  <img src="https://img.shields.io/npm/dm/@lekoarts/gatsby-source-flickr.svg" alt="Downloads per month on npm." />
</a>
<a href="https://npmcharts.com/compare/@lekoarts/gatsby-source-flickr?minimal=true">
  <img src="https://img.shields.io/npm/dt/@lekoarts/gatsby-source-flickr.svg" alt="Total downloads on npm." />
</a>
<a href="https://www.lekoarts.de?utm_source=@lekoarts/gatsby-source-flickr&utm_medium=Plugin">
  <img alt="Website" src="https://img.shields.io/badge/-website-blue">
</a>
<a href="https://twitter.com/intent/follow?screen_name=lekoarts_de">
  <img src="https://img.shields.io/twitter/follow/lekoarts_de.svg?label=Follow%20@lekoarts_de" alt="Follow @lekoarts_de" />
</a>

## Install

```shell
npm install @lekoarts/gatsby-source-flickr
```

## How to use

Add the plugin to your `gatsby-config` file:

```js:title=gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `@lekoarts/gatsby-source-flickr`,
      options: {}
    }
  ]
}
```

## Plugin Options

- [api_key (**required**)](#api_key-required)
- [username (**required**)](#username-required)
- [endpoints](#endpoints)
  - [endpoints[].method (**required**)](#endpointsmethod-required)
  - [endpoints[].args](#endpointsargs)
  - [endpoints[].extension](#endpointsextension)
    - [endpoints[].extension.method (**required**)](#endpointsextensionmethod-required)
    - [endpoints[].extension.mapping (**required**)](#endpointsextensionmapping-required)
    - [endpoints[].extension.args](#endpointsextensionargs)

### api_key (**required**)

Your Flickr API key. Create an account on Flickr, go to [App Garden](https://www.flickr.com/services/apps/create/) to register an app and copy the API key.

**Field type**: `String`

```js
{
  resolve: `@lekoarts/gatsby-source-flickr`,
  options: {
    api_key: `YOUR_API_KEY`,
  },
}
```

### username (**required**)

Your Flickr username.

**Field type**: `String`

```js
{
  resolve: `@lekoarts/gatsby-source-flickr`,
  options: {
    username: `LekoArts`,
  },
}
```

### endpoints

Allows you to configure the endpoints that the plugin is requesting from Flickr. It sets `people.getPublicPhotos` as a default if no `endpoints` is defined.

**Field type**: `Array`

**Default value**: `[{"method":"flickr.people.getPublicPhotos","args":{"extras":"description,last_update,date_taken,url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o,media,views,original_format"}}]`

```js
{
  resolve: `@lekoarts/gatsby-source-flickr`,
  options: {
    endpoints: [
      {
        // Docs: https://www.flickr.com/services/api/flickr.photosets.getPhotos.html
        method: `flickr.photosets.getPhotos`,
        args: {
          photoset_id: `123`,
          // If you don't want to get the photoset from your Flickr account, you can pass the user_id of another user.
          user_id: `123`,
          extras: `geo,tags,owner_name`,
        }
      }
    ],
  },
}
```

#### endpoints[].method (**required**)

Refer to the [Flickr API](https://www.flickr.com/services/api/) for available methods. You can use any `GET` API.

**Field type**: `String`

#### endpoints[].args

Pass any required or additional arguments to the method.

For example, [`photosets.getPhotos`](https://www.flickr.com/services/api/flickr.photosets.getPhotos.html) requires the `api_key`, `photoset_id`, and `user_id`. For convenience reasons, the plugin **automatically adds** the `api_key` and `user_id` to the arguments. You can override this by passing your own arguments though. So in the example above, you'd only need to pass `photoset_id` if you want to get a photoset from your Flickr account.

**Field type**: `Object`

#### endpoints[].extension

Unfortunately endpoints like [`photosets.getList`](https://www.flickr.com/services/api/explore/flickr.photosets.getList) only return the list of photosets, not each detailed photoset itself. They want you to first query the list of photosets to get the `photoset_id` and then use that `photoset_id` to query the detailed photoset with [`photosets.getPhotos`](https://www.flickr.com/services/api/flickr.photosets.getPhotos.html). In this case, you can use the `extension` property to make this second API call.

**Field type**: `Object`

##### endpoints[].extension.method (**required**)

Refer to the [Flickr API](https://www.flickr.com/services/api/) for available methods. You can use any `GET` API.

**Field type**: `String`

##### endpoints[].extension.mapping (**required**)

The mapping between a unique identifier from the first API call and the second API call. Delimited by a `:`. The left side is the property from the first call, the right side the second call.

So for example, with the `photosets.getList` method you get the `id` of each photoset. The method `photosets.getPhotos` requires `photoset_id` as an argument (which can come from the previous call). So the mapping should be `id:photoset_id`.

When the GraphQL nodes for this extension are created, a backreference to the first API call will be added. So in above example, the GraphQL nodes for the `photosets.getPhotos` method will have a `photoset_id` property.

**Field type**: `String`

##### endpoints[].extension.args

Pass any required or additional arguments to the method.

For example, [`photosets.getPhotos`](https://www.flickr.com/services/api/flickr.photosets.getPhotos.html) requires the `api_key`, `photoset_id`, and `user_id`. For convenience reasons, the plugin **automatically adds** the `api_key` and `user_id` to the arguments. You can override this by passing your own arguments though. So in the example above, you'd only need to pass `photoset_id` if you want to get a photoset from your Flickr account.

**Field type**: `Object`
