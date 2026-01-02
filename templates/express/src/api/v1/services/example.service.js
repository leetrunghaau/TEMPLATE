const ExampleRepository = require('../repositories/example.repository');

class ExampleService {
  async create(data) {
    // Business logic
    return await ExampleRepository.create(data);
  }
}

module.exports = new ExampleService();