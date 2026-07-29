require("dotenv").config();

const connectDB = require("./src/database/db");
const app = require("./src/app");

connectDB();
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
  console.log("Server is running...");
});
