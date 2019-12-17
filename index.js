import express from "express";
const app = express();
const PORT = 4000;

const handleServer = () => console.log(`http://localhost:${PORT}`);
const handleHome = (req, res) => res.send("Hello World");
const handleProfile = (req, res) => res.send("Hello Profile");
const betweenHome = (req, res, next) => {
  console.log("Holly shit", req.originalUrl);
  next();
};

app.use(betweenHome);
app.get("/", handleHome);
app.get("/profile", handleProfile);

app.listen(PORT, handleServer);
