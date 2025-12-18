import express from "express";
import cookieParser from "cookie-parser";
import bookRouter from "./routes/bookRoute.js";
import authRouter from "./routes/authRoute.js";
import { config } from "dotenv";
// import { connectDB, disconnectDB } from "./config/db.js";
import { disconnectDB, checkDatabaseConnection, createTablesIfNotExist } from "./config/database.js";
import errorHandler from "./middleware/errorHandler.js";
import borrowingRouter from "./routes/borrowingRoute.js";
import cors from 'cors';
config();

const app = express();
await checkDatabaseConnection();
await createTablesIfNotExist();


app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/books', bookRouter);
app.use('/auth', authRouter);
app.use('/borrowings', borrowingRouter);


app.use(errorHandler);


const server = app.listen(process.env.PORT || 5001, "0.0.0.0", () => {
  console.log(`Server running on PORT ${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
   await disconnectDB();
    process.exit(1);
  });
});


process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});