/* eslint-disable camelcase */
import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
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
        email
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
  failureFlash: "Failed to Login please check on password and email"
});

//  github authentication

export const githubLogin = passport.authenticate("github", {
  failureFlash: "Failed to Login please check on password and email"
});

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email }
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
      avatarUrl
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

export const facebookLogin = passport.authenticate("facebook", {
  failureFlash: "Failed to Login please check on password and email"
});

export const facebookLoginCallback = async (_, __, profile, cb) => {
  console.log(profile);
  const {
    _json: { id, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postFacebookLogin = (req, res) => {
  req.flash("success", "Welcome!!");
  res.redirect(routes.home);
};

//  Kakao authentication

export const kakaoLogin = passport.authenticate("kakao", {
  failureRedirect: "#!/login",
  failureFlash: "Failed to Login please check on password and email"
});

export const kakaoLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: {
      id,
      properties: { nickname, profile_image },
      kakao_account: { email }
    }
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
      avatarUrl: profile_image
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
    params: { id }
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
    file
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl
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
    body: { oldPassword, newPassword, newPassword2 }
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
