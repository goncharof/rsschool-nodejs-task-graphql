import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } from "graphql";
import { UUIDType } from "./uuid.js";

export const userType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLInt },
  },
})

export const usersType = new GraphQLList(userType)