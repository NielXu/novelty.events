module.exports = {
    query: {
        allAdmins: '[Admin]'
    },
    typeDef: `
        type Admin {
            id: ID
            firstname: String
            lastname: String
            username: String
            password: String
            email: String
            phone: String
            type: String
        }
    `,
    resolver: {
        allAdmins: () => [
            {
                id: 'abc123',
                firstname: 'Daniel',
                lastname: 'Xu',
                username: 'niellxu',
                password: '123',
                email: 'novelty@gamil.com',
                phone: '6478888888',
                type: 'Super'
            }
        ]
    }
}