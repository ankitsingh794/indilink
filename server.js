const express = require("express");
const cors = require("cors");


const userRoutes = require('./routes/user.routes');
const categoriesRoutes = require('./routes/categories');

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/", (req, res) => {
  res.send({ status: true, message: "Server is up" });
});


// app.use("/api/users", userRoutes); 
// app.use("/api/categories", categoriesRoutes); 
app.use("/api", userRoutes); 

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
