const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost/shopify-backend-challenge', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to database")
}).catch((err) => {
  console.log("Error connecting to database")
})