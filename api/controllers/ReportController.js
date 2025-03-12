const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  income: async (req, res) => {
    try {
      const { fromDate, toDate } = req.body;
      const members = await prisma.membership.findMany({
        where: {
          pay_date: {
            gte: fromDate,
            lte: toDate,
          },
        },
        include: {
          Member: true,
        },
      });

      const courseAndMembers = await prisma.courseAndMember.findMany({
        where: {
          createDate: {
            gte: fromDate,
            lte: toDate,
          },
        },
        include: {
          Course: true,
          Member: true,
        },
      });
      return res.send({ members: members, courseAndMembers: courseAndMembers });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  payBetween: async (req, res) => {
    try {
      const { fromDate, toDate } = req.body;
      const results = await prisma.payRecord.findMany({
        where: {
          payDate: {
            gte: fromDate,
            lte: toDate,
          },
        },
      });

      return res.send({ results: results });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
};
