import { objectType } from "nexus";

import { User } from './User';

export const Profile = objectType({
    name: "Profile",
    definition(t) {
        t.nonNull.int("id");
        t.string("bio");
        t.nonNull.field("user", {
            type: User,
        });
    },
});