const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const sampleProducts = require('./mockData');

dotenv.config();

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce-fullstack';
    console.log(`Seeding database at ${mongoURI}...`);
    await mongoose.connect(mongoURI);
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    // Seed products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${createdProducts.length} products.`);

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
