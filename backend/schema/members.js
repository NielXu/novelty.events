module.exports = {
    query: {
        allMembers: '[Member]'
    },
    mutation: {

    },
    typeDef: `
        type Member {
            id: ID
            firstname: String
            lastname: String
            username: String
            password: String
            join: String
            email: String
            phone: String
            school: String
        }
    `,
    mutationResolver: {

    },
    queryResolver: {
        allMembers: (parent, args, context, info) => [
            {
                id: 'abc123',
                firstname: 'Daniel',
                lastname: 'Xu',
                username: 'niellxu',
                password: '123',
                join: '2019-10-01',
                email: 'novelty@gamil.com',
                phone: '6478888888',
                school: 'UTSC'
            }
        ]
    }
}