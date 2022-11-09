/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import { graphql } from "gatsby"
import * as React from "react"

const PublicPhotos = ({ publicPhotos }: { publicPhotos: Queries.PublicPhotosFragment["publicPhotos"]["nodes"] }) => (
  <div className="img-grid">
    {publicPhotos.map((p) => (
      <figure key={p.description}>
        <img loading="lazy" alt={p.description} src={p.imageUrls.image.url} />
      </figure>
    ))}
  </div>
)

const Photosets = ({ photosets }: { photosets: Queries.PhotosetsFragment["photosets"]["nodes"] }) => (
  <React.Fragment>
    {photosets.map((p) => {
      if (!p.title) return null

      return (
        <React.Fragment key={p.title}>
          <h2>{p.title}</h2>
          <div className="img-grid">
            {p.content.map((c) => {
              if (!c.description) return null

              return (
                <figure key={c.description}>
                  <img loading="lazy" alt={c.description} src={c.imageUrls.image.url} />
                </figure>
              )
            })}
          </div>
        </React.Fragment>
      )
    })}
  </React.Fragment>
)

const IndexPage = ({ data: { photosets, user, publicPhotos } }: { data: Queries.IndexPageQuery }) => (
  <div className="wrapper">
    <main>
      <h1>@lekoarts/gatsby-source-flickr</h1>
      <p>
        The user <code>{user.username}</code> has <b>{user.photos.count}</b> images on Flickr.
      </p>
      <p>
        A couple of photos pulled from <code>flickr.people.getPublicPhotos</code> shown here:
      </p>
      {publicPhotos.nodes.length > 0 ? (
        <PublicPhotos publicPhotos={publicPhotos.nodes} />
      ) : (
        <p>No public photos found.</p>
      )}
      <p>
        A couple of photos pulled from <code>flickr.photosets.getList</code> & <code>flickr.photosets.getPhotos</code>
        {` `}
        shown here:
      </p>
      {photosets.nodes.length > 0 ? <Photosets photosets={photosets.nodes} /> : <p>No photosets found.</p>}
    </main>
    <footer>
      Demo of @lekoarts/gatsby-source-flickr – <a href="https://www.github.com/LekoArts/gatsby-source-flickr">GitHub</a>
      {` `}– <a href="https://www.lekoarts.de">Website</a>
    </footer>
  </div>
)

export default IndexPage

export const query = graphql`
  fragment PublicPhotos on Query {
    publicPhotos: allFlickrPeoplePublicPhotos(sort: { datetaken: ASC }, limit: 3) {
      nodes {
        title
        description
        imageUrls {
          image: _640px {
            url
          }
        }
      }
    }
  }

  fragment Photosets on Query {
    photosets: allFlickrPhotosetsList(sort: { date_create: ASC }, limit: 3) {
      nodes {
        title
        content {
          imageUrls {
            image: _640px {
              url
            }
          }
          description
        }
      }
    }
  }

  query IndexPage {
    user: flickrUser {
      username
      photos {
        count
      }
    }
    ...PublicPhotos
    ...Photosets
  }
`

export const Head = () => (
  <>
    <title>@lekoarts/gatsby-source-flickr</title>
    <link
      rel="icon"
      href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>🎨</text></svg>"
    />
  </>
)
