const { json } = require("express");
const BookATable = require("../models/bookATableModel")

const createBookingATable = async (req, res) => {
    const io = req.io;
    console.log("req.body", req.body);
    const userInfo = req.body.userInfo
    const { date, time, totalPerson, space, note, } = req.body.bookingInfo
    try {
        if (userInfo) {
            if (!date || !time || !totalPerson || !space) {
                return res.status(400).json({ message: 'Date, time, numberGuest and chooseSpace are required.' });
            }
            const createBookingATable = await BookATable.create({
                date,
                time,
                totalPerson,
                space,
                note,
                userInfo: userInfo
            })
            io.emit('newBooking', {
                message: userInfo.userName + " vừa đặt bàn",
                bookingInfo: createBookingATable,
            });

            io.emit('updateBookingList');
            res.status(200).json({
                message: "Book a table Successfully",
                booking: createBookingATable,
            });
        } else {
            console.log("nononooo");

            res.status(401).json({
                message: "Please Login to Book Table",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating bill", error });
    }
}

const getAllBooking = async (req, res) => {
    const io = req.io;
    try {
        const getAllBooking = await BookATable.find().sort({ createdAt: -1 });
        io.emit('allBooking', {
            getAllBooking: getAllBooking,
        });
        res.status(200).json({ message: "Get All Booking Successfully", getAllBooking })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error get all Booking", error });
    }
}

const getOneBooking = async (req, res) => {
    const idBooking = req.params.idBooking
    try {
        const getOneBooking = await BookATable.findById(idBooking)
        res.status(200).json({ message: "Get One Booking Successfully", getOneBooking })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error get all Booking", error });
    }
}

const updateBookingStatus = async (req, res) => {
    const idBooking = req.params.idBooking
    const newStatus = req.body.newStatus
    const io = req.io;
    try {
        const updateBookingStatus = await BookATable.findByIdAndUpdate({ _id: idBooking }, { status: newStatus }, { new: true })
        io.emit('updateBookingStatus', {
            updateBookingStatus: updateBookingStatus,
        });
        res.status(200).json({ message: "Update Status Booking Successfully", updateBookingStatus })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Update Status Booking Successfully", error });
    }
}



module.exports = { createBookingATable, getAllBooking, updateBookingStatus, getOneBooking }