import { Storage } from "@google-cloud/storage";
import multer from "multer";
import routes from "./routes";

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.GCS_SRC,
});

const bucket = storage.bucket(process.env.STORAGE_BUCKET);

const multerVideo = multer({
  storage: multer.memoryStorage(),
});

const multerAvatar = multer({
  storage: multer.memoryStorage(),
});

export const uploadVideo = multerVideo.single("uploadVideo");
export const uploadAvatar = multerAvatar.single("avatar");

export const uploadFileToStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject("No image file");
    }
    const fieldName = file.fieldname === "uploadVideo" ? "videos" : "avatars";
    const newFileName = `${file.originalname}_${Date.now()}`;
    const fileUpload = bucket.file(`${fieldName}/${newFileName}`);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      console.log(err);
      // eslint-disable-next-line prefer-promise-reject-errors
      reject("Something is wrong! Unable to upload at the moment.");
    });

    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      // eslint-disable-next-line no-undef
      const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
};

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};
