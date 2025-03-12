const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const PDFDocument = require("pdfkit");
const fs = require("fs");

module.exports = {
  create: async (req, res) => {
    try {
      const course = await prisma.course.findFirst({
        where: {
          id: req.body.courseId,
        },
      });

      await prisma.courseAndMember.create({
        data: {
          course_id: req.body.courseId,
          member_id: req.body.memberId,
          qty: parseInt(req.body.qty),
          createDate: new Date(req.body.createDate),
          expireDate: new Date(req.body.expireDate),
          remark: req.body.remark ?? "",
          price: course.price,
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  list: async (req, res) => {
    try {
      const results = await prisma.courseAndMember.findMany({
        include: {
          Member: true,
        },
        where: {
          course_id: parseInt(req.params.id),
        },
      });

      return res.send({ results: results });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  remove: async (req, res) => {
    try {
      await prisma.courseAndMember.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  printInvoice: async (req, res) => {
    try {
      const doc = new PDFDocument();
      const results = await prisma.courseAndMember.findFirst({
        include: {
          Member: true,
          Course: true,
        },
        where: {
          id: parseInt(req.params.id),
        },
      });

      doc.pipe(fs.createWriteStream("public/inv-" + results.id + ".pdf"));

      //--Draw Invoice--//

      doc.font("./Sarabun/Sarabun-Medium.ttf");
      doc.fontSize(25).text("Invoice");

      doc.fontSize(15);
      doc.text("Customer " + results.Member.name);
      doc.text("Tel. " + results.Member.phone);

      doc.text("Programe", 71, 150);
      doc.text("qty", 290, 150, { width: 100, align: "right" });
      doc.text("price", 370, 150, { width: 100, align: "right" });
      doc.text("Total", 450, 150, { width: 100, align: "right" });

      doc.text(results.Course.name, 71, 175);
      doc.text(results.qty, 290, 175, { width: 100, align: "right" });
      doc.text(results.Course.price.toLocaleString("th-TH"), 370, 175, {
        width: 100,
        align: "right",
      });

      const amount = results.qty * results.Course.price;
      doc.text(amount.toLocaleString("th-TH"), 450, 175, {
        width: 100,
        align: "right",
      });

      doc.moveTo(71, 150).lineTo(550, 150).stroke();
      doc.moveTo(71, 172).lineTo(550, 172).stroke();

      doc.moveTo(500, 195).lineTo(550, 195).stroke();
      doc.moveTo(500, 197).lineTo(550, 197).stroke();

      doc.end();

      return res.send({ fileName: "inv-" + results.id + ".pdf" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
};
