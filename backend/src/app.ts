import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app=express();
app.use(cors({origin:env.frontendUrl,credentials:true}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.get("/",(_req,res)=>res.json({name:"LuxeWear API",version:"1.0.0",status:"running"}));
app.use("/api",routes);
app.use(notFound);
app.use(errorHandler);
export default app;
