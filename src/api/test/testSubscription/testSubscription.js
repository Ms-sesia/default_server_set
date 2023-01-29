import pubsub from "../../../libs/pubsub";

export default {
  Subscription: {
    testSubscribe: {
      subscribe: () => pubsub.asyncIterator(["testSubs"]),
    },
  },
};
