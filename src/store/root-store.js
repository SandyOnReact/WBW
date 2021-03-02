import { types } from "mobx-state-tree"

const User = types.model({
    UserID: types.optional( types.string, "" ),
    AccessToken: types.optional( types.string, "" ),
    FirstName: types.optional(types.string, ""),
    LastName: types.optional(types.string, ""),
    FullName: types.optional(types.string, ""),
    EmailAddress: types.optional(types.string, ""),
    UserName: types.optional(types.string, ""),
    Password: types.optional(types.string, ""),
    LevelID: types.optional(types.string, ""),
    CompanyID: types.optional(types.string, ""),
    CompanyName: types.optional(types.string, ""),
    LevelName: types.optional(types.string, ""),
})
.views( self => ( {
    getUsers ( ) {
        return self.items;
    }
}))
.actions(self => {
    return {
        addUser( payload ) {
            if( payload.UserID !== self.UserID ) {
                self.todos.push(payload)
            }
        }
    }
})

export const RootStore = types
    .model({
        users: types.map( User ),
    })


