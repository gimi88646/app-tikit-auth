import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("please provide a valid email."),
    body("password")
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage("password must be between 8 and 20 characters."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new BadRequestError("email in use.");
    }
    const user = User.build({ email, password });
    await user.save();
    // second argument represents the key to be used, either be secret or asymmetric private key
    req.session = {
      jwt: jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!),
    };
    res.status(201).send(user);
  }
);
export { router as signup };
