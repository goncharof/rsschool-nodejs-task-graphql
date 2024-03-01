import { GraphQLObjectType, GraphQLBoolean, GraphQLInt, GraphQLList } from "graphql";
import { UUIDType } from "./uuid.js";
import { memberIdType } from "./member-type.js";

export const profileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: memberIdType },
  },
})

export const profilesType = new GraphQLList(profileType)