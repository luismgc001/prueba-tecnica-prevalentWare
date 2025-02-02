// Define GraphQL schema

import { gql } from 'graphql-tag';
import { prisma } from '@/lib/prisma';

export const typeDefs = gql`
  type Query {
  currentUser: User
    users: [User!]!
    movements(userId: ID): [Movement!]!
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
    currentUser: async (_, __, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return context.user;
    },
    users: async (_, __, context) => {
      if (!context.user || context.user.role !== 'Admin') {
        throw new Error('Admin access required');
      }
  
      return await prisma.user.findMany();
    },
    movements: async (_, { userId }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const where = {
        ...(userId ? { userId } : {}),
        ...(context.user.role !== 'Admin' ? { userId: context.user.id } : {})
      };

      return await prisma.movement.findMany({
        where,
        orderBy: { date: 'desc' },
        include: { user: true }
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
    updateUser: async (_, { id, name, role }, context) => {
      if (!context.user || context.user.role !== 'Admin') {
        throw new Error('Admin access required');
      }
  
      return await prisma.user.update({
        where: { id },
        data: { name, role }
      });
    },
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