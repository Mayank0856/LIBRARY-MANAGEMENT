const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

// ─── Routes ────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth.routes'));
app.use('/api/books',        require('./routes/books.routes'));
app.use('/api/users',        require('./routes/users.routes'));
app.use('/api/categories',   require('./routes/categories.routes'));
app.use('/api/authors',      require('./routes/authors.routes'));
app.use('/api/publishers',   require('./routes/publishers.routes'));
app.use('/api/transactions', require('./routes/transaction.routes'));
app.use('/api/fines',        require('./routes/fines.routes'));
app.use('/api/dashboard',    require('./routes/dashboard.routes'));

app.get('/', (req, res) => {
  res.json({ message: 'Library Management System API is running ✅' });
});

// ─── Global error handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced.');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ DB connection failed:', err.message);
  });
