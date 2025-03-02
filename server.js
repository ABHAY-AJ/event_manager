require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const eventRoutes = require("./routes/events");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/api/v3/app/events", eventRoutes);

// deployment config
const path = require("path");
__dirname = path.resolve();

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/event-frontend/build")));
    app.get("*", (req, res)=>{
        res.sendFile(path.join(__dirname, "event-frontend", "build", "index.html"));
    });
}


connectDB().then(() => {
  app.listen(port, () => console.log(`Server running on port: ${port}`));
});
