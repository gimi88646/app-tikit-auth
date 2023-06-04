import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUser } from "./routes/current-user";
import { errorHandler } from "./middlewares/error-handler";
import { signup } from "./routes/signup";
import { signin } from "./routes/signin";
import { signout } from "./routes/signout";

const app = express();

app.use(json());

app.use(currentUser);
app.use(signin);
app.use(signup);
app.use(signout);
app.use(errorHandler);
app.get("/api/users/currentuser", (req, res) => {
  res.status(200).send("Hi there");
});

app.listen(process.env.PORT, () => {
  console.log(`auth app listening ${process.env.PORT}`);
});
