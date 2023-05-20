const mongoose = require('mongoose');
const Counter = require('./counterModel');

describe('Counter Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Counter.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create and save a new counter successfully', async () => {
    const counter = new Counter({ _id: 'test', sequence_value: 1 });
    const savedCounter = await counter.save();

    expect(savedCounter._id).toBeDefined();
    expect(savedCounter.sequence_value).toBe(1);
  });

  it('should fail to save a counter with missing required fields', async () => {
    const counter = new Counter({});

    let error;
    try {
      await counter.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors['_id']).toBeDefined();
  });
});
