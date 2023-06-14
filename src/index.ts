import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUser } from "./routes/current-user";
import { errorHandler } from "./middlewares/error-handler";
import { signup } from "./routes/signup";
import { signin } from "./routes/signin";
import { signout } from "./routes/signout";
import { NotFoundError } from "./errors/not-found-error";
import cookieSession from "cookie-session";
import mongoose from "mongoose";

const app = express();

app.use(json());

//this tells express app that it is running behind some proxy
app.enable("trust proxy");

//using this enable us, using req.session which can be used to store cookies
app.use(
  cookieSession({
    signed: false, // this disables the encryption,
    secure: true, // when true, JWT will only be used if the user is over an https connection.
  })
);

app.use(currentUser);
app.use(signin);
app.use(signup);
app.use(signout);
app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY)
    throw new Error("Please provide a JWT_KEY environment variable. ");

  await mongoose.connect(
    `mongodb://${process.env.URL_MONGODB || "localhost:27017"}/auth`
  );
  console.log("connected to mongodb.");

  app.listen(process.env.PORT || 8080, () => {
    console.log(`auth app listening on ${process.env.PORT} port`);
  });
};

start();
