const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MONGODB_URI, PORT } = require("./utils/config");
const { setServers } = require("node:dns/promises"); setServers(["1.1.1.1", "8.8.8.8"]);
const localTitlesRouter = require("./controllers/localTitles");
const searchTitlesRouter = require("./controllers/searchTitles");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use("/api/titles", localTitlesRouter);
app.use("/api/search", searchTitlesRouter);


mongoose.set('strictQuery', false)

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message)
  })

module.exports = app