import { extendType, nonNull, objectType, stringArg } from "nexus";
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

export const FeedQuery = extendType({
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

export const PostQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.field("post", {
            type: "Post",
            args: {
                id: nonNull(stringArg())
            },
            resolve(parent, args, context, info) {
                const {id} = args;

                const post = posts.find(post => post.id === id);
                
                if (post) {
                    return post;
                } else {
                    throw new Error('Cannot find post');
                }
            },
        });
    },
});

export const PostMutation = extendType({  // 1
    type: "Mutation",
    definition(t) {
        t.nonNull.field("post", {
            type: "Post",
            args: {
                title: nonNull(stringArg()),
                content: nonNull(stringArg()),
            },
            resolve(parent, args, context) {
                const { title, content } = args

                let idCount = posts.length + 1; 
                const post = {
                    id: `${idCount}`,
                    createdAt: new Date().toISOString(),
                    title,
                    content,
                    published: false,

                };
                posts.push(post);
                return post;
            },
        });
    },
});

