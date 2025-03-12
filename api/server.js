const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const userController = require("./controllers/userController");
const memberController = require("./controllers/MemberController");
const checkInController = require("./controllers/CheckInController");
const deviceController = require("./controllers/DeviceController");
const employeeAndTrainer = require("./controllers/EmployeeAndTrainerController");
const courseController = require("./controllers/CourseController");
const courseAndtrainer = require("./controllers/CourseAndTrainerController");
const courseAndMemberController = require("./controllers/CourseAndMemberController");
const payRecordController = require("./controllers/PayRecordController");
const reportController = require("./controllers/ReportController");

const checkLogin = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    const jwt = require("jsonwebtoken");
    const dotenv = require("dotenv");
    dotenv.config();

    const key = process.env.SECRET_KEY;
    jwt.verify(token, key);

    next();
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/public", express.static("public"));

//-----user-----//
app.post("/api/user/SignIn", (req, res) => userController.signIn(req, res));
app.get("/api/user/info", (req, res) => userController.info(req, res));
app.post("/api/user/changeProfile", (req, res) =>
  userController.changeProfile(req, res)
);

//-----member-----//
app.post("/api/member/create", (req, res) => memberController.create(req, res));
app.get("/api/member/list", (req, res) => memberController.list(req, res));
app.delete("/api/member/remove/:id", (req, res) =>
  memberController.remove(req, res)
);
app.put("/api/member/update/:id", (req, res) =>
  memberController.update(req, res)
);
app.post("/api/member/membership", (req, res) =>
  memberController.membership(req, res)
);
app.get("/api/member/membershipList/:member_id", (req, res) =>
  memberController.membershipList(req, res)
);
app.delete("/api/member/removeHistory/:id", (req, res) =>
  memberController.removeHistory(req, res)
);
app.post("/api/member/membershipUpdate/:id", (req, res) =>
  memberController.membershipUpdate(req, res)
);

//-----checkin-----//
app.post("/api/checkin/create", (req, res) =>
  checkInController.create(req, res)
);
app.get("/api/checkin/list", (req, res) => checkInController.list(req, res));
app.delete("/api/checkin/remove/:id", (req, res) =>
  checkInController.remove(req, res)
);

//-----device-----//
app.post("/api/device/create", (req, res) => deviceController.create(req, res));
app.get("/api/device/list", (req, res) => deviceController.list(req, res));
app.delete("/api/device/remove/:id", (req, res) =>
  deviceController.remove(req, res)
);
app.put("/api/device/update/:id", (req, res) =>
  deviceController.update(req, res)
);

//-----employeeAndTrainer-----//
app.post("/api/employeeAndTrainer/create", (req, res) =>
  employeeAndTrainer.create(req, res)
);
app.get("/api/employeeAndTrainer/list", (req, res) =>
  employeeAndTrainer.list(req, res)
);
app.put("/api/employeeAndTrainer/remove/:id", (req, res) =>
  employeeAndTrainer.remove(req, res)
);
app.put("/api/employeeAndTrainer/update/:id", (req, res) =>
  employeeAndTrainer.update(req, res)
);
app.post("/api/employeeAndTrainer/filter", (req, res) =>
  employeeAndTrainer.filter(req, res)
);

//-----course-----//
app.post("/api/course/create", (req, res) => courseController.create(req, res));
app.get("/api/course/list", (req, res) => courseController.list(req, res));
app.put("/api/course/remove/:id", (req, res) =>
  courseController.remove(req, res)
);
app.put("/api/course/update/:id", (req, res) =>
  courseController.update(req, res)
);

//-----courseAndTrainer-----//

app.post("/api/courseAndTrainer/create", (req, res) =>
  courseAndtrainer.create(req, res)
);

//-----courseAndMember-----//
app.post("/api/courseAndMember/create", (req, res) =>
  courseAndMemberController.create(req, res)
);
app.get("/api/courseAndMember/list/:id", (req, res) =>
  courseAndMemberController.list(req, res)
);
app.delete("/api/courseAndMember/remove/:id", (req, res) =>
  courseAndMemberController.remove(req, res)
);
app.get("/api/courseAndMember/printInvoice/:id", (req, res) =>
  courseAndMemberController.printInvoice(req, res)
);

//-----payRecord-----//
app.post("/api/payRecord/create", (req, res) =>
  payRecordController.create(req, res)
);
app.get("/api/payRecord/list", (req, res, next) =>
  payRecordController.list(req, res)
);
app.delete("/api/payRecord/remove/:id", (req, res) =>
  payRecordController.remove(req, res)
);
app.put("/api/payRecord/update", (req, res) =>
  payRecordController.update(req, res)
);

//-----Report-----//
app.post("/api/reportProfit/income", (req, res) =>
  reportController.income(req, res)
);
app.post("/api/reportProfit/payBetween", (req, res) =>
  reportController.payBetween(req, res)
);
app.listen(3000, () => {
  console.log("Start SERVER");
});
