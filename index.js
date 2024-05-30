const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const loginRouter = require("./src/routers/loginRouter");
const registerRouter = require("./src/routers/registerRouter");
const categoryRouter = require("./src/routers/categoryRouter");
const foodRouter = require("./src/routers/foodRouter");
const areaRouter = require("./src/routers/areaRouter");
const tableRouter = require("./src/routers/tableRouter");
// const orderRouter = require("./src/routers/orderRouter"); 
const order_FoodRouter = require("./src/routers/order_FoodRouter");

const app = express();
const http = require("http");
const { Server } = require('socket.io');
const cors = require('cors');
const port = 3004;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

mongoose.connect(process.env.MONGODB_NAME)
    .then(() => {
        console.log("CONNECTED TO DB");
    })
    .catch((err) => {
        console.log("FAIL TO CONNECT DB !!!", err);
    });

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Middleware để truyền `io` đến các route handlers
app.use((req, res, next) => {
    req.io = io;
    next();
  });
  
app.get("/greet", (req, res) => { 
    const { name } = req.query; 
    res.send({ msg: `Welcome ${name}!` }); 
});

app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);
app.use("/api/category", categoryRouter);
app.use("/api/food", foodRouter);
app.use("/api/area", areaRouter);
app.use("/api/table", tableRouter);
// app.use("/api/order", orderRouter);
app.use("/api/order_food", order_FoodRouter);

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);
    socket.on('join_admin_room', (adminId) => {
        socket.join('admin_room');
        console.log(`-----------------------------------Admin ${adminId} joined admin room`);
      });
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log("CONNECTED TO BE on port " + port);
});
