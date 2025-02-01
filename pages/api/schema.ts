// Define GraphQL schema

import { gql } from 'graphql-tag';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const typeDefs = gql`
  type Query {
    users: [User!]!
    movements: [Movement!]!
    reports: ReportData!
  }

  type ReportData {
    totalBalance: Float!
    movements: [Movement!]!
  }

  type Mutation {
    createMovement(concept: String!, amount: Float!, date: String!): Movement
    updateUser(id: ID!, name: String, role: Role): User
  }

  type Movement {
    id: ID!
    concept: String!
    amount: Float!
    date: String!
    user: User!
  }
  
  type User {
    id: ID!
    name: String
    email: String
    role: Role
  }

  enum Role {
    Admin
    User
  }
`;

// Define resolvers
export const resolvers = {
  Query: {
    movements: async (_, __, context) => {
            
      if (!context.user) {
        throw new Error('Authentication required');
      }

      return await prisma.movement.findMany({
        where: { userId: context.user.id },
        orderBy: { date: 'desc' },
        include:{
          user:true
        }
      });
    },
    reports: async (_, __, context) => {
      if (!context.user || context.user.role !== 'Admin') {
        throw new Error('Admin access required');
      }

      const movements = await prisma.movement.findMany({
        include: {
          user: true
        },
        orderBy: { date: 'desc' }
      });

      const totalBalance = movements.reduce((acc, mov) => acc + mov.amount, 0);

      return {
        totalBalance,
        movements
      };
    }
  },
  Movement: {
    user: async (parent) => {
      return await prisma.user.findUnique({
        where: { id: parent.userId }
      });
    }
  },
  
  
  Mutation: {
    createMovement: async (_, { concept, amount, date }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      const movementDate = new Date(date);
      if (isNaN(movementDate.getTime())) {
        throw new Error('Invalid date format');
      }

      const newMovement = await prisma.movement.create({
        data: {
          concept,
          amount: parseFloat(amount),
          date: movementDate,
          userId: context.user.id,
        },
        include: {
          user: true
        }
      });

      return newMovement;
    },
  },
};