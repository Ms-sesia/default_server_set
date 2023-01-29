import pubsub from "../../../libs/pubsub";

export default {
  Mutation: {
    testMutation: async (_, args, { request, isAuthenticated }) => {
      // isAuthenticated(request);
      const { term } = args;

      console.log("pub 전:", pubsub);

      pubsub.publish("testSubs", { testSubscribe: term });
      console.log("pub 후:", pubsub);
      return {
        result: true,
        term,
      };
    },
  },
};
