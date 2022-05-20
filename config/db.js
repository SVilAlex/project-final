const mongoose = require('mongoose');

mongoose
  .connect(
    'mongodb+srv://' +
      'projet:projetA' +
      '@cluster1.2mfz3.mongodb.net/project',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )

  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));
