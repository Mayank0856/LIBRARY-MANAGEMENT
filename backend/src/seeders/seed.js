require('dotenv').config({ path: '../../.env' });
const { sequelize, Role, User, Category, Author, Publisher, Book } = require('../models');

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to Database. Starting seed...');

    // Warning: This forcefully drops tables before seeding (for development only)
    await sequelize.sync({ force: true });

    // 1. Roles
    const adminRole = await Role.create({ name: 'Admin' });
    const librarianRole = await Role.create({ name: 'Librarian' });
    const studentRole = await Role.create({ name: 'Student' });

    // 2. Users (Default pass: password123)
    await User.create({
      name: 'System Admin',
      email: 'admin@library.com',
      password: 'password123',
      role_id: adminRole.id
    });

    await User.create({
      name: 'Head Librarian',
      email: 'librarian@library.com',
      password: 'password123',
      role_id: librarianRole.id
    });

    await User.create({
      name: 'John Student',
      email: 'student@library.com',
      password: 'password123',
      enrollment_no: 'STU001',
      department: 'Computer Science',
      role_id: studentRole.id
    });

    // 3. Setup Book Meta data
    const catTech = await Category.create({ name: 'Technology', description: 'Tech related books' });
    const catFiction = await Category.create({ name: 'Fiction', description: 'Fictional novels' });

    const auth1 = await Author.create({ name: 'Robert C. Martin' });
    const auth2 = await Author.create({ name: 'J.K. Rowling' });

    const pub1 = await Publisher.create({ name: 'Prentice Hall' });
    const pub2 = await Publisher.create({ name: 'Bloomsbury' });

    // 4. Books
    await Book.create({
      title: 'Clean Code',
      isbn: '9780132350884',
      total_copies: 5,
      available_copies: 5,
      category_id: catTech.id,
      author_id: auth1.id,
      publisher_id: pub1.id
    });

    await Book.create({
      title: "Harry Potter and the Sorcerer's Stone",
      isbn: '9780590353427',
      total_copies: 3,
      available_copies: 3,
      category_id: catFiction.id,
      author_id: auth2.id,
      publisher_id: pub2.id
    });

    // 5. Default Settings
    const { Setting } = require('../models');
    await Setting.create({ key: 'fine_per_day', value: '5', description: 'Fine amount per day in Rupees' });
    await Setting.create({ key: 'max_books', value: '3', description: 'Max books a student can borrow' });
    await Setting.create({ key: 'return_days', value: '14', description: 'Default return period in days' });

    console.log('Seed completed successfully!');
    process.exit(0);

  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedDatabase();
