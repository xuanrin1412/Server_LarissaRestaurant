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
const billRouter = require("./src/routers/billRouter");
const order_FoodRouter = require("./src/routers/order_FoodRouter");
const bookATable = require("./src/routers/bookATableRouter");
const ngrok = require('ngrok');
const app = express();
const http = require("http");
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const uploadImage = require('./src/uploadImage');
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
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({
    limit: '25mb'
}));
app.use(express.urlencoded({
    limit: '25mb'
}));
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
app.use("/api/bill", billRouter);
app.use("/api/order_food", order_FoodRouter);
app.use("/api/book_a_table", bookATable);


var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';

app.post("/payment", async (req, res) => {
    console.log("api/payment res", req.body);
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters

    var orderInfo = 'Pay with MoMo';
    var partnerCode = 'MOMO';
    var redirectUrl = 'http://localhost:5173/order';//thanh toan xong nhay vao cai nay
    var ipnUrl = 'https://20f6-2402-800-637d-da0f-5dae-69f-2b29-4180.ngrok-free.app/callback';
    var requestType = "captureWallet";
    var amount = String(req.body.amount); //truyen tu body client
    var orderId = req.body.orderId;
    var requestId = orderId;
    var extraData = '';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature

    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature
    });

    try {
        const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        });
        res.status(200).json({ getPayment: response.data });
    } catch (error) {
        console.log(`problem with request: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
})

app.post("/callback", async (req, res) => {
    console.log("callback");
    console.log(req.body);
    return res.status(200).json(req.body)
})
app.post("/transaction-status", async (req, res) => {
    const { orderId } = req.body;
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
    const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest('hex');
    const requestBody = {
        partnerCode: "MOMO",
        requestId: orderId,
        orderId: orderId,
        signature: signature,
        lang: "vi"
    };

    try {
        const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/query', requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });


        res.status(200).json({ transactionStatus: response.data });
    } catch (error) {
        console.log(`Problem with request transactionStatus: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error TransactionStatus', error: error.message });
    }
});


// UPLOAD IMAGES
app.post("/uploadImage", (req, res) => {
    uploadImage(req.body.image)
        .then((url) => {
            console.log("urlll", url);
            res.send(url)
        })
        .catch((err) => {
            console.log("urlll error", err);

            res.status(500).send(err)
        })
})




server.listen(port, async () => {
    console.log("CONNECTED TO BE on port " + port);
    try {
        const url = await ngrok.connect(port);
        console.log(`Ngrok tunnel established at ${url}`);
    } catch (error) {
        console.error('Error starting ngrok:', error);
    }
});

io.on('connection', (socket) => {
    io.emit("hievent", "xin chao")
    console.log(`User Connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

