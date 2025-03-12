const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  create: async (req, res) => {
    try {
      const { name, qty, price, payDate, remark } = req.body;

      await prisma.payRecord.create({
        data: {
          name,
          qty,
          price,
          payDate,
          remark,
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  list: async (req, res) => {
    try {
      const results = await prisma.payRecord.findMany({
        orderBy: {
          id: "desc",
        },
      });
      return res.send({ results: results });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  remove: async (req, res) => {
    try {
      await prisma.payRecord.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  update: async (req, res) => {
    try {
      const { name, qty, price, payDate, remark, id } = req.body;
      await prisma.payRecord.update({
        data: {
          name,
          qty,
          price,
          payDate,
          remark,
        },
        where: {
          id: id,
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
};
