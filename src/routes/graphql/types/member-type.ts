import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import { MemberTypeId } from "../../member-types/schemas.js";

export const memberIdType = new GraphQLEnumType({
  name: "MemberTypeId",
  values: {
    [MemberTypeId.BASIC]: { value: MemberTypeId.BASIC },
    [MemberTypeId.BUSINESS]: { value: MemberTypeId.BUSINESS },
  },
})

export const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { 
      type: memberIdType,
    },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }
})

export const membersType = new GraphQLList(memberType)