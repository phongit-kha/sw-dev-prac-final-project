const Booking = require("../models/Booking");
const Dentist = require("../models/Dentist");

//get all appts
//get api/v1/bookings
//access private
exports.getBookings = async (req, res, next) => {
  let query;
  //General users can see only thaeir own appts!
  if (req.user.role !== "admin") {
    query = Booking.find({ user: req.user.id }).populate({
      path: "dentist",
      select: "name province tel",
    });
  } else {
    //If you are an admin, you can see all!
    if (req.params.dentistId) {
      console.log(req.params.dentistId);
      query = Booking.find({ dentist: req.params.dentistId }).populate({
        path: "dentist",
        select: "name province tel",
      });
    } else {
      query = Booking.find().populate({
        path: "dentist",
        select: "name province tel",
      });
    }
  }
  try {
    const bookings = await query;

    res
      .status(200)
      .json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Bookings" });
  }
};

//get single appt
//get api/v1/booking/:id
//access public
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "dentist",
      select: "name province tel",
    });
    if (!booking) {
      return res.status(404).json({
        success: false,
        msg: `No booking with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find booking" });
  }
};

//add single appt
//post api/v1/dentists/:dentistId/appointments/
//access private
exports.addBooking = async (req, res, next) => {
  try {
    req.body.dentist = req.params.dentistId;

    const dentist = await Dentist.findById(req.params.dentistId);

    if (!dentist) {
      return res.status(404).json({
        success: false,
        msg: `No dentist with the id of ${req.params.dentistId}`,
      });
    }

    //add user id to req.body
    req.body.user = req.user.id;
    //check for existed appt
    const existedBooking = await Booking.find({ user: req.user.id });
    //if the user is not an admin,they can create only 1 booking
    if (existedBooking.length >= 1 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        msg: `The user with ID ${req.user.id} has already made 1 booking`,
      });
    }
    const booking = await Booking.create(req.body);

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create booking" });
  }
};

//update appt
//put api/v1/appointments/:id
//access private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        msg: `No booking with the id of ${req.params.id}`,
      });
    }

    //make sure user is the apt owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        msg: `User ${req.user.id} is not authorized to update this booking`,
      });
    }
    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Booking" });
  }
};

//delete appt
//delete api/v1/appointments/:id
//access private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        msg: `No booking with the id of ${req.params.id}`,
      });
    }

    //make sure user is the apt owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        msg: `User ${req.user.id} is not authorized to delete this booking`,
      });
    }
    await booking.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Booking" });
  }
};
