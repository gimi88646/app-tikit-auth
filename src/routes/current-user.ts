import express from "express";

const router = express.Router();

router.get("/api/users/current-user", (req, res) => {
  res.status(200).send();
});

export { router as currentUser };
