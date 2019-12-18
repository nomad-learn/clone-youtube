import routes from "./routes";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "JunTube";
  res.locals.routes = routes;
  next();
};
