import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, validate, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit'
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';

const validationErrors = (query: string) => {
  const ast = parse(query);
  // console.log(validate(schema, ast, [depthLimit(5)])[0]?.message, 'validationErrors');
  return validate(schema, ast, [ depthLimit(5) ]);
}

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      const errors = validationErrors(query);

      if (errors.length > 0) {
        return {
          data: null,
          errors,
        };
      }

      return graphql({ schema, source: query, variableValues: variables, contextValue: fastify });
    },
  });
};

export default plugin;
