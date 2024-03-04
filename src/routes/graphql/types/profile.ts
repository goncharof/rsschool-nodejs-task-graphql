import { GraphQLObjectType, GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLInputObjectType, GraphQLNonNull } from "graphql";
import { UUIDType } from "./uuid.js";
import { memberIdType, memberType } from "./member-type.js";
import { FastifyInstance } from "fastify";
import DataLoader from "dataloader";
import { contextValue } from "../index.js";

export const profileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: memberIdType },
    memberType: {
      type: memberType,
      // resolve: async (profile, args, context: FastifyInstance) => {
      //   return await context.prisma.memberType.findUnique({
      //     where: { id: profile.memberTypeId },
      //   });
      // },

      resolve: async (profile, args, context: contextValue) => {
        const { dataloaders } = context;
        let dl = dataloaders.get('memberTypes');
        // console.log(dataloaders.get("memberTypes"));
        
        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const rows = await context.prisma.memberType.findMany({
              where: { id: { in: [...ids] } },
            });
            const sortedInIdsOrder = ids.map(id => rows.find(x => x.id === id));
            
            return sortedInIdsOrder;
          });
          dataloaders.set("memberTypes", dl);
        }
        return dl.load(profile.memberTypeId);
      }
    },
  },
})

export const profilesType = new GraphQLList(profileType)

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(memberIdType) },
  },
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: memberIdType },
  },
});