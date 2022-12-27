
const router = require('express').Router();
const { registerUser, homePageData, loginUser, timeSlotBooking, getTotalBookingList, chatController,pinController} = require('../Controllers/user');
const jwtMiddleware  = require('../Controllers/auth')

router.get("/" ,(req,res) => {
    res.render('PatientLogin')
})


// resister for both patient and doctors
router.post('/register', registerUser)

// login user
router.post('/login',loginUser)

// render the home page
router.get('/home-page',jwtMiddleware,homePageData)

// route for slot booking
router.post('/booking-slot',jwtMiddleware,timeSlotBooking)

// route for entering in to the chat section
router.get('/chat', chatController)

// get all booking data for a doctor
router.get('/get-all-booking/:id',jwtMiddleware,getTotalBookingList)

//pin a user
router.get('/pinuser',pinController)

module.exports = router
