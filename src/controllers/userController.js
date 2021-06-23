/* eslint-disable camelcase */
import passport from "passport";
import { uploadFileToStorage } from "../middlewares";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    req.flash("error", "Password don't match");
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      req.flash("success", "Successful sign up");
      const user = await User({
        name,
        email,
      });
      await User.register(user, password);
      next();
    } catch (error) {
      req.flash("error", "Failed to join");
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = passport.authenticate("local", {
  successRedirect: routes.home,
  failureRedirect: routes.login,
  successFlash: "Wellcome!!",
  failureFlash: "Failed to Login please check on password and email",
});

//  github authentication

export const githubLogin = passport.authenticate("github", {
  failureFlash: "Failed to Login please check on password and email",
});

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogin = (req, res) => {
  req.flash("success", "Welcome!!");
  res.redirect(routes.home);
};

//  facebook authentication

export const googleLogin = passport.authenticate("google", {
  failureFlash: "Failed to Login please check on password and email",
});

export const googleLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { sub: id, picture: avatarUrl, email, name },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.googleId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      googleId: id,
      avatarUrl,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGoogleLogin = (req, res) => {
  req.flash("success", "Welcome!!");
  res.redirect(routes.home);
};

//  Kakao authentication

export const kakaoLogin = passport.authenticate("kakao", {
  failureRedirect: "#!/login",
  failureFlash: "Failed to Login please check on password and email",
});

export const kakaoLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: {
      id,
      properties: { nickname, profile_image },
      kakao_account: { email },
    },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.kakaoId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name: nickname,
      kakaoId: id,
      avatarUrl: profile_image,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postKakaoLogin = (req, res) => {
  req.flash("success", "Welcome!!");
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.logout();
  req.flash("info", "Logged out");
  res.redirect(routes.home);
};

export const users = (req, res) => {
  res.render("users", { pageTitle: "Users" });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).populate("videos");
  res.render("userDetail", { pageTitle: "User Detail", user });
};

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const getEditProfile = (req, res) => {
  res.render("editProfile", { pageTitle: "Edit Profile" });
};

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
  } = req;
  try {
    const avatarUrl = await uploadFileToStorage(file);
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? avatarUrl : req.user.avatarUrl,
    });
    req.flash("success", "Profile edit complete");
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Profile edit failed");
    res.redirect(`/users${routes.editProfile}`);
  }
};

export const getChangePassword = (req, res) => {
  res.render("changePassword", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword2 },
  } = req;
  try {
    if (newPassword !== newPassword2) {
      req.flash("error", "Password don't match");
      res.status(400);
      res.redirect(`/users${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    req.flash("success", "Change password complete");
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Error");
    res.status(400);
    res.redirect(`/users${routes.changePassword}`);
  }
};

// Secession account
export const getSecession = (req, res) => {
  const {
    user: { email },
  } = req;
  const id = email.split("@")[0];
  res.render("secession", { id });
};

export const postSecession = async (req, res, next) => {
  const {
    body: { email, verify },
    user: { email: loggedEmail },
  } = req;
  const id = email.split("@")[0];
  try {
    if (verify === `delete account/${id}` && email === loggedEmail) {
      await User.findOneAndDelete({ email });
      next();
    } else {
      res.redirect(routes.secession);
    }
  } catch (error) {
    console.log(error);
    res.redirect(routes.secession);
  }
};
