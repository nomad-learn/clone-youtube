import express from "express";
import routes from "../routes";
import {
  videoDetail,
  deleteVideo,
  getUpload,
  postUpload,
  getEditVideo,
  postEditVideo
} from "../controllers/videoController";
import { uploadVideo, onlyPrivate } from "../middlewares";

const videoRouter = express.Router();

//  Upload
videoRouter.get(routes.upload, onlyPrivate, getUpload);
videoRouter.post(routes.upload, onlyPrivate, uploadVideo, postUpload);

//  Video detail
videoRouter.get(routes.videoDetail(), videoDetail);

//  Edit video
videoRouter.get(routes.editVideo(), onlyPrivate, getEditVideo);
videoRouter.post(routes.editVideo(), onlyPrivate, postEditVideo);

//  Delete video
videoRouter.get(routes.deleteVideo(), deleteVideo);

export default videoRouter;
