import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/passwrod";
import jwt from "jsonwebtoken";

const signin = Router();

signin.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("please provide a valid email."),
    body("password").trim().notEmpty().withMessage("please supply a password."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new BadRequestError("user doesn't exists");

    const passMatches = await Password.compare(user.password, password);
    if (!passMatches) throw new BadRequestError("Invalid credentials.");

    req.session = {
      jwt: jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!),
    };
    res.status(200).send(user);
  }
);

export { signin };
