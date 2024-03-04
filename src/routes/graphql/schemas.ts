import { Type } from '@fastify/type-provider-typebox';
import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { FastifyInstance } from 'fastify';
import { memberIdType, memberType, membersType } from './types/member-type.js';
import { ChangePostInput, CreatePostInput, postType, postsType } from './types/post.js';
import { CreateUserInput, ChangeUserInput, userType, usersType } from './types/user.js';
import { CreateProfileInput, ChangeProfileInput, profileType, profilesType } from './types/profile.js';
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
    },

    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (source, { id }: { id: string }, context: FastifyInstance) => {
        await context.prisma.post.delete({
          where: { id },
        });

        return null;
      }
    },

    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (source, { id }: { id: string }, context: FastifyInstance) => {
        await context.prisma.profile.delete({
          where: { id },
        });

        return null;
      }
    },

    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (source, { id }: { id: string }, context: FastifyInstance) => {
        await context.prisma.user.delete({
          where: { id },
        });

        return null;
      }
    },

    changePost: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) }
      },
      resolve: async (source, { id, dto }, context: FastifyInstance) => {
        return await context.prisma.post.update({
          where: { id },
          data: dto
        });
      }
    },

    changeProfile: {
      type: profileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) }
      },
      resolve: async (source, { id, dto }, context: FastifyInstance) => {
        return await context.prisma.profile.update({
          where: { id },
          data: dto
        });
      }
    },

    changeUser: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) }
      },
      resolve: async (source, { id, dto }, context: FastifyInstance) => {
        return await context.prisma.user.update({
          where: { id },
          data: dto
        });
      }
    },

    subscribeTo: {
      type: userType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { userId, authorId }, context: FastifyInstance) => {
        return context.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId: authorId,
              },
            },
          },
        });
      }
    },

    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { userId, authorId }, context: FastifyInstance) => {
        await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });

        return null;
      }
    }
  }
})
      
// Construct a schema, using GraphQL schema language
export const schema = new GraphQLSchema({
  query,
  mutation,
})