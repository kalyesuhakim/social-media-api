const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet')
const morgan = require('morgan');
const dotenv = require('dotenv');
const app = express();
const userRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
dotenv.config();



//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//routes
app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/posts',postRouter)


mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
    console.log("Connection to Mongoose is established")
});

app.listen(8800, () => {
    console.log('App listening on port 8800!');
});
