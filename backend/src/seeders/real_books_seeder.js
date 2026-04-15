const { sequelize, Role, User, Category, Author, Publisher, Book } = require('../models');

// Base URL where our backend serves static PDFs
const PDF_BASE = 'http://localhost:5000/books';

const BOOKS_DATA = [
  // ── Public Domain Classics (self-hosted PDF) ──────────────────────────────
  {
    title: "Alice's Adventures in Wonderland",
    isbn: '9780486275437',
    category: 'Children',
    author: 'Lewis Carroll',
    description: "Alice tumbles down a rabbit hole into a fantastic world of talking animals, mad hatters, and a tyrannical queen. A timeless masterpiece of children's literature.",
    reader: `${PDF_BASE}/alice-in-wonderland.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486275437-L.jpg',
  },
  {
    title: 'Treasure Island',
    isbn: '9780486275598',
    category: 'Fiction',
    author: 'Robert Louis Stevenson',
    description: 'Young Jim Hawkins discovers a treasure map and sets sail on a swashbuckling adventure with pirates, including the legendary Long John Silver.',
    reader: `${PDF_BASE}/treasure-island.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486275598-L.jpg',
  },
  {
    title: 'The Adventures of Sherlock Holmes',
    isbn: '9780486474915',
    category: 'Fiction',
    author: 'Arthur Conan Doyle',
    description: 'The brilliant detective Sherlock Holmes and his partner Dr. Watson solve a series of baffling mysteries in Victorian London.',
    reader: `${PDF_BASE}/sherlock-holmes.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486474915-L.jpg',
  },
  {
    title: 'The Adventures of Tom Sawyer',
    isbn: '9780486400778',
    category: 'Children',
    author: 'Mark Twain',
    description: "Tom Sawyer's mischievous adventures along the Mississippi River — from whitewashing a fence to witnessing a murder at the graveyard.",
    reader: `${PDF_BASE}/tom-sawyer.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486400778-L.jpg',
  },
  {
    title: 'Oliver Twist',
    isbn: '9780486424538',
    category: 'Fiction',
    author: 'Charles Dickens',
    description: 'The story of an orphan boy who escapes a workhouse and falls in with a gang of pickpockets in the criminal underworld of Victorian London.',
    reader: `${PDF_BASE}/oliver-twist.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486424538-L.jpg',
  },
  {
    title: 'Great Expectations',
    isbn: '9780486415864',
    category: 'Fiction',
    author: 'Charles Dickens',
    description: "Pip, a poor orphan, suddenly gains wealth from a mysterious benefactor. A classic coming-of-age tale set in Victorian England.",
    reader: `${PDF_BASE}/great-expectations.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486415864-L.jpg',
  },
  {
    title: 'Pride and Prejudice',
    isbn: '9780486284736',
    category: 'Fiction',
    author: 'Jane Austen',
    description: 'The witty and romantic story of Elizabeth Bennet and Mr. Darcy — a masterpiece of social observation and timeless love.',
    reader: `${PDF_BASE}/pride-and-prejudice.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486284736-L.jpg',
  },
  {
    title: 'Frankenstein',
    isbn: '9780486282114',
    category: 'Fiction',
    author: 'Mary Shelley',
    description: 'The haunting Gothic novel about scientist Victor Frankenstein who creates a living creature — and faces the terrifying consequences.',
    reader: `${PDF_BASE}/frankenstein.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486282114-L.jpg',
  },
  {
    title: 'Dracula',
    isbn: '9780486404974',
    category: 'Fiction',
    author: 'Bram Stoker',
    description: 'The original vampire novel. Jonathan Harker travels to Transylvania to meet the mysterious Count Dracula, setting off a nightmarish chain of events.',
    reader: `${PDF_BASE}/dracula.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486404974-L.jpg',
  },
  {
    title: 'Moby Dick',
    isbn: '9780486432151',
    category: 'Fiction',
    author: 'Herman Melville',
    description: "Captain Ahab's obsessive hunt for the white whale Moby Dick across the world's oceans — an epic of adventure and obsession.",
    reader: `${PDF_BASE}/moby-dick.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486432151-L.jpg',
  },
  {
    title: 'Romeo and Juliet',
    isbn: '9780486275574',
    category: 'Fiction',
    author: 'William Shakespeare',
    description: "Shakespeare's immortal tragedy of two star-crossed lovers from feuding families whose love ends in tragedy.",
    reader: `${PDF_BASE}/romeo-and-juliet.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486275574-L.jpg',
  },
  {
    title: 'Hamlet',
    isbn: '9780486272788',
    category: 'Fiction',
    author: 'William Shakespeare',
    description: "The Prince of Denmark's quest for revenge against his uncle who murdered his father — Shakespeare's greatest tragedy.",
    reader: `${PDF_BASE}/hamlet.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486272788-L.jpg',
  },
  {
    title: 'Arabian Nights',
    isbn: '9780451531216',
    category: 'Fiction',
    author: 'Various (Traditional)',
    description: 'A collection of folk tales from the Islamic Golden Age — featuring Aladdin, Ali Baba, and Sinbad the Sailor.',
    reader: `${PDF_BASE}/arabian-nights.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780451531216-L.jpg',
  },
  {
    title: 'Twenty Thousand Leagues Under the Sea',
    isbn: '9780486443638',
    category: 'Fiction',
    author: 'Jules Verne',
    description: "Marine biologist Pierre Aronnax is captured aboard the mysterious Nautilus submarine captained by the enigmatic Captain Nemo.",
    reader: `${PDF_BASE}/twenty-thousand-leagues.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486443638-L.jpg',
  },
  {
    title: 'Adventures of Huckleberry Finn',
    isbn: '9780486280615',
    category: 'Children',
    author: 'Mark Twain',
    description: "Huck Finn and the runaway slave Jim's journey down the Mississippi River — a powerful story of friendship and freedom.",
    reader: `${PDF_BASE}/huckleberry-finn.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486280615-L.jpg',
  },
  {
    title: 'Little Women',
    isbn: '9780486424590',
    category: 'Fiction',
    author: 'Louisa May Alcott',
    description: 'The charming story of the four March sisters — Meg, Jo, Beth, and Amy — growing up in New England during the Civil War.',
    reader: `${PDF_BASE}/little-women.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486424590-L.jpg',
  },
  {
    title: 'The Count of Monte Cristo',
    isbn: '9780486454085',
    category: 'Fiction',
    author: 'Alexandre Dumas',
    description: "Edmond Dantès, wrongly imprisoned, escapes after years and returns as the wealthy Count of Monte Cristo to exact his revenge.",
    reader: `${PDF_BASE}/count-of-monte-cristo.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486454085-L.jpg',
  },
  {
    title: 'The Jungle Book',
    isbn: '9780486282756',
    category: 'Children',
    author: 'Rudyard Kipling',
    description: 'Mowgli, a boy raised by wolves in the Indian jungle, learns the law of the jungle from Baloo the bear and Bagheera the panther.',
    reader: `${PDF_BASE}/jungle-book.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486282756-L.jpg',
  },
  {
    title: "Gulliver's Travels",
    isbn: '9780486292731',
    category: 'Fiction',
    author: 'Jonathan Swift',
    description: "Lemuel Gulliver's extraordinary voyages to the lands of tiny Lilliputians, giants, talking horses and more — a brilliant satire.",
    reader: `${PDF_BASE}/gulliver-travels.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486292731-L.jpg',
  },
  {
    title: 'The Secret Garden',
    isbn: '9780486402291',
    category: 'Children',
    author: 'Frances Hodgson Burnett',
    description: 'Orphaned Mary Lennox discovers a hidden, locked garden at a manor house — and bringing it back to life transforms everyone around her.',
    reader: `${PDF_BASE}/secret-garden.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9780486402291-L.jpg',
  },

  // ── NCERT Official Textbooks (self-hosted PDF) ────────────────────────────
  {
    title: 'First Flight (Class 10)',
    isbn: '9788174507020',
    category: 'NCERT',
    class: '10',
    author: 'NCERT',
    description: 'Official NCERT English textbook for Class 10. Includes prose, poetry and supplementary reading.',
    reader: `${PDF_BASE}/ncert-first-flight-class10.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9788174507020-L.jpg',
  },
  {
    title: 'Mathematics (Class 10)',
    isbn: '9788174504890',
    category: 'NCERT',
    class: '10',
    author: 'NCERT',
    description: 'Official NCERT Mathematics textbook for Class 10. Covers real numbers, polynomials, quadratic equations and more.',
    reader: `${PDF_BASE}/ncert-math-class10.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9788174504890-L.jpg',
  },
  {
    title: 'Science (Class 10)',
    isbn: '9788174506443',
    category: 'NCERT',
    class: '10',
    author: 'NCERT',
    description: 'Official NCERT Science textbook for Class 10. Covers physics, chemistry and biology.',
    reader: `${PDF_BASE}/ncert-science-class10.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9788174506443-L.jpg',
  },
  {
    title: 'Beehive – English (Class 9)',
    isbn: '9788174504852',
    category: 'NCERT',
    class: '9',
    author: 'NCERT',
    description: 'Official NCERT English prose and poetry textbook for Class 9.',
    reader: `${PDF_BASE}/ncert-beehive-class9.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9788174504852-L.jpg',
  },
  {
    title: 'Marigold (Class 1)',
    isbn: '9788174504760',
    category: 'NCERT',
    class: '1',
    author: 'NCERT',
    description: 'Official NCERT English textbook for Class 1 with fun rhymes, stories and exercises.',
    reader: `${PDF_BASE}/ncert-marigold-class1.pdf`,
    cover: 'https://covers.openlibrary.org/b/isbn/9788174504760-L.jpg',
  },
];

// ─── Seeder ───────────────────────────────────────────────────────────────────
async function seed() {
  try {
    console.log('🌱 Seeding full library with self-hosted PDF books…');
    await sequelize.sync({ force: true });

    // Roles
    const adminRole     = await Role.create({ name: 'Admin' });
    const librarianRole = await Role.create({ name: 'Librarian' });
    const studentRole   = await Role.create({ name: 'Student' });

    // Users
    await User.create({ name: 'Admin User',    email: 'admin@library.com',     password: 'password123', role_id: adminRole.id });
    await User.create({ name: 'Library Staff', email: 'librarian@library.com', password: 'password123', role_id: librarianRole.id });
    await User.create({ name: 'Demo Student',  email: 'student@library.com',   password: 'password123', role_id: studentRole.id });

    // Publisher
    const publisher = await Publisher.create({ name: 'E-Library Global' });

    // Categories
    const catNames = ['NCERT', 'Fiction', 'Children', 'Hindi Literature', 'Manga', 'Technology', 'Science'];
    const categories = {};
    for (const name of catNames) {
      categories[name] = await Category.create({ name, description: `${name} collection.` });
    }

    // Books
    for (const data of BOOKS_DATA) {
      const [author] = await Author.findOrCreate({ where: { name: data.author || 'Various' } });
      await Book.create({
        title:           data.title,
        isbn:            data.isbn || `AUTO-${Math.random().toString(36).slice(2, 11)}`,
        description:     data.description || 'An exciting read.',
        category_id:     categories[data.category]?.id,
        author_id:       author.id,
        publisher_id:    publisher.id,
        total_copies:    10,
        available_copies:10,
        class_level:     data.class || null,
        reader_url:      data.reader,
        cover_image_url: data.cover || `https://covers.openlibrary.org/b/isbn/${data.isbn}-L.jpg`,
      });
    }

    console.log(`✅ Seeded ${BOOKS_DATA.length} books with self-hosted PDF links.`);
    console.log('   Run downloadBooks.js to fetch the actual PDF files.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
