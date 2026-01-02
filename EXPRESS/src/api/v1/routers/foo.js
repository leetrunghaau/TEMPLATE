const express = require("express");
const router = express.Router();
const { validate } = require("@middleware");
const FooController = require("@ccontroller/v1/foo");
const { search } = require("@validation/v1");

router.get("/", validate(search, "query"), FooController.getAll);

module.exports = router;
