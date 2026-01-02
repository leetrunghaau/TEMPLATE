const express = require('express');
const router = express.Router();
const ExampleController = require('../controllers/example.controller');
const validate = require('../middlewares/validation.middleware');
const { exampleSchema } = require('../validations/example.validation');

router.post('/', validate(exampleSchema), ExampleController.create);

module.exports = router;