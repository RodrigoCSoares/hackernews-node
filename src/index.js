const { GraphQLServer } = require('graphql-yoga');

let links = [{
    id: 'link-0',
    url: 'www.url.com',
    description: 'description'
}];

let idCount = links.length
const resolvers = {
    Query: {
        info: () => 'This is the API of a Hackernews Clone',
        feed: () => links,
        link: (parent, args) => links.find(link => link.id == args.id)
    },

    Mutation: {
        post: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url
            };
            links.push(link);
            return link;
        },

        updateLink: (parent, args) => {
            for(let i in links) {
                if(links[i].id == args.id) {
                    links[i].url = args.url;
                    links[i].description = args.description;
                    return links[i];
                }
            }
            return null;
        },

        deleteLink: (parent, args) => {
            for(let i in links) {
                if(links[i].id == args.id) {
                    return links.splice(i, 1)[0];
                }
            }
        }
    }
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
});

server.start(() => console.log('Server is running on http://localhost:4000'));