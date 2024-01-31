import { PrismaClient } from "../../prisma/generated/userClient";

const prisma = new PrismaClient();

const userResolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },

    user: async (_: any, { id }: { id: string }) => {
      return await prisma.user.findUnique({
        where: {
          id,
        },
      });
    },

    // Uncomment and modify the authenticateUser resolver as needed
    // authenticateUser: async (_: any, { email, password, company }: { email: string; password: string; company: string }) => {
    //   // Your implementation here
    // },
  },

  Mutation: {
    addUser: async (
      _: any,
      {
        email,
        phoneNumber,
        firstName,
        lastName,
        password,
        address,
        city,
        postalCode,
        country,
      }: {
        email: string;
        phoneNumber: string;
        firstName: string;
        lastName: string;
        password: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
      }
    ) => {
      try {
        const newUser = await prisma.user.create({
          data: {
            email,
            phoneNumber,
            firstName,
            lastName,
            password,
            address,
            city,
            postalCode,
            country,
          },
        });

        return newUser;
      } catch (error) {
        console.error("Error adding user:", error);
        throw new Error("Failed to add user");
      }
    },

    editUser: async (
      _: any,
      args: {
        id: string;
        email?: string;
        phoneNumber?: string;
        firstName?: string;
        lastName?: string;
        password?: string;
        address?: string;
      }
    ) => {
      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            id: args.id,
          },
        });

        if (!existingUser) {
          throw new Error(`User with id ${args.id} not found`);
        }

        const updatedUser = await prisma.user.update({
          where: { id: args.id },
          data: {
            email: args.email ?? existingUser.email,
            phoneNumber: args.phoneNumber ?? existingUser.phoneNumber,
            firstName: args.firstName ?? existingUser.firstName,
            lastName: args.lastName ?? existingUser.lastName,
            password: args.password ?? existingUser.password,
            address: args.address ?? existingUser.address,
          },
        });

        return updatedUser;
      } catch (error) {
        throw new Error(`Error updating user: ${(error as Error).message}`);
      }
    },

    deleteUser: async (_: any, { id }: { id: string }) => {
      try {
        const currentUser = await prisma.user.findUnique({
          where: { id },
        });

        if (!currentUser) {
          throw new Error(`User with ID ${id} not found`);
        }

        const deletedUser = await prisma.user.delete({
          where: { id },
        });

        return deletedUser;
      } catch (error) {
        throw new Error(`Error deleting user: ${(error as Error).message}`);
      }
    },
  },
};

export default userResolvers;
