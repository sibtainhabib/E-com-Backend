import connectDB from "./lib/db.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

connectDB().then(
  app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on PORT: " , process.env.PORT || 5000);
  })
).catch(
  (error) => console.log("Error in connecting MONGODB", error.message)
)