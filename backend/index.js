import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { engine } from "express-handlebars"; // Import Handlebars engine
import path from "path";
import { fileURLToPath } from 'url';
import { dbConnect } from "./config/db.js";
import router from "./routes/routers.js";

dotenv.config({});

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());
app.use(express.json());

// Set up Handlebars view engine
app.engine('handlebars', engine({
  defaultLayout: null,  // Disable default layout
}));
app.set('view engine', 'handlebars');  // Set Handlebars as the template engine
app.set('views', path.join(__dirname, 'views'));  // Specify where your view files are located

app.get("/", (_, res) => {
  res.status(200).json({
    message: "Welcome to Email Builder API 🚀",
    success: true
  });
});

app.use("/api/v1", router);

app.listen(process.env.PORT, () => {
  try {
    dbConnect();
  } catch (error) {
    console.log('error', error);
  } finally {
    console.log(`Listening on port ${process.env.PORT}`);
  }
});
