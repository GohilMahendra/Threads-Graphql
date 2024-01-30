import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { ApolloServer ,ApolloError} from 'apollo-server-express';
import dotenv from 'dotenv';
import { graphqlUploadExpress } from "graphql-upload-ts";
import { UserContext, verifyToken } from './src/utilities/Context';
import { TypeDefs, Resolvers } from "./src/graphql";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || '');
    const apolloServer = new ApolloServer({
      typeDefs: TypeDefs,
      resolvers: Resolvers,
      introspection: true,
      context: async ({ req }):Promise<UserContext> => {
        const operationName = req.body.operationName
        if (operationName == "SignIn" || operationName == "SignUp" || operationName == "Verify") {
          return {userId:""}
        }
        const token = req.header("token") || "";
        const decodedToken = verifyToken(token);
        const userId = decodedToken.userId || "";
        return { userId };
      }
    });
    app.use(graphqlUploadExpress())
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql', cors: true });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error during server startup:', error);
  }
};
startServer()