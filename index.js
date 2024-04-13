const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config()

const loginRouter = require("./src/routers/loginRouter")
const registerRouter = require("./src/routers/registerRouter")
const categoryRouter = require("./src/routers/categoryRouter")
const foodRouter = require("./src/routers/foodRouter")
const areaRouter = require("./src/routers/areaRouter")
// const orderRouter = require("./src/routers/orderRouter")

const app = express()
const port = 3004;

mongoose.connect(process.env.MONGODB_NAME)
    .then(() => {
        console.log("CONNECTED TO DB");
    })
    .catch((err) => {
        console.log("FAIL TO CONNECT DB !!!", err);
    })



app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/login", loginRouter)
app.use("/api/register", registerRouter)
app.use("/api/category", categoryRouter)
app.use("/api/food", foodRouter)
app.use("/api/area", areaRouter)
// app.use("/api/order", orderRouter)

app.listen(port, () => {
    console.log("CONNECTED TO BE");
})

