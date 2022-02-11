// Imports start here
const express = require("express");
const PORT = 3000 | process.env.PORT;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { user, leaderboard, question } = require("./schema");
const req = require("express/lib/request");
const cors = require("cors");
// Imports end here

//Creating app
const app = express();
app.use(express.json());
app.use(cors());

// Db Connection starts here
main().catch((err) => console.error(err));

main().then((response) => console.debug("Db connected..."));

async function main() {
  await mongoose.connect(
    "mongodb+srv://satyam:1rMQizk1po0AWpzJ@cluster0.gdwts.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  );
}

// Db connection ends here

// Authentication APIs Start

app.get("/", (req, res) => {
  res.send("SERVER IS RUNNING.....");
});

app.post("/signup", async (req, res) => {
  let password = req.body.password;
  const hashed_password = bcrypt.hashSync(password, 10);
  let payload = {
    username: req.body.username,
    email: req.body.email,
    password: hashed_password,
  };
  let response = await user.create(payload);
  console.log("Response ", response);
  // let jwt_token = jwt.sign({ 'username': payload.username }, 'shhh');
  return res.status(201).json({
    message: "Success",
  });
});

app.post("/signin", async (req, res) => {
  let userData = await user.find({ email: req.body.email });
  let userEncryptedPassword = userData[0].password;
  let username = userData[0].username;
  let isPasswordCorrect = bcrypt.compareSync(
    req.body.password,
    userEncryptedPassword
  );
  if (isPasswordCorrect) {
    let token = jwt.sign({ username: username }, "shhh");
    return res.status(200).json({
      token: token,
    });
  } else {
    return res.status(401).json({
      message: "Failed to authenticate user",
    });
  }

  // bcrypt.compareSync(req.body.password,)
});
// Authentication APIs End

//Questions api start here

app.post(
  "/question",
  (req, res, next) => {
    try {
      console.log(req.headers.token);
      let data = jwt.verify(req.headers.token, "shhh");
      console.log(data);
      req.test = "hello";
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid access",
      });
    }
  },
  async (req, res) => {
    await question.create(req.body);
    res.status(200).json({
      message: "Success",
    });
  }
);

app.get(
  "/question",
  (req, res, next) => {
    try {
      console.log(req.headers.token);
      let data = jwt.verify(req.headers.token, "shhh");
      console.log(data);
      req.test = "hello";
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid access",
      });
    }
  },
  async (req, res) => {
    let questions = await question.find({});
    res.status(200).json(questions);
  }
);

app.post(
  "/submit",
  (req, res, next) => {
    try {
      console.log(req.headers.token);
      let data = jwt.verify(req.headers.token, "shhh");
      console.log(data);
      req.data = data;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid access",
      });
    }
  },
  async (req, res) => {
    let answers = req.body.answers;
    let questions = await question.find({});
    let count = 0;
    questions.map((value, index) => {
      if (value.correctAnswer === answers[index]) {
        count++;
      }
    });
    await leaderboard.create({ username: req.data.username, score: count });
    return res.status(200).json({
      score: count,
    });
  }
);

app.get("/leaderboards", async (req, res) => {
  let data = await leaderboard.find({});
  console.log(data);
  res.status(200).json(data);
});

//Questions api end here

app.listen(PORT, () => {
  console.debug("Running at port " + PORT);
});
