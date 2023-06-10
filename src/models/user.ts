import mongoose from "mongoose";
import { Password } from "../services/passwrod";

interface IUser {
  email: string;
  password: string;
}

interface IUserDoc extends mongoose.Document {
  email: string;
  password: string;
  // and any other useful property, that mongoose gonna write internally
}

interface IUserModel extends mongoose.Model<IUserDoc> {
  build(user: IUser): IUserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (user: IUser) => {
  return new User(user);
};

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.hash(this.password);
    this.set("password", hashed);
  }
});

const User = mongoose.model<IUserDoc, IUserModel>("User", userSchema);

export { User };
