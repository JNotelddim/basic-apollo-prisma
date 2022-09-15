import { extendType, nonNull, objectType, stringArg, booleanArg, intArg } from "nexus";

import { User } from './User';

export const DeleteResult = objectType({
    name: "DeleteResult",
    definition(t) {
        t.nonNull.boolean("success");
    },
});

export const Post = objectType({
    name: "Post",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("createdAt");
        t.string("updatedAt");
        t.nonNull.string("title");
        t.string("content");
        t.nonNull.boolean("published");
        t.nonNull.field('author', {
            type: User 
        })
    },
});

export const FeedQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {
            type: "Post",
            resolve: async (parent, args, context, info) => {
                const res = await context.prisma.post.findMany();
                console.log({ res});
                return res;
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
                id: nonNull(intArg())
            },
            resolve: async (parent, args, context, info) => {
                const { id } = args;

                const post = await context.prisma.post.findUnique({
                    where: {
                        id,
                    },
                });
                
                if (post) {
                    return post;
                } else {
                    throw new Error('Cannot find post');
                }
            },
        });
    },
});

export const CreatePostMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createPost", {
            type: "Post",
            args: {
                title: nonNull(stringArg()),
                content: nonNull(stringArg()),
            },
            resolve: async (parent, args, context) =>  {
                const { title, content } = args

                const newPost = await context.prisma.post.create({
                    data: {
                        createdAt: new Date().toISOString(),
                        title,
                        content,
                        published: false,
                    },
                });

                return newPost;
            },
        });
    },
});

export const UpdatePostMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("updatePost", {
            type: "Post",
            args: {
                id: nonNull(intArg()),
                title: stringArg(),
                content: stringArg(),
                published: booleanArg(),
            },
            resolve: async (parent, args, context) => {
                const { id, title, content, published } = args

                const existingPost = await context.prisma.post.findUnique({
                    where: {
                        id,
                    },
                });

                if(!existingPost) {
                    throw new Error('Bad Request');
                }

                const updatedPost = await context.prisma.post.update({
                    where: {
                        id,
                    },
                    data: {
                        updatedAt: new Date().toISOString(),
                        title: title || existingPost.title,
                        content: content || existingPost.content,
                        published:  published !== undefined ? published : existingPost.published,
                    },
                });

                return updatedPost;
            },
        });
    },
});

export const DeletePostMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("deletePost", {
            type: "DeleteResult",
            args: {
                id: nonNull(intArg()),
            },
            resolve: async (parent, args, context) =>  {
                const { id } = args

                try {
                    context.prisma.post.delete({
                        where: {
                            id
                        }, 
                    });
                    return { success: true };
                } catch (e) {
                    return {success: false};
                }
            },
        });
    },
});

