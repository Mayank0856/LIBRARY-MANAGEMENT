const { sequelize, Book, Author, Category, Publisher } = require('../models');

const booksPlaceholder = [];
const baseImages = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop', // book stack
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop', // dictionary
  'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=600&auto=format&fit=crop', // old book
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop', // open book
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop'  // reading
];

const titles = ["The Silent Patient", "Atomic Habits", "Dune", "1984", "To Kill a Mockingbird", "The Great Gatsby", "Sapiens", "The Alchemist", "Educated", "Project Hail Mary", "Harry Potter", "Lord of the Rings", "The Hobbit", "Fahrenheit 451", "Pride and Prejudice", "The Catcher in the Rye", "Animal Farm", "Brave New World", "The Color Purple", "Beloved", "The Handmaid's Tale", "The Hunger Games", "Catch-22", "The Shining", "It", "11/22/63", "The Martian", "Ender's Game", "Foundation", "Neuromancer", "Snow Crash", "The Left Hand of Darkness", "The Dispossessed", "The Lathe of Heaven", "A Wizard of Earthsea", "The Tombs of Atuan", "The Farthest Shore", "Tehanu", "The Other Wind", "Tales from Earthsea", "The Name of the Wind", "The Wise Man's Fear", "The Slow Regard of Silent Things", "The Way of Kings", "Words of Radiance", "Oathbringer", "Rhythm of War", "Mistborn", "The Well of Ascension", "The Hero of Ages"];

for(let i=0; i<50; i++) {
  booksPlaceholder.push({
    title: titles[i % titles.length] || ('Fascinating Book ' + (i+1)),
    isbn: '9781' + String(10000000+i),
    edition: ((i % 3) + 1) + 'st Edition',
    language: 'English',
    total_copies: Math.floor(Math.random() * 5) + 3, // 3 to 7
    available_copies: Math.floor(Math.random() * 5) + 3,
    description: 'A fascinating read exploring the depths of imagination and knowledge. This edition brings spectacular new insights and engaging storytelling perfectly suited for all kinds of readers.',
    cover_image_url: baseImages[i % baseImages.length],
    shelf_location: String.fromCharCode(65 + (i % 5)) + '-' + Math.floor(Math.random() * 10 + 1)
  });
}

async function add50() {
  await sequelize.authenticate();
  
  let cat = await Category.findOne();
  if(!cat) cat = await Category.create({ name: 'General', description: 'General Collection' });
  
  let auth = await Author.findOne();
  if(!auth) auth = await Author.create({ name: 'Various Authors' });
  
  let pub = await Publisher.findOne();
  if(!pub) pub = await Publisher.create({ name: 'Global Publishing Inc' });

  const booksToCreate = booksPlaceholder.map(b => ({
    ...b,
    category_id: cat.id,
    author_id: auth.id,
    publisher_id: pub.id
  }));

  try {
    await Book.bulkCreate(booksToCreate);
    console.log('Successfully added 50 more books with generic descriptions and images!');
  } catch (error) {
    console.error('Failed to create books:', error.message);
  }
  process.exit(0);
}

add50();
