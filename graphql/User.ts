import { extendType, nonNull, objectType, stringArg } from "nexus";

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

export const CreateUserMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createUser", {
            type: "User",
            args: {
                email: nonNull(stringArg()),
                name: stringArg(),
            },
            resolve: async (parent, args, context) =>  {
                const { name, email } = args

                const newUser = await context.prisma.user.create({
                    data: {
                        name,
                        email
                    },
                });

                return newUser;
            },
        });
    },
});