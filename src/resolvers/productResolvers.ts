import { PrismaClient } from "../../prisma/generated/productClient";

import { createB2Service } from '../services/b2Service';  // Import the B2Service

const b2Service = createB2Service('B2_KEY_ID', 'B2_APPLICATION_KEY');



const prisma = new PrismaClient();

const productResolvers = {
  Query: {
    products: async () => await prisma.product.findMany(),
    product: async (_: any, { id }: { id: string }) =>
      await prisma.product.findUnique({ where: { id } }),
    activeProducts: async () =>
      await prisma.product.findMany({ where: { isActive: true } }),
    inactiveProducts: async () =>
      await prisma.product.findMany({ where: { isActive: false } }),
    orders: async () => await prisma.order.findMany(),
    order: async (_: any, { id }: { id: string }) =>
      await prisma.order.findUnique({ where: { id } }),
  },

  Mutation: {
    addProduct: async (_: any, args: any) => {
      try {
        // Extract image file from args
        const { imageFile, ...productData } = args;

        // Upload image to Backblaze B2
        const b2UploadResponse = await b2Service.uploadFile('stocksync', 'shopify/' + imageFile.filename, imageFile.createReadStream(), imageFile.mimetype);

        // Now use the obtained B2 URL as imageUrl in product creation
        const newProduct = await prisma.product.create({
          data: {
            ...productData,
            imageUrl: b2UploadResponse.url,
          },
        });

        return newProduct;
      } catch (error) {
        console.error('Error adding product:', error);
        throw new Error('Failed to add product');
      }
    },


    editProduct: async (_: any, args: any) => {
      try {
        const existingProduct = await prisma.product.findUnique({
          where: { id: args.id },
        });

        if (!existingProduct)
          throw new Error(`Product with id ${args.id} not found`);

        return await prisma.product.update({
          where: { id: args.id },
          data: {
            name: args.name ?? existingProduct.name,
            description: args.description ?? existingProduct.description,
            price: args.price ?? existingProduct.price,
            stock: args.stock ?? existingProduct.stock,
            category: args.category ?? existingProduct.category,
            manufacturer: args.manufacturer ?? existingProduct.manufacturer,
            imageUrl: args.imageUrl ?? existingProduct.imageUrl,
            isActive: args.isActive ?? existingProduct.isActive,
          },
        });
      } catch (error) {
        throw new Error(`Error updating product: ${(error as Error).message}`);
      }
    },

    deactivateProduct: async (_: any, { id }: { id: string }) => {
      try {
        const currentProduct = await prisma.product.findUnique({
          where: { id },
        });

        if (!currentProduct) throw new Error(`Product with ID ${id} not found`);

        return await prisma.product.update({
          where: { id },
          data: { isActive: !currentProduct.isActive },
        });
      } catch (error) {
        throw new Error(`Error updating product: ${(error as Error).message}`);
      }
    },

    deleteProduct: async (_: any, { id }: { id: string }) => {
      try {
        return await prisma.product.delete({ where: { id } });
      } catch (error) {
        throw new Error(`Error deleting product: ${(error as Error).message}`);
      }
    },

    createOrder: async (_: any, { productIds }: { productIds: string[] }) => {
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });
      const totalAmount = products.reduce(
        (total, product) => total + (product.price ?? 0),
        0
      );

      return await prisma.order.create({
        data: {
          products: {
            connect: products.map((product) => ({ id: product.id })),
          },
          totalAmount,
          status: "CREATED",
        },
      });
    },

    cancelOrder: async (_: any, { id }: { id: string }) => {
      return await prisma.order.update({
        where: { id },
        data: { status: "CANCELLED" },
      });
    },
  },
};

export default productResolvers;
