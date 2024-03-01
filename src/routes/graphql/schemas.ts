import { Type } from '@fastify/type-provider-typebox';
import { GraphQLEnumType, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { FastifyInstance } from 'fastify';

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

// const rootMutation = new GraphQLObjectType({
//   name: 'mutation',
//   fields: {},
// })

const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { 
      type: new GraphQLEnumType({
        name: "MemberTypeId",
        values: {
          BASIC: { value: 'basic' },
          BUSINESS: { value: 'business' },
        },
      }) 
    },
    discount: { type: GraphQLInt },
    postsLimitPerMonth: { type: GraphQLInt },
  }
})

const rootQuery = new GraphQLObjectType({
  name: 'query',
  fields: {
    memberTypes: {
      type: new GraphQLList(memberType),
      resolve: (source, args, context: FastifyInstance) => {
        return context.prisma.memberType.findMany();
      }
    }
  },
})

// Construct a schema, using GraphQL schema language
export const schema = new GraphQLSchema({
  query: rootQuery,
  // mutation: rootMutation,
})