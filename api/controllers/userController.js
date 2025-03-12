const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const key = "setcret Key";

module.exports = {
  signIn: async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;

      if (username == "" || password == "") {
        return res.status(401).send("unauthorized");
      }

      const user = await prisma.user.findFirst({
        select: {
          id: true,
          name: true,
          level: true,
        },
        where: {
          username: username,
          password: password,
          status: "use",
        },
      });

      if (!user) {
        const employee = await prisma.employeeAndTrainer.findFirst({
          select: {
            id: true,
            name: true,
            level: true,
          },
          where: { username: username, password: password, level: "employee" },
        });

        if (employee != null) {
          const tokenEmp = jwt.sign(employee, key, { expiresIn: "1d" });
          return res.send({
            token: tokenEmp,
            name: employee.name,
            level: employee.level,
          });
        }
        return res.status(401).send("unauthorized");
      }

      const token = jwt.sign(user, key, { expiresIn: "30d" });
      return res.send({ token: token, name: user.name, level: user.level });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  info: async (req, res) => {
    try {
      const payload = jwt.decode(req.headers.authorization, key);
      return res.send(payload);
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  changeProfile: async (req, res) => {
    try {
      const token = req.headers["authorization"];
      const payload = jwt.decode(token, key);

      const id = payload.id;

      const row = await prisma.employeeAndTrainer.findFirst({
        where: {
          id: id,
        },
      });

      let username = row.username;
      let password = row.password;

      if (req.body.username != "") {
        username = req.body.username;
      }
      if (req.body.password != "") {
        password = req.body.password;
      }

      await prisma.employeeAndTrainer.update({
        data: {
          username: username,
          password: password,
        },
        where: {
          id: id,
        },
      });

      return res.send({ message: 'success' });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
};
