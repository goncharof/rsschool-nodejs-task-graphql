import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLInputObjectType, GraphQLFloat } from "graphql";
import { UUIDType } from "./uuid.js";
import { profileType } from "./profile.js";
import { FastifyInstance } from "fastify";
import { postType } from "./post.js";

export const userType = new GraphQLObjectType({
  name: 'UserType',
  fields:() => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profileType,
      resolve: async (user, args, context: FastifyInstance) => {
        return await context.prisma.profile.findUnique({
          where: { userId: user.id },
        });
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (user, args, context: FastifyInstance) => {
        return await context.prisma.post.findMany({
          where: { authorId: user.id },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userType), // userType is now used inside a thunk
      resolve: async (user, args, context: FastifyInstance) => {
        return context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: user.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userType), // userType is now used inside a thunk
      resolve: async (user, args, context: FastifyInstance) => {
        return context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: user.id,
              },
            },
          },
        });
      },
    },
  }),
})

export const usersType = new GraphQLList(userType)

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});