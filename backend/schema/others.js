module.exports = {
    query: {},
    mutation: {},
    typeDef: `
        enum AdminType {
            SUPER
            NORMAL
            LOW
        }

        enum School {
            UTSC
            UTM
            UTSG
            Ryerson
            York
        }

        enum EventLevel {
            adminOnly
            memberOnly
            adminAndMember
            unlimited
        }
    `,
    mutationResolver: {},
    queryResolver: {}
}