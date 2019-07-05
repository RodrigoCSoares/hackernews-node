const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

const resolvers = {
    Query: {
        info: () => 'This is the API of a Hackernews Clone',
        feed: (root, args, context, info) => {
            return context.prisma.links();
        },
        link: (root, args, context, info) => {
            return context.prisma.link({ id: args.id});
        }
    },

    Mutation: {
        post: (root, args, context) => {
            return context.prisma.createLink({
                description: args.description,
                url: args.url
            });
        },

        updateLink: (root, args, context) => {
            return context.prisma.updateLink({
                data: { 
                    url: args.url,
                    description: args.description,
                },
                where: {
                    id: args.id,
                }
            });
        },

        deleteLink: (root, args, context) => {
            return context.prisma.deleteLink({ id: args.id });
        }
    }
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: { prisma },
});

server.start(() => console.log('Server is running on http://localhost:4000'));