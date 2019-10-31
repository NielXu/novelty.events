module.exports = {
    query: {
        allAdmins: '[Admin]',
        'getAdmin(id: ID!)': 'Admin'
    },
    mutation: {
        'addAdmin(input: AdminInput)': 'Admin'  
    },
    typeDef: `
        type Admin {
            id: ID!
            firstname: String!
            lastname: String!
            username: String!
            password: String!
            email: String!
            phone: String
            type: AdminType!
        }

        input AdminInput {
            firstname: String!
            lastname: String!
            username: String!
            password: String!
            email: String!
            phone: String
        }
    `,
    mutationResolver: {
        addAdmin: function(parent, args, context, info) {
            return {
                firstname: 'Daniel',
                lastname: 'Xu',
                username: 'niellxu',
                password: '123',
                email: 'novelty@gamil.com',
                type: 'SUPER'
            }
        },
    },
    queryResolver: {
        getAdmin: (parent, args, context, info) => {
            console.log(args);
            return {
                firstname: 'Daniel',
                lastname: 'Xu',
                username: 'niellxu',
                password: '123',
                email: 'novelty@gamil.com',
                type: 'SUPER'
            }
        },
        allAdmins: (parent, args, context, info) => [
            {
                id: 'abc123',
                firstname: 'Daniel',
                lastname: 'Xu',
                username: 'niellxu',
                password: '123',
                email: 'novelty@gamil.com',
                phone: '6478888888',
                type: 'SUPER'
            },
            {
                id: 'uqweaks122',
                firstname: 'Tester',
                lastname: 'T',
                username: 'tt',
                password: 'as22',
                email: 'mail@mail.com',
                phone: '9998888888',
                type: 'LOW'
            }
        ]
    }
}