import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: String
    firstName: String
    lastName: String
    age: Int
    email: String
    phoneNumber: String
    address: String
    city: String
    postalCode: String
    country: String
    orders: [Order]
    role: UserRole
  }

  type Order {
    id: String
    products: [Product]
    totalAmount: Float
    createdAt: String
    status: String
  }

  type Product {
    id: String
    name: String
    description: String
    price: Float
    stock: Int
    imageUrl: String
  }

  enum UserRole {
    SUPERADMIN
    ADMIN
    USER
  }

  type Query {
    users: [User]
    user(id: String!): User
    authenticateUser(email: String!, password: String!): User
    orders: [Order]
    order(id: String!): Order
    products: [Product]
    product(id: String!): Product
  }

  type Mutation {
    addUser(
      firstName: String
      lastName: String
      age: Int
      email: String
      phoneNumber: String
      password: String
      address: String
      city: String
      postalCode: String
      country: String
      role: UserRole
    ): User

    editUser(
      id: String!
      firstName: String
      lastName: String
      age: Int
      email: String
      password: String
      phoneNumber: String
      address: String
      city: String
      postalCode: String
      country: String
      role: UserRole
    ): User

    deleteUser(id: String!): User

    createOrder(productIds: [String!]): Order
    cancelOrder(id: String!): Order

    addProduct(
      name: String
      description: String
      price: Float
      stock: Int
      imageUrl: String
    ): Product

    editProduct(
      id: String!
      name: String
      description: String
      price: Float
      stock: Int
      imageUrl: String
    ): Product

    deleteProduct(id: String!): Product
  }
`;

export default typeDefs;
