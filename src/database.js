const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log("Connected to database")
}).catch((err) => {
  console.log("Error connecting to database")
})