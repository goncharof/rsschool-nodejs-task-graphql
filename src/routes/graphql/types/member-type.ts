import { GraphQLEnumType, GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";

export const memberIdType = new GraphQLEnumType({
  name: "MemberTypeId",
  values: {
    BASIC: { value: 'basic' },
    BUSINESS: { value: 'business' },
  },
})

export const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { 
      type: memberIdType,
    },
    discount: { type: GraphQLInt },
    postsLimitPerMonth: { type: GraphQLInt },
  }
})

export const membersType = new GraphQLList(memberType)