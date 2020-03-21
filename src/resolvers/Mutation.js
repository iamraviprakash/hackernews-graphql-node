const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

// SignUp
async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10);
    const user = await context.prisma.createUser({ ...args, password });
    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user
    }
}

// Login
async function login(parent, args, context, info) {
    const user = await context.prisma.user({ email: args.email })
    if(!user) {
        throw new Error('No such user found');
    }

    const valid = await bcrypt.compare(args.password, user.password);
    if(!valid) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ userid: user.id }, APP_SECRET);

    return {
        token,
        user
    }
}

// UpdateLink
async function updateLink(parent, args, context, info) {
    const link = await context.prisma.link({ id: args.id })
    if(!link) {
        throw new Error('No link found')
    }
}

// DeleteLink
async function deleteLink(parent, args, context, info) {
    const link = await context.prisma.link({ id: args.id })
    if(!link) {
        throw new Error('No link found');
    }
}

// Post
function post(parent, args, context, info) {
    const userId = getUserId(context);
    return context.prisma.createLink({
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } }
    });
}

async function vote(parent, args, context, info) {
    const userId = getUserId(context);

    const voteExists = await context.prisma.$exists.vote({
        user: { id: userId },
        link: { id: args.linkId }
    });

    if(voteExists) {
        throw new Error(`Already voted for link: ${args.linkId}`);
    }

    return context.prisma.createVote({
        user: { connect: { id: userId } },
        link: { connect: { id: args.linkId } }
    })
}


module.exports = {
    signup,
    login,
    post,
    updateLink,
    deleteLink,
    vote
}
