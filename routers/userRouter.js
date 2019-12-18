import express from "express";
import routes from "../routes";

const userRouter = express.Router();

userRouter.get(routes.home, (req, res) => res.send("users"));
userRouter.get(routes.userDetail, (req, res) => res.send("user detail"));
userRouter.get(routes.editProfile, (req, res) => res.send("users edit"));
userRouter.get(routes.changePassword, (req, res) =>
  res.send("users changepassword")
);

export default userRouter;
