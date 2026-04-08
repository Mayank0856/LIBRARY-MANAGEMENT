const sequelize = require('../config/database');
const Role = require('./Role');
const User = require('./User');
const Author = require('./Author');
const Category = require('./Category');
const Publisher = require('./Publisher');
const Book = require('./Book');
const IssuedBook = require('./IssuedBook');
const Fine = require('./Fine');
const Setting = require('./Setting');
const AuditLog = require('./AuditLog');

// Relationships

// Role - User (1 to N)
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

// Author - Book (1 to N)
Author.hasMany(Book, { foreignKey: 'author_id' });
Book.belongsTo(Author, { foreignKey: 'author_id' });

// Category - Book (1 to N)
Category.hasMany(Book, { foreignKey: 'category_id' });
Book.belongsTo(Category, { foreignKey: 'category_id' });

// Publisher - Book (1 to N)
Publisher.hasMany(Book, { foreignKey: 'publisher_id' });
Book.belongsTo(Publisher, { foreignKey: 'publisher_id' });

// Book - IssuedBook (1 to N)
Book.hasMany(IssuedBook, { foreignKey: 'book_id' });
IssuedBook.belongsTo(Book, { foreignKey: 'book_id' });

// User - IssuedBook (1 to N for student)
User.hasMany(IssuedBook, { as: 'BorrowedBooks', foreignKey: 'student_id' });
IssuedBook.belongsTo(User, { as: 'Student', foreignKey: 'student_id' });

// User - IssuedBook (1 to N for librarian who issued it)
User.hasMany(IssuedBook, { as: 'ProcessedIssues', foreignKey: 'issued_by' });
IssuedBook.belongsTo(User, { as: 'Issuer', foreignKey: 'issued_by' });

// IssuedBook - Fine (1 to N)
IssuedBook.hasMany(Fine, { foreignKey: 'issue_id' });
Fine.belongsTo(IssuedBook, { foreignKey: 'issue_id' });

// User - Fine (1 to N)
User.hasMany(Fine, { foreignKey: 'student_id' });
Fine.belongsTo(User, { foreignKey: 'student_id' });

// User - AuditLog (1 to N)
User.hasMany(AuditLog, { foreignKey: 'user_id' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Role,
  User,
  Author,
  Category,
  Publisher,
  Book,
  IssuedBook,
  Fine,
  Setting,
  AuditLog
};
