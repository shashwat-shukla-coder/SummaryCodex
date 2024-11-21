const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const port = 5000;
require("dotenv").config();
app.use(express.json());
app.use(cors());
//get dependies
const { notFound, ErrorHandling } = require("./middleware/errorMiddleware.js");
// conncet to DB
const ConnectDB = require("./config/ConncectToDB.js");
ConnectDB();
//routings
app.use("/users", userRoutes); // via this i can hit user routes
app.use("/notes", noteRoutes); // via this i can hit note routes


//-------------------------------------------------deployment
  const __dirname1 = path.resolve()
  if(process.env.NODE_ENV === "production"){
    //build folder in react
    app.use(express.static(path.join(__dirname1, "/frontend/build")));
    
    app.get("*",(req,res) => {
      res.sendFile(path.resolve(__dirname1, "frontend","build","index.html"));
    })
  
  
  } else{
    app.get("/", (req, res) => {
      res.send("API working fine");
    });
  }


//--------------------------------------------------deployment

app.use(notFound);
app.use(ErrorHandling);

app.listen(port, () => {
  console.log(`Server is running on port no  ${port}`);
});
