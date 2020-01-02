import express from "express";
import routes from "../routes";
import {
  userDetail,
  users,
  postEditProfile,
  getEditProfile,
  getChangePassword,
  postChangePassword
} from "../controllers/userController";
import { onlyPrivate, uploadAvatar } from "../middlewares";

const userRouter = express.Router();

userRouter.get(routes.users, users);

//  Edit profile
userRouter.get(routes.editProfile, onlyPrivate, getEditProfile);
userRouter.post(routes.editProfile, onlyPrivate, uploadAvatar, postEditProfile);

//  Change the password
userRouter.get(routes.changePassword, onlyPrivate, getChangePassword);
userRouter.post(routes.changePassword, onlyPrivate, postChangePassword);

//  User detail page
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;
