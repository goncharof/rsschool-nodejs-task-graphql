import { GraphQLEnumType, GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";

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

export const membersType = new GraphQLList(memberType)