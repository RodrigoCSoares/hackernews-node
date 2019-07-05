const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

function post(parent, args, context) {
    const userId = getUserId(context);
    return context.prisma.createLink({
        description: args.description,
        url: args.url,
        postedBy: { connect: { id: userId } },
    });
}

function updateLink(parent, args, context) {
    const userId = getUserId(context);
    return context.prisma.updateLink({
        data: { 
            url: args.url,
            description: args.description,
        },
        where: {
            id: args.id,
        }
    });
}

function deleteLink(parent, args, context) {
    const userId = getUserId(context);
    return context.prisma.deleteLink({ id: args.id });
}

async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10);
    const user = await context.prisma.createUser({ ...args, password });
    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    return {
        token,
        user,
    }; 
}

async function login(parent, args, context, info) {
    const user = await context.prisma.user({ email: args.email });
    if(!user) {
        throw new Error('No such user found');
    }

    const valid = await bcrypt.compare(args.password, user.password);
    if(!valid) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    };
}

module.exports = {
    post,
    updateLink,
    deleteLink,
    signup,
    login,
}