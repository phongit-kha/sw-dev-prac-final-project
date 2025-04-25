const { json } = require("express");
const Dentist = require("../models/Dentist");

exports.getDentists = async (req, res, next) => {
  let query;

  //copy req.query
  const reqQuery = { ...req.query };

  //Fieldes to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  //Loop over remove fields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  console.log(reqQuery);

  //create query string
  let queryStr = JSON.stringify(reqQuery);
  //create opeators $gt/...
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //finding resourse
  query = Dentist.find(JSON.parse(queryStr)).populate("bookings");

  //Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  //sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("name");
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const StartIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    const total = await Dentist.countDocuments();

    query = query.skip(StartIndex).limit(limit);
    //Executing query
    const dentists = await query;
    //pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (0 < StartIndex) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    //const hospitals = await Hospital.find(req.query);
    console.log(req.query);
    res.status(200).json({
      success: true,
      count: dentists.length,
      pagination,
      data: dentists,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.getDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findById(req.params.id);
    if (!dentist) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: dentist });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.createDentist = async (req, res, next) => {
  //console.log(req.body);
  const dentist = await Dentist.create(req.body);
  res.status(201).json({ success: true, data: dentist });
};

exports.updateDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!dentist) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: dentist });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.deleteDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findById(req.params.id);
    //const dentist = await dentist.findByIdAndDelete(req.params.id);
    if (!dentist) {
      return res.status(400).json({
        success: false,
        msg: `Bootcamp not found with id of ${req.params.id}`,
      });
    }
    await dentist.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
