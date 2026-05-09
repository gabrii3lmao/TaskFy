import express from "express";
import cors from "cors";
import errorMidleware from "./middlewares/errorMiddleware.js";
import router from "./routes/router.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: [process.env.FRONTEND_URL!, "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", router);
app.use(errorMidleware);

async function bootstrap() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap();
