import { extendType, nonNull, objectType, stringArg, booleanArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const DeleteResult = objectType({
    name: "DeleteResult",
    definition(t) {
        t.nonNull.boolean("success");
    },
});

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

export const CreatePostMutation = extendType({  // 1
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createPost", {
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

export const UpdatePostMutation = extendType({  // 1
    type: "Mutation",
    definition(t) {
        t.nonNull.field("updatePost", {
            type: "Post",
            args: {
                id: nonNull(stringArg()),
                title: stringArg(),
                content: stringArg(),
                published: booleanArg(),
            },
            resolve(parent, args, context) {
                const { id, title, content, published } = args

                const existingPost = posts.find(post => post.id === id);

                if(!existingPost) {
                        throw new Error('Could not find post.');
                }

                const updatedPost = {
                    ...existingPost,
                    updatedAt: new Date().toISOString(),
                    title: title || existingPost.title,
                    content: content || existingPost.content,
                    published:  published !== undefined ? published : existingPost.published,

                };
                posts = [...posts.filter(post => post.id !== id), updatedPost];
                return updatedPost;
            },
        });
    },
});

export const DeletePostMutation = extendType({  // 1
    type: "Mutation",
    definition(t) {
        t.nonNull.field("deletePost", {
            type: "DeleteResult",
            args: {
                id: nonNull(stringArg()),
            },
            resolve(parent, args, context) {
                const { id } = args

                const existingPost = posts.find(post => post.id === id);

                if(!existingPost) {
                    return { success: false };
                }

                posts = posts.filter(post => post.id !== id);
                return { success: true };
            },
        });
    },
});

