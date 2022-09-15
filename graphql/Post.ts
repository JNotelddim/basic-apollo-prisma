import { extendType, objectType } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Post = objectType({
    name: "Post",
    definition(t) {
        t.nonNull.string("id");
        t.nonNull.string("createdAt");
        t.string("updatedAt");
        t.nonNull.string("title");
        t.nonNull.string("content");
        t.nonNull.boolean("published");
        // t.nonNull.string("author");
    },
});

let posts: NexusGenObjects["Post"][]= [
    {
        id: '1',
        createdAt: '2022-02-17T13:01:11Z',
        updatedAt: '2022-02-17T13:32:09Z',
        title: 'First Post :)',
        content: 'This is my first post',
        published: true,
    },
    {
        id: '2',
        createdAt: '2022-02-18T13:01:11Z',
        updatedAt: null,
        title: 'Software Development Post',
        content: 'This is a post about software development.',
        published: false,
    }
];

export const PostQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {
            type: "Post",
            resolve(parent, args, context, info) {
                return posts; // TODO: use prisma connection rather than hardcoded list
            },
        });
    },
});
