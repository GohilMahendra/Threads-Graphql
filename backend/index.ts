import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { ApolloServer, gql , } from 'apollo-server-express';
import dotenv from 'dotenv';
import { signIn, updateUser } from './src/graphql/user/user.services';
import graphqlUploadExpressfrom from "graphql-upload/graphqlUploadExpress.mjs";
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const typeDefs = gql`
  scalar Upload

  type User {
    _id: ID!
    username: String!
    fullname: String!
    email: String!
    bio: String
    password: String!
    followers: Int!
    following: Int!
    profile_picture: String
    verified: Boolean!
    token: String
    otp: String
    isFollowed: Boolean!
  }
  type Query {
    GetUser: String
  }
  type Mutation {
    SignIn(input: LoginInput!): User
    UpdateUser(input:UpdateUserInput!): User
  }

  input UpdateUserInput 
  {
    bio: String
    fullName: String
    profile_picture: Upload
  }

  input LoginInput
  {
    email: String!
    password: String!
  }
`;

const resolvers = {
  Query: {
    GetUser: () => {
      return ""
    }
  },
  Mutation: {
    SignIn: async (parent: any, { input }: { input: { email: string; password: string } }) => {
      try {
        const user = await signIn(input);
        return user;
      } catch (error: any) {
        throw new Error(error?.message);
      }
    },
    UpdateUser: async (parent: any, { input }: {
      input:
      {
        bio?: string,
        fullName?: string,
        profile_picture?: any
      }
    }, context: any) => {
      try {
        const userId = context.userId
        console.log(userId)

        console.log(input.profile_picture)
        // const updatedUser = await updateUser({
        //   userId: userId,
        //   bio: input.bio,
        //   fullName: input.fullName,
        // //  profile_picture: input.profile_picture
        // })
        // return updatedUser
      }
      catch (error: any) {
        console.log(error)
        throw new Error(error?.message);
      }
    }
  }
}
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || '');
    const apolloServer = new ApolloServer({
      typeDefs: typeDefs,
      resolvers: resolvers,
      introspection: true,
      context: async ({ req }) => {
        const operationName = req.body.operationName
        if (operationName == "SignIn" || operationName == "SignUp" || operationName == "Verify") {
          return {}
        }
        // const token = req.header("token");
        // if (!token) {
        //   throw new Error("No token found");
        // }
        // try {
        //   const decodedToken = verifyToken(token);
        //   const userId = decodedToken.userId;
        //   return { userId };
        // } catch (error) {
        //   throw new Error("Invalid token");
        // }
      }
    });
    app.use(graphqlUploadExpress)
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql',});
   
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error during server startup:', error);
  }
};
startServer()