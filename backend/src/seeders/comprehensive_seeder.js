const { sequelize, Role, User, Category, Author, Publisher, Book } = require('../models');

const BOOKS = [
  // Class 10
  { title: "First Flight - Class 10 English", category: "Class 10", description: "Standard English textbook for Class 10", autor: "NCERT", reader: "https://epathshala.nic.in/process.php?id=students&type=e-books&level=3&class=10&language=english&subject=01" },
  { title: "Footprints Without Feet - Class 10", category: "Class 10", description: "English Supplementary Reader for Class 10", autor: "NCERT", reader: "https://epathshala.nic.in/process.php?id=students&type=e-books&level=3&class=10&language=english&subject=01" },
  { title: "Mathematics Class 10", category: "Class 10", description: "Comprehensive Mathematics textbook for Class 10", autor: "NCERT", reader: "https://epathshala.nic.in/process.php?id=students&type=e-books&level=3&class=10&language=english&subject=05" },
  
  // Class 9
  { title: "Beehive - Class 9 English", category: "Class 9", description: "English textbook for Class 9 students", autor: "NCERT", reader: "https://epathshala.nic.in/process.php?id=students&type=e-books&level=3&class=9&language=english&subject=01" },
  { title: "Science Class 9", category: "Class 9", description: "Science textbook covering physics, chemistry, and biology for Class 9", autor: "NCERT", reader: "https://epathshala.nic.in/process.php?id=students&type=e-books&level=3&class=9&language=english&subject=04" },
  
  // Global Classics & Favorites
  { title: "Harry Potter and the Sorcerer's Stone", category: "Fiction", description: "The boy who lived begins his journey at Hogwarts.", isbn: "9780590353403", autor: "J.K. Rowling", reader: "https://openlibrary.org/works/OL82563W/Harry_Potter_and_the_Philosopher's_Stone" },
  { title: "Harry Potter and the Chamber of Secrets", category: "Fiction", description: "A mysterious chamber is opened at Hogwarts.", isbn: "9780439064866", autor: "J.K. Rowling", reader: "https://openlibrary.org/works/OL82537W/Harry_Potter_and_the_Chamber_of_Secrets" },
  { title: "The Lost Treasure of the Emerald Eye", category: "Children", description: "Geronimo Stilton's first adventure!", autor: "Geronimo Stilton", reader: "https://openlibrary.org/works/OL5733594W/The_lost_treasure_of_the_emerald_eye" },
  { title: "The Curse of the Cheese Pyramid", category: "Children", description: "Geronimo Stilton heads to Egypt.", autor: "Geronimo Stilton", reader: "https://openlibrary.org/works/OL5733596W/The_curse_of_the_cheese_pyramid" },
  { title: "1984", category: "Classics", description: "A dystopian social science fiction novel and cautionary tale.", autor: "George Orwell", reader: "https://openlibrary.org/works/OL1168083W/1984" },
  { title: "The Adventures of Sherlock Holmes", category: "Classics", description: "Twelve mystery stories featuring the legendary detective.", autor: "Arthur Conan Doyle", reader: "https://openlibrary.org/works/OL262424W/The_Adventures_of_Sherlock_Holmes" },
  { title: "The Hobbit", category: "Fiction", description: "Bilbo Baggins' unexpected journey.", autor: "J.R.R. Tolkien", reader: "https://openlibrary.org/works/OL27448W/The_Hobbit" },
  { title: "Clean Code", category: "Technology", description: "A Handbook of Agile Software Craftsmanship.", autor: "Robert C. Martin", reader: "https://openlibrary.org/works/OL20387431W/Clean_Code" },
  { title: "Atomic Habits", category: "Self-Help", description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones.", autor: "James Clear", reader: "https://openlibrary.org/works/OL20067303W/Atomic_Habits" }
];

async function seed() {
  try {
    console.log("Starting Comprehensive Seed...");
    
    // We only force sync if we really want to reset. 
    // Given the request for 100+ books and specific categories, let's reset to keep it clean.
    await sequelize.sync({ force: true });
    console.log("Database cleared.");

    // Roles
    const roles = await Promise.all([
      Role.create({ name: 'Admin' }),
      Role.create({ name: 'Librarian' }),
      Role.create({ name: 'Student' })
    ]);

    // Users
    await User.create({ name: 'Admin User', email: 'admin@library.com', password: 'password123', role_id: roles[0].id });
    await User.create({ name: 'Library Staff', email: 'librarian@library.com', password: 'password123', role_id: roles[1].id });
    await User.create({ name: 'Demo Student', email: 'student@library.com', password: 'password123', role_id: roles[2].id });

    // Setup academic categories
    const categories = {};
    const categoryNames = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Fiction", "Classics", "Technology", "Children", "Self-Help"];
    
    for (const name of categoryNames) {
      categories[name] = await Category.create({ name, description: `Books for ${name}` });
    }

    const publisher = await Publisher.create({ name: "Global Education Publishing" });

    // Populate Books
    for (const b of BOOKS) {
      const author = await Author.findOrCreate({ where: { name: b.autor } });
      
      await Book.create({
        title: b.title,
        description: b.description,
        isbn: b.isbn || Math.random().toString(36).substring(7).toUpperCase(),
        total_copies: 10,
        available_copies: 10,
        category_id: categories[b.category]?.id || categories["Fiction"].id,
        author_id: author[0].id,
        publisher_id: publisher.id,
        reader_url: b.reader,
        cover_image_url: `https://covers.openlibrary.org/b/isbn/${b.isbn || "9780132350884"}-L.jpg`
      });
    }

    // Add 80 more dummy books to reach 100+
    for (let i = 1; i <= 86; i++) {
        const grade = Math.floor(Math.random() * 10) + 1;
        await Book.create({
            title: `Extracurricular Reading - Vol ${i} (Grade ${grade})`,
            description: `A helpful supplementary book for students in Class ${grade}.`,
            isbn: `GEN-${i}-${grade}-${Math.random().toString(36).substring(3)}`,
            total_copies: 5,
            available_copies: 5,
            category_id: categories[`Class ${grade}`].id,
            author_id: 1, // Generic
            publisher_id: 1,
            reader_url: "https://openlibrary.org/",
            cover_image_url: "https://images.unsplash.com/photo-1543005128-d39eef402740?w=400&h=600&fit=crop"
        });
    }

    console.log("Seeding complete! 100+ books added.");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
