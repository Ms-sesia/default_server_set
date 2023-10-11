import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  Mutation: {
    testCreate: async (_, args, { request, __ }) => {
      const { userName, userPhoneNumber } = args;
      try {
        const createUser = await prisma.$executeRaw`
          INSERT INTO user (user_name, user_phoneNumber)
          VALUES (
            AES_ENCRYPT(${userName}, ${process.env.AES_KEY}),
            AES_ENCRYPT(${userPhoneNumber}, ${process.env.AES_KEY})
          )
        `;

        console.log(createUser);

        return true;
      } catch (e) {
        console.log("마스터 관리자 아이디 생성 에러. createMasterAdmin ==>\n", e);
      }
    },
    testSearch: async (_, args, { request, __ }) => {
      const { term } = args;
      try {
        const findUser = await prisma.$queryRawUnsafe(
          `
        SELECT
          cast(AES_DECRYPT(user_name, ?) AS CHAR) as user_name,
          cast(AES_DECRYPT(user_phoneNumber, ?) as char) as user_phoneNumber
        FROM user
        WHERE cast(AES_DECRYPT(user_name, ?) as char) LIKE ?
        ORDER BY user_name DESC
        `,
          process.env.AES_KEY,
          process.env.AES_KEY,
          process.env.AES_KEY,
          `%${term}%`
        );

        console.log(findUser);

        return true;
      } catch (e) {
        console.log("마스터 관리자 아이디 생성 에러. createMasterAdmin ==>\n", e);
      }
    },
  },
};
