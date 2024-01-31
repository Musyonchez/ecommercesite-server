import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Product {
    id: String
    name: String
    description: String
    price: Float
    stock: Int
    category: String
    manufacturer: String
    imageUrl: String
    isActive: Boolean
  }

  type Order {
    id: String
    products: [Product]
    totalAmount: Float
    createdAt: String
    status: String
  }

  type Query {
    products: [Product]
    product(id: String!): Product
    activeProducts: [Product]
    inactiveProducts: [Product]
    orders: [Order]
    order(id: String!): Order
  }

  type Mutation {
    addProduct(
      name: String
      description: String
      price: Float
      stock: Int
      category: String
      manufacturer: String
      imageUrl: String
      isActive: Boolean
    ): Product

    editProduct(
      id: String!
      name: String
      description: String
      price: Float
      stock: Int
      category: String
      manufacturer: String
      imageUrl: String
      isActive: Boolean
    ): Product

    deleteProduct(id: String!): Product

    deactivateProduct(id: String!): Product

    createOrder(productIds: [String!]): Order
    cancelOrder(id: String!): Order
  }
`;

export default typeDefs;
