import express from "express";
import cors from "cors";
import bodyParser from "body-parser";


import { router as index } from "./API/index";

export const app = express();

app.use(
    cors({
      origin: "*",
    })
  );

app.use(bodyParser.json());
app.use("/", index);

module.exports = app;