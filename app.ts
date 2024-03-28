import express from "express";
import cors from "cors";
import { router as index } from "./API/index";
import { router as user } from "./API/user";
import { router as main } from "./API/main";
import { router as image } from "./API/image";
import { router as time } from "./API/time";
import { router as image_upload } from "./API/file_upload";
import bodyParser from "body-parser";

export const app = express();
app.use(
    cors({
      origin: "*",
    })
  );
  
app.use(bodyParser.json());
app.use("/", index);
app.use("/user", user);
app.use("/main", main);
app.use("/image", image);
app.use("/time", time);
app.use("/file", image_upload);

module.exports = app;