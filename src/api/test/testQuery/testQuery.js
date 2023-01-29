export default {
  Query: {
    testQuery: async (_, args, { request, isAuthenticated }) => {
      // isAuthenticated(request);
      const { term } = args;
      console.log("term 전달:", term);
      return {
        result: true,
        term,
      };
    },
  },
};
