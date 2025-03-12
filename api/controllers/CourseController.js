const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  create: async (req, res) => {
    try {
      await prisma.course.create({
        data: {
          name: req.body.name,
          price: parseInt(req.body.price),
          detail: req.body.detail ?? "",
          remark: req.body.remark ?? "",
          dayPerWeek: parseInt(req.body.dayPerWeek),
          hourPerDay: parseInt(req.body.hourPerDay),
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  list: async (req, res) => {
    try {
      const results = await prisma.course.findMany({
        include: {
          CourseAndTrainer: {
            include: {
              Trainer: true,
            },
          },
        },
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
      await prisma.course.update({
        data: {
          status: "delete",
        },
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
      await prisma.course.update({
        data: {
          name: req.body.name,
          price: parseInt(req.body.price),
          detail: req.body.detail ?? "",
          remark: req.body.remark ?? "",
          dayPerWeek: parseInt(req.body.dayPerWeek),
          hourPerDay: parseInt(req.body.hourPerDay),
        },
        where: {
          id: parseInt(req.params.id),
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
};
