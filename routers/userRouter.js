import express from "express";
import routes from "../routes";
import {
  userDetail,
  editProfile,
  changePassword,
  users
} from "../controllers/userController";
import { onlyPrivate } from "../middlewares";

const userRouter = express.Router();

userRouter.get(routes.users, users);
userRouter.get(routes.editProfile, onlyPrivate, editProfile);
userRouter.get(routes.changePassword, onlyPrivate, changePassword);

userRouter.get(routes.userDetail(), onlyPrivate, userDetail);

export default userRouter;
