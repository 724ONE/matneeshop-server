const express = require("express");
const { getProduct } = require("./controller/getProduct");
const { filterOnCategory } = require("./controller/filterOnCategory");
const { tetsingAttribute } = require("./controller/tetsingAttribute");

const router = express.Router();

router.get("/getAll", getProduct);
router.get("/filterCategory", filterOnCategory);
router.get("/filterCollection", tetsingAttribute);
module.exports = router;
