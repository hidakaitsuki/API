const express = require("express");
// 同一生成元でないところへの要求を安全に許可する仕組み
const cors = require("cors");
const app = express();
// 「body-parser」の代わり
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// mongoDBを操作する「mongoose」をインポート
const mongoose = require("mongoose");

// process.env.PORT・・・環境変数（デプロイしたときに自動的に割り当てられるサーバー名）
// ローカルのときは3000番（http://localhost:3000）
const port = process.env.PORT || "3000";
app.listen(port, () => {
  console.log(`${port}番のサーバーが立ち上がりました`);
});

// mongoDBのログイン情報取得
// const logininfo = require("./keys.js");

// mongoDBに接続
mongoose.connect(
  `mongodb+srv://${logininfo.key1}:${logininfo.key2}@cluster0.bwr5d.mongodb.net/login?retryWrites=true&w=majority`,
  () => {
    console.log("mongoDBに接続しました");
  }
);

// スキーマの定義
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  pass: String,
});

// userSchema型のデータを"users"に入れる
const Usermodel = mongoose.model("users", userSchema);

//管理者登録
app.post("/register", async function (req, res) {
  // アドレスが既に登録済みかどうか確認
  Usermodel.find({ email: req.body.email }, function (err, result) {
    //   既に存在する場合
    if (result.length !== 0) {
      res.send({
        data: req.body,
        message: "そのメールアドレスはすでに登録済みです。",
        status: "error",
      });
      //   メールアドレスが存在しない場合
    } else {
      //   新しく入れるuserオブジェクト作成
      const user = new Usermodel();
      user.email = req.body.email;
      user.name = req.body.name;
      user.pass = req.body.pass;
      res.send({ data: req.body, status: "success" });
      user.save();
    }
  });
});
// ログイン
app.post("/login", async function (req, res) {
  //   userコレクションに送信するemailとpassの組み合わせが存在するか確認
  Usermodel.find(
    { email: req.body.email, pass: req.body.pass },
    function (err, result) {
      // 存在する場合
      if (result.length !== 0) {
        res.send({
          data: req.body,
          status: "success",
        });
      } else {
        res.send({
          data: req.body,
          status: "error",
          message: "メールアドレス、またはパスワードが間違っています",
        });
      }
    }
  );
});

app.get("/", function (req, res) {

  res.send({ test: "aaa" });
});

// mongoose.connect("mongodb://localhost:27017/testdb", { useNewUrlParser: true });
// const userSchema = new mongoose.Schema({
//   name: String,
//   age: Number,
// });
// const Usermodel = mongoose.model("User", userSchema);
// const user = new Usermodel();
// user.name = "yamada";
// user.age = 20;
// user.save();
