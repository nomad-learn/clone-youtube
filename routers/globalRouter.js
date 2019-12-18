import express from "express";
import routes from "../routes";

const globalRouter = express.Router();

globalRouter.get(routes.home, (req, res) => res.send("global home"));
globalRouter.get(routes.join, (req, res) => res.send("global join"));
globalRouter.get(routes.login, (req, res) => res.send("global login"));
globalRouter.get(routes.logout, (req, res) => res.send("global logout"));
globalRouter.get(routes.search, (req, res) => res.send("global search"));

export default globalRouter;
