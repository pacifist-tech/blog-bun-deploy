import express from "express";

const app = express();
const port = Number(process.env.PORT) || 8080;

app.get("/", (req, res) => {
    res.send({ success: true });
});

app.listen(port, () => {
    console.log("app is active on port " + port);
});
