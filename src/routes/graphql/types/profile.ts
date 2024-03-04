import { GraphQLObjectType, GraphQLBoolean, GraphQLInt, GraphQLList } from "graphql";
import { UUIDType } from "./uuid.js";
import { memberIdType, memberType } from "./member-type.js";
import { FastifyInstance } from "fastify";

export const profileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: memberIdType },
    memberType: {
      type: memberType,
      resolve: async (profile, args, context: FastifyInstance) => {
        return await context.prisma.memberType.findUnique({
          where: { id: profile.memberTypeId },
        });
      },
    },
  },
})

export const profilesType = new GraphQLList(profileType)