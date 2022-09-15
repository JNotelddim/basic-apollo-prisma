import { objectType } from "nexus";

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
