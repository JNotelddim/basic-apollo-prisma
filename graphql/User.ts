import { extendType, objectType } from "nexus";

export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("email");
        t.string("name");
    },
});

export const UsersQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("users", {
            type: "User",
            resolve: async (parent, args, context, info) => {
                const res = await context.prisma.user.findMany();
                return res;
            },
        });
    },
});