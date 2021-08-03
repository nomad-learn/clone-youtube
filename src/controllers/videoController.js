import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";
import { uploadFileToStorage } from "../middlewares";

export const home = async (req, res) => {
  try {
    const Videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", Videos });
  } catch (error) {
    res.render("home", { pageTitle: "Home", Videos: [] });
  }
};

export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file,
  } = req;
  try {
    const fileUrl = await uploadFileToStorage(file);
    const newVideo = await Video.create({
      fileUrl,
      title,
      description,
      creator: req.user.id,
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
    req.flash("info", "Upload Complete");
    res.redirect(routes.videoDetail(newVideo.id));
  } catch (error) {
    req.flash("error", "Upload video failed");
    res.redirect(routes.home);
  }
};

export const videoDetail = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const sideVideos = await Video.find({}).sort({ _id: -1 });
    const video = await Video.findById(id)
      .populate("creator")
      .populate("comments");
    const createAt = JSON.stringify(video.createdAt)
      .split('"')[1]
      .split("T")[0];
    res.render("videoDetail", {
      pageTitle: "Video Detail",
      video,
      createAt,
      detail: true,
      sideVideos,
    });
  } catch (error) {
    res.redirect(routes.home);
  }
};
export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    // eslint-disable-next-line eqeqeq
    if (video.creator != req.user.id) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    req.flash("success", "Edit video Complete");
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    req.flash("error", "Edit video failed");
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    // eslint-disable-next-line eqeqeq
    if (video.creator != req.user.id) {
      throw Error();
    } else {
      //  mongodb data remove code
      await Video.findOneAndRemove({ _id: id });
      // const delParams = {Bucket: "juntube1/video", Key: }
    }
    req.flash("success", "Delete complete");
  } catch (error) {
    req.flash("error", "Delete failed: Error");
    console.log(error);
  }
  res.redirect(routes.home);
};

// Register Video View

export const registerView = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    video.view += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

// Add Comment

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user: { name, avatarUrl },
  } = req;
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: req.user.id,
      user: name,
      avatarUrl: avatarUrl || null,
    });
    video.comments.push(newComment.id);
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

// Del Comment

export const postDelComment = async (req, res) => {
  const {
    params: { id },
    body: { postCommentId },
  } = req;
  try {
    const comment = await Comment.findOne({ _id: postCommentId });
    const video = await Video.findById(id);
    await video.comments.remove(comment.id);
    await Comment.deleteOne({ _id: postCommentId });
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postRealTimeDel = async (req, res) => {
  const {
    params: { id },
    body: { realTimeText },
  } = req;
  try {
    const comment = await Comment.findOne({ text: realTimeText });
    const video = await Video.findById(id);
    await video.comments.remove(comment.id);
    await Comment.deleteOne({ text: realTimeText });
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
