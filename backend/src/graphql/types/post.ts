import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLList } from 'graphql';

const MediaType = new GraphQLObjectType({
  name: 'Media',
  fields: () => ({
    media_type: { type: GraphQLString },
    media_url: { type: GraphQLString },
    thumbnail: { type: GraphQLString },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    _id: { type: GraphQLString },
    user: { type: GraphQLString },
    content: { type: GraphQLString },
    media: { type: [MediaType] },
    hashtags: { type:[GraphQLString] },
    likes: { type: GraphQLInt },
    replies: { type: GraphQLInt },
    isRepost: { type: GraphQLBoolean },
    Repost: { type: PostType }, 
    isLiked: { type: GraphQLBoolean },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
  }),
});

export default PostType;
