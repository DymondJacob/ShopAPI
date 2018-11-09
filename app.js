const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// forwards to products/orders route, don't need to add product/order to '/products''/order just '/' in products.js,orders.js. I did it here
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

mongoose.connect(
  "mongodb://ShopApi:ShopApi@nodejs-shard-00-00-jvfbq.mongodb.net:27017,nodejs-shard-00-01-jvfbq.mongodb.net:27017,nodejs-shard-00-02-jvfbq.mongodb.net:27017/test?ssl=true&replicaSet=NodeJS-shard-0&authSource=admin&retryWrites=true",
  {
    useNewUrlParser: true
  }
);
mongoose.promise = global.Promise;

// logs the route info to console
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  // insures prevent CORS errors
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Routes which should handle request (middleware)
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
