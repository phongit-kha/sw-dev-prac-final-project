const mongoose = require("mongoose");

const DentistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    year_of_experience: {
      type: Number,
      required: [true, "Please add year of experience"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "LGBTQ+"],
      required: [true, "Please add your gender"],
    },
    area_of_expertise: {
      type: String,
      enum: [
        "General Dentistry",
        "Orthodontics",
        "Pediatric Dentistry",
        "Periodontics",
        "Cosmetic Dentistry",
        "Oral Surgery",
      ],
      required: [true, "Please add area of expertise"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    district: {
      type: String,
      required: [true, "Please add a district"],
    },
    province: {
      type: String,
      required: [true, "Please add a province"],
    },
    postalcode: {
      type: String,
      required: [true, "Please add a postalcode"],
      maxlength: [50, "Postal Code can not be more than 5 digits"],
    },
    tel: {
      type: String,
    },
    region: {
      type: String,
      required: [true, "Please add a region"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Cascade delete bookings when a hospital is deleted
DentistSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Bookings being removed from dentist ${this._id}`);
    await this.model("Booking").deleteMany({ dentist: this._id });
    next();
  }
);

//Reverse populate with virtuals
DentistSchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "dentist",
  justOne: false,
});

module.exports = mongoose.model("Dentist", DentistSchema);
