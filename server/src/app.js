const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const { userRouter } = require('./routers/userRouter');
const { testUsers } = require('./controllers/testController');
const seedRouter = require('./routers/seedRouter');
const { errorResponse } = require('./controllers/responseController');
const { authRouter } = require('./routers/authRouter');
const app = express();

const rateLimiter = rateLimit({
    windowMs: 1*60*1000, //1 minute
    max : 5,
    message: 'Too many requests from this IP, please try again later'
})

app.use(rateLimiter);
app.use(xssClean())
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use("/users", userRouter);
// app.use("/test", testUsers);
app.use("/seed", seedRouter);
app.use("/auth", authRouter);


//client error handling
app.use((req, res, next) => {
   next(createError(404, 'route not found'));
  })

//Server error Handling
app.use((err, req, res, next) => {
  //  return res.status(err.status || 500).json({
  //   success: false,
  //   message: err.message
  //  })
   return errorResponse(res, {
    statusCode: err.status, 
    message: err.message,
  })
  })

  module.exports = app;