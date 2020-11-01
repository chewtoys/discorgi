const { withFilter } = require('apollo-server');
const { GraphQLDate } = require('graphql-iso-date');
const { CHANNEL_ADDED, MESSAGE_ADDED } = require('./constants');

module.exports = {
  Query: {
    userServers: (_, __, { dataSources }) =>
      dataSources.serverAPI.getUserServers(),
  },

  Subscription: {
    channelAdded: {
      subscribe: withFilter(
        (_, __, context) => context.pubsub.asyncIterator(CHANNEL_ADDED),
        (payload, variables) => {
          return payload.channelAdded.serverId === parseInt(variables.serverId);
        }
      ),
    },
    messageAdded: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(MESSAGE_ADDED),
        (payload, variables) => {
          return (
            payload.messageAdded.channelId === parseInt(variables.channelId)
          );
        }
      ),
    },
  },

  Mutation: {
    signupUser: (_, { data }, { dataSources }) =>
      dataSources.serverAPI.createUser({ data }),

    loginUser: (_, { data }, { dataSources }) =>
      dataSources.serverAPI.loginUser({ data }),

    createServer: (_, { serverName }, { dataSources }) =>
      dataSources.serverAPI.createServer({ serverName }),

    deleteServer: (_, { serverId }, { dataSources }) =>
      dataSources.serverAPI.deleteServer({ serverId }),

    addServer: (_, { serverId }, { dataSources }) =>
      dataSources.serverAPI.addServer({ serverId }),

    leaveServer: (_, { serverId }, { dataSources }) =>
      dataSources.serverAPI.leaveServer({ serverId }),

    createChannel: (_, { data }, { dataSources }) =>
      dataSources.serverAPI.createChannel({ data }),

    deleteChannel: (_, { data }, { dataSources }) =>
      dataSources.serverAPI.deleteChannel({ data }),

    createMessage: (_, { data }, { dataSources }) =>
      dataSources.serverAPI.createMessage({ data }),
  },

  Server: {
    channels: (server, _, { dataSources }) =>
      dataSources.serverAPI.getServerChannels({ serverId: server.id }) || [],
    users: (server, _, { dataSources }) =>
      dataSources.serverAPI.getServerUsers({ serverId: server.id }) || [],
  },

  DateTime: GraphQLDate,
};
