import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInputObjectType, GraphQLFloat } from "graphql";
import DataLoader from 'dataloader';
import { UUIDType } from "./uuid.js";
import { profileType } from "./profile.js";
import { postType } from "./post.js";
import { contextValue } from "../index.js";

interface User {
  id: string;
  name: string;
  balance: number;
}

export const userType = new GraphQLObjectType({
  name: 'UserType',
  fields:() => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profileType,
      // resolve: async (user: User, args, context: FastifyInstance) => {
      //   return await context.prisma.profile.findUnique({
      //     where: { userId: user.id },
      //   });
      // },

      resolve: async (user, args, context) => {
        const { dataloaders } = context;
        let dl = dataloaders.get('profiles');
        // console.log(dataloaders.get("profiles"));
        
        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const rows = await context.prisma.profile.findMany({
              where: { userId: { in: ids } },
            });
            const sortedInIdsOrder = ids.map(id => rows.find((x: { userId: string }) => x.userId === id));
            
            return sortedInIdsOrder;
          });
          dataloaders.set("profiles", dl);
        }
        return dl.load(user.id, "profiles");
      }
    },
    posts: {
      type: new GraphQLList(postType),
      // resolve: async (user, args, context: FastifyInstance) => {
      //   return await context.prisma.post.findMany({
      //     where: { authorId: user.id },
      //   });
      // },

      resolve: async (user, args, context: contextValue) => {
        const { dataloaders } = context;
        let dl = dataloaders.get('posts');
        
        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const rows = await context.prisma.post.findMany({
              where: { authorId: { in: [...ids] } },
            });
            
            const sortedInIdsOrder = ids.map(id => rows.filter((x: { authorId: string }) => x.authorId === id));

            return sortedInIdsOrder;
          });
          dataloaders.set("posts", dl);
        }

        return dl.load(user.id);
      }
    },

    userSubscribedTo: {
      type: new GraphQLList(userType), // userType is now used inside a thunk
      // resolve: async (user, args, context: FastifyInstance) => {
        // return context.prisma.user.findMany({
        //   where: {
        //     subscribedToUser: {
        //       some: {
        //         subscriberId: user.id,
        //       },
        //     },
        //   },
        // });
      // },

      resolve: async (user, args, context:contextValue) => {
        const { dataloaders } = context;
        let dl = dataloaders.get('userSubscribedTo');
        
        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const rows = await context.prisma.user.findMany({
              where: { subscribedToUser: { some: { subscriberId: { in: [...ids] } } } },
              include: { subscribedToUser: true }
            });

            const sortedInIdsOrder = ids.map((id: string) => rows.filter(x => {
              return x.subscribedToUser.some((y: { subscriberId: string }) => y.subscriberId === id)
            }));

            return sortedInIdsOrder;
          });
          dataloaders.set("userSubscribedTo", dl);
        }
        return dl.load(user.id);
      }
    },
    subscribedToUser: {
      type: new GraphQLList(userType), // userType is now used inside a thunk
      // resolve: async (user, args, context: FastifyInstance) => {
      //   return context.prisma.user.findMany({
      //     where: {
      //       userSubscribedTo: {
      //         some: {
      //           authorId: user.id,
      //         },
      //       },
      //     },
      //   });
      // },

      resolve: async (user, args, context: contextValue) => {
        const { dataloaders } = context;
        let dl = dataloaders.get('subscribedToUser');
        
        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const rows = await context.prisma.user.findMany({
              where: { userSubscribedTo: { some: { authorId: { in: [...ids] } } } },
              include: { userSubscribedTo: true, }
            });
            const sortedInIdsOrder = ids.map(id => rows.filter((x: { userSubscribedTo: { authorId: string }[] }) => {
              return x.userSubscribedTo.some(y => y.authorId === id)
            }));

            return sortedInIdsOrder;
          });
          dataloaders.set("subscribedToUser", dl);
        }
        return dl.load(user.id);
      }
    },
  }),
})

export const usersType = new GraphQLList(userType)

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});