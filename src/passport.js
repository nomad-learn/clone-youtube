import passport from "passport";
import GithubStrategy from "passport-github";
import KakaoStrategy from "passport-kakao";
import GoogleStrategy from "passport-google-oauth20";
import User from "./models/User";
import routes from "./routes";
import {
  githubLoginCallback,
  kakaoLoginCallback,
  googleLoginCallback
} from "./controllers/userController";

passport.use(User.createStrategy());

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: process.env.PRODUCTION
        ? `https://juntube.herokuapp.com${routes.githubCallback}`
        : `http://localhost:4000${routes.githubCallback}`
    },
    githubLoginCallback
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.PRODUCTION
        ? `https://juntube.herokuapp.com${routes.googleCallback}`
        : `http://localhost:4000${routes.googleCallback}`,
      scope: ["profile", "email"]
    },
    googleLoginCallback
  )
);

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_ID,
      clientSecret: process.env.KAKAO_SECRET,
      callbackURL: process.env.PRODUCTION
        ? `https://juntube.herokuapp.com${routes.kakaoCallback}`
        : `http://localhost:4000${routes.kakaoCallback}`,
      profileFields: ["id", "displayName", "email", "profile_image"],
      scope: ["profile", "account_email"]
    },
    kakaoLoginCallback
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
