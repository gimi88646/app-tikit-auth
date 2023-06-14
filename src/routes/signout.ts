import { Router } from "express";

const signout = Router();

signout.post("/api/users/signout", (req, res) => {
  req.session = null;
  res.send({});
});

export { signout };
