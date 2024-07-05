import dotenv from "dotenv";
dotenv.config({path: `${process.cwd()}/.ENV`});
import express from "express";


const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello World",
  });
});


const PORT  = process.env.SERVER_PORT || 6060;


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});