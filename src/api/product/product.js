const express = require("express");
const { getProduct } = require("./controller/getProduct");
const { filterOnCategory } = require("./controller/filterOnCategory");

const router = express.Router();

router.get("/getAll", getProduct);
router.get("/filterCategory", filterOnCategory);

module.exports = router;
