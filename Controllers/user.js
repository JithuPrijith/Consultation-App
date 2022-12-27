const User = require('../models/user')
const bcrypt = require('bcrypt');
const { route } = require('../routes/user');
const jwt = require('jsonwebtoken');
const { Error } = require('mongoose');


module.exports = {
    // fuction to register the user both doctor and patient.
    registerUser: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;
            const salt = await bcrypt.genSalt(10).catch(err => console.log(err))
            const hashedPassword = await bcrypt.hash(password, salt) //hashing the password to save in the database

            const user = new User({    //creating a new model
                name,
                email,
                password: hashedPassword,
                role
            })

            await user.save()
            res.status(200).json(user)

        } catch (error) {
            res.status(400).json(error)
        }
    },
    // function to login the user which render a output page depend upon the role of the role.
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            let logingUser = await User.findOne({ email: email }); //find user by matching the mail
            !logingUser && res.status(404).json("user not found")
            const checkPassword = await bcrypt.compare(password, logingUser.password); //compare the password 
            !checkPassword && res.status(400).json("wrong password");
            let username = logingUser.name;
            let token = jwt.sign({ username }, 'user-key');
            let role = logingUser.role;
            data = { logingUser, token }
            role === "doctor" ? res.status(200).json(data).render("") : res.status(200).json(logingUser).render("homePageData")
        } catch (error) {
            res.status(500).json(error)
        }
    },

    // this this the home page for user, which shows the list of doctor available.
    homePageData: async (req, res) => {
        try {
            var doctorList = await User.find({ role: "doctor" });
            const dataToSend = doctorList.map(data => {
                const { _doc: { password, email, ...rest } } = data;
                return rest;
            });
            console.log(dataToSend);
            dataToSend ? res.status(200).json(dataToSend) : res.status(404).json("no doctor registered")

        } catch (error) {
            res.status(500).json(error)
        }
    },

    // slot booking (time) by submitting the post submit data
    timeSlotBooking: async (req, res) => {
        const { ObjectId } = require('mongodb');
        const { startTime, endTime, doctorId, userId } = req.body
        try {
            const bookingDetails = {
                startTime,
                endTime,
                doctorId,
                userId
            };
            try {
                var checkSlotOfDoctor = await User.findOne({
                    _id: doctorId,
                    "bookingDetails.startTime": startTime,
                    "bookingDetails.endTime": endTime
                });
                console.log("aada", checkSlotOfDoctor);
            } catch (error) {
                return res.status(400).json(error);
            }

            if (checkSlotOfDoctor != null) { // if already have 
                return res.status(300).json({ status: "no slot available", checkSlotOfDoctor });
            } else {
                const id = { _id: { $in: [ObjectId(userId), ObjectId(doctorId)] } };
                const dataToUpdate = { $push: { 'bookingDetails': bookingDetails } };
                const updatedData = await User.updateMany(id, dataToUpdate);
                return res.status(200).json(updatedData);
            }
        } catch (error) {
            return res.status(500).json(error);

        }
    },

    //  get all booking list of the patient from this controller
    getTotalBookingList: async (req, res) => {
        const moment = require('moment');
        console.log("here");
        const { ObjectId } = require('mongodb');
        const doctorId = req.params.id;
        try {
            const doctor = await User.findOne({ "_id": doctorId });
            const bookingArray = doctor['bookingDetails']

            // it is to sort the the starting time of consultation in ascending of the time
            // it is not sorted from mongodb but from the code after fetching the data from database 
            const sortedBookings = bookingArray.sort((a, b) => {
                const aTime = moment(a.startTime, 'HH:mm');
                const bTime = moment(b.startTime, 'HH:mm');
                return aTime.diff(bTime);
            });

            console.log("here", sortedBookings);
        } catch (error) {
            res.status(500).json(error)
        }
    },

    // chat controller
    chatController: (req, res) => {
        const userId = "1112";
        const doctorId = "111";
        res.render('chatPage', { userId, doctorId })
    },
    // pin a user 
    pinController: async (req, res) => {
        userForPin = req.params.userId
        try {
            return new Promise(async (resolve, reject) => {
                let user = await User.findById({ _id: userForPin })
                if (!user.pinned) {
                   let pinneduser =  await User.updateOne({ _id: userForPin }, {
                        $set: {
                            pinned: true
                        }
                    })
                    resolve(pinneduser)
                } else {
                    reject("user already pinned")
                }
            })

        } catch (error) {
            res.status(500).json(error)
        }

    }

}