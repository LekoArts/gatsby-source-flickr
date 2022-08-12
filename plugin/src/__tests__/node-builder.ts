import { describe, it, expect } from "vitest"
import { constructTypeName } from "../node-builder"

describe(`constructTypeName`, () => {
  it(`should return the correct name`, () => {
    expect(constructTypeName(`flickr.photos.getInfo`)).toEqual(`PhotosInfo`)
    expect(constructTypeName(`flickr.groups.discuss.replies.getInfo`)).toEqual(`GroupsDiscussRepliesInfo`)
  })
  it(`should throw error when method does not start with flickr.`, () => {
    expect(() => constructTypeName(`hello.world`)).toThrow(`Method "hello.world" must start with "flickr."`)
  })
})
