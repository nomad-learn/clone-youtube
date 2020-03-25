import express from "express";
import passport from "passport";
import routes from "../routes";
import { home, search } from "../controllers/videoController";
import {
  logout,
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  githubLogin,
  postGithubLogin,
  getMe,
  kakaoLogin,
  postKakaoLogin,
  googleLogin,
  postGoogleLogin,
  getSecession,
  postSecession
} from "../controllers/userController";
import { onlyPublic, onlyPrivate } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.secession, onlyPrivate, getSecession);
globalRouter.post(routes.secession, postSecession, logout);

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.logout, onlyPrivate, logout);

globalRouter.get(routes.me, getMe);

//  Github Log In
globalRouter.get(routes.github, githubLogin);
globalRouter.get(
  routes.githubCallback,
  passport.authenticate("github", { failureRedirect: "/login" }),
  postGithubLogin
);

//  Google Log In
globalRouter.get(routes.google, googleLogin);
globalRouter.get(
  routes.googleCallback,
  passport.authenticate("google", { failureRedirect: "/login" }),
  postGoogleLogin
);

//  Kakao Log In
globalRouter.get(routes.kakao, kakaoLogin);
globalRouter.get(
  routes.kakaoCallback,
  passport.authenticate("kakao", {
    failureRedirect: "#!/login"
  }),
  postKakaoLogin
);

export default globalRouter;
