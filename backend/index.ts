import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { ApolloServer, gql, } from 'apollo-server-express';
import dotenv from 'dotenv';
import { signIn, updateUser } from './src/graphql/user/user.services';
import { graphqlUploadExpress } from "graphql-upload-ts";
import { verifyToken } from './src/utilities/Context';
import { bool } from 'aws-sdk/clients/signer';
import { createPost, getPosts } from './src/graphql/user/post.services';
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

  type OtherUser {
    _id: ID!
    username: String!
    fullname: String!
    email: String!
    bio: String
    followers: Int!
    following: Int!
    profile_picture: String
    verified: Boolean!
    isFollowed: Boolean!
  }

  type MediaType {
    media_type: String!
    media_url: String!
    thumbnail: String
  }

  type Post {
    _id: ID!
    user: OtherUser!
    content: String
    media: [MediaType!]
    hashtags: [String]
    likes: Int
    replies: Int
    isRepost: Boolean
    Repost: Post
    isLiked: Boolean
    created_at: String
    updated_at: String
  }

  type Meta {
    pagesize: Int,
    lastOffset: String
  }

  type PostResponse {
      data: [Post!]
      meta: Meta!
  }

  type Media {
    media_type: String!
    media_url: String!
    thumbnail: String
  }

  input PostInput {
    content:String,
    isRepost:Boolean,
    postId:String,
    media: [Upload]
  }

  input GetPostInput
  {
    lastOffset: String,
    pageSize: String,
    post_type: String
  }

  type SuccessResponse {
      message: String
  }

  type Query {
    GetUser: String,
    GetPosts(input:GetPostInput!): PostResponse
  }
  type Mutation {
    SignIn(input: LoginInput!): User
    UpdateUser(input:UpdateUserInput!): User
    CreatePost(input: PostInput!): SuccessResponse
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
    },
    GetPosts: async (parent: any, { input }: {
      input:
      {
        lastOffset?: string,
        pageSize?: number,
        post_type?: string
      }
    }, context: any) => {
      const userId = context.userId
      const { lastOffset, pageSize, post_type } = input
      const response = await getPosts({
        userId: userId,
        ...(lastOffset && { lastOffset }),
        ...(pageSize !== undefined && { pageSize }),
        ...(post_type && { post_type }),
      })
      return response
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
        const updatedUser = await updateUser({
          userId: userId,
          bio: input.bio,
          fullName: input.fullName,
          profile_picture: input.profile_picture
        })
        return updatedUser
      }
      catch (error: any) {
        console.log(error, "Error in the update")
        throw new Error(error?.message);
      }
    },
    CreatePost: async (parent: any, { input }: {
      input: {
        content: string,
        isRepost: boolean,
        postId: string,
        media: any[]
      }
    }, context: any) => {
      const userId = context.userId;
      const { content, isRepost, media, postId } = input
      const response = await createPost({
        isRepost: isRepost,
        userId: userId,
        content: content,
        postId: postId,
        media: media
      })

      return response
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
        const token = req.header("token");
        if (!token)
          return {}
        const decodedToken = verifyToken(token);
        const userId = decodedToken.userId;
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