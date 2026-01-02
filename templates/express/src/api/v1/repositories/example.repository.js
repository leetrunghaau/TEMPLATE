// Placeholder repository
class ExampleRepository {
  async create(data) {
    // Mock implementation
    return { id: Date.now(), ...data };
  }
}

module.exports = new ExampleRepository();