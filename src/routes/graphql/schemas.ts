import { Type } from '@fastify/type-provider-typebox';
import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { FastifyInstance } from 'fastify';
import { memberIdType, memberType, membersType } from './types/member-type.js';
import { CreatePostInput, postType, postsType } from './types/post.js';
import { CreateUserInput, userType, usersType } from './types/user.js';
import { CreateProfileInput, profileType, profilesType } from './types/profile.js';
import { MemberTypeId } from '../member-types/schemas.js';
import { UUIDType } from './types/uuid.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const query = new GraphQLObjectType({
  name: 'query',
  fields: {
    memberTypes: {
      type: membersType,
      resolve: (source, args, context: FastifyInstance) => {
        return context.prisma.memberType.findMany();
      }
    },
    posts: {
      type: postsType,
      resolve: (source, args, context: FastifyInstance) => {
        return context.prisma.post.findMany();
      }
    },

    users: {
      type: usersType,
      resolve: (source, args, context: FastifyInstance) => {
        return context.prisma.user.findMany();
      }
    },

    profiles: {
      type: profilesType,
      resolve: (source, args, context: FastifyInstance) => {
        return context.prisma.profile.findMany();
      }
    },

    memberType: {
      type: memberType,
      args: {
        id: {
          type: new GraphQLNonNull(memberIdType),
        },
      },
      resolve: async (source, { id }: { id: MemberTypeId }, context: FastifyInstance) => {
        return await context.prisma.memberType.findUnique({
          where: { id },
        });
        // if (memberType === null) {
        //   throw httpErrors.notFound();
        // }
        // return memberType;
      }
    },

    post: {
      type: postType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (source, { id }: { id: string }, context: FastifyInstance) => {
        return await context.prisma.post.findUnique({
          where: { id },
        });
      }
    },

    user: {
      type: userType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (source, { id }: { id: string }, context: FastifyInstance) => {
        return await context.prisma.user.findUnique({
          where: { id },
        });
      }
    },

    profile: {
      type: profileType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (source, { id }: { id: string }, context: FastifyInstance) => {
        return await context.prisma.profile.findUnique({
          where: { id },
        });
      }
    }
  },
})

const mutation = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    createPost: {
      type: postType,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (source, { dto }, context: FastifyInstance) => {
        return await context.prisma.post.create({
          data: dto,
        });
      }
    },

    createUser: {
      type: userType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (source, { dto }, context: FastifyInstance) => {
        return await context.prisma.user.create({
          data: dto,
        });
      }
    },

    createProfile: {
      type: profileType,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (source, { dto }, context: FastifyInstance) => {
        return await context.prisma.profile.create({
          data: dto,
        });
      }
    }
  }
})
      
// Construct a schema, using GraphQL schema language
export const schema = new GraphQLSchema({
  query,
  mutation,
})