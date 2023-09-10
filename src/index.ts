import { bunny } from "./lib";

const port = process.env.PORT || 8080;

const app = bunny();

app.get("/", (req, res) => res.json({ success: true, path: "/" }));
app.get("/about", (req, res) => res.json({ success: true, path: "/about" }));

app.listen(port, () => {
    console.log("server is on port " + port);
});
