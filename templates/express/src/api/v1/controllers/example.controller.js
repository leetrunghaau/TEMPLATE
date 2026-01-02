const ExampleService = require('../services/example.service');

class ExampleController {
  async create(req, res, next) {
    try {
      const newItem = await ExampleService.create(req.body);
      res.ok(newItem);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExampleController();