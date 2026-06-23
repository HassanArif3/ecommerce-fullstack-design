const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const sampleProducts = require('./mockData');

dotenv.config();

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce-fullstack';
    console.log(`Seeding database at ${mongoURI}...`);
    await mongoose.connect(mongoURI);
    
    // Clear existing collections
    await Product.deleteMany({});
    console.log('Cleared existing products.');
    
    await User.deleteMany({});
    console.log('Cleared existing users.');

    await Cart.deleteMany({});
    console.log('Cleared existing carts.');

    // Seed products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${createdProducts.length} products.`);

    // Seed users
    const salt = await bcrypt.genSalt(10);
    const hashedCustomerPassword = await bcrypt.hash("CustomerPass123", salt);
    const hashedAdminPassword = await bcrypt.hash("AdminPass123", salt);

    const createdUsers = await User.insertMany([
      {
        _id: new mongoose.Types.ObjectId("60c72b2f9b1d8e1f8c8b4601"),
        name: "Regular Customer",
        email: "customer@brand.com",
        password: hashedCustomerPassword,
        role: "customer"
      },
      {
        _id: new mongoose.Types.ObjectId("60c72b2f9b1d8e1f8c8b4602"),
        name: "Admin Manager",
        email: "admin@brand.com",
        password: hashedAdminPassword,
        role: "admin"
      }
    ]);
    console.log(`Successfully seeded ${createdUsers.length} users (customer & admin).`);

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
