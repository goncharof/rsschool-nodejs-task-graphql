import { Type } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { FastifyInstance } from 'fastify';
import { membersType } from './types/member-type.js';
import { postsType } from './types/post.js';

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
    }
  },
})

// Construct a schema, using GraphQL schema language
export const schema = new GraphQLSchema({
  query,
  // mutation: rootMutation,
})