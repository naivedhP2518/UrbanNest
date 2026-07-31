const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Property = require('./models/Property');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({ role: 'agent' });
    await Property.deleteMany({});

    // Create sample agents
    const agents = await User.insertMany([
      {
        name: 'Arjun Sharma',
        email: 'arjun@example.com',
        password: 'password123',
        role: 'agent',
        avatar: '/images/default-agent.png'
      },
      {
        name: 'Priya Patel',
        email: 'priya@example.com',
        password: 'password123',
        role: 'agent',
        avatar: '/images/default-agent.png'
      },
      {
        name: 'Rohan Gupta',
        email: 'rohan@example.com',
        password: 'password123',
        role: 'agent',
        avatar: '/images/default-agent.png'
      },
      {
        name: 'Anjali Singh',
        email: 'anjali@example.com',
        password: 'password123',
        role: 'agent',
        avatar: '/images/default-agent.png'
      },
      {
        name: 'Kabir Khan',
        email: 'kabir@example.com',
        password: 'password123',
        role: 'agent',
        avatar: '/images/default-agent.png'
      },
      {
        name: 'Ishanvi Reddy',
        email: 'ishanvi@example.com',
        password: 'password123',
        role: 'agent',
        avatar: '/images/default-agent.png'
      }
    ]);

    // Create sample properties
    const properties = [
      {
        title: 'Modern Villa with Pool',
        description: 'A stunning modern villa located in the heart of Beverly Hills. Features 5 bedrooms, 4 bathrooms, and a private infinity pool.',
        price: 2450000,
        address: '123 Luxury Way',
        city: 'Los Angeles',
        type: 'Sale',
        amenities: ['Pool', 'Garden', 'Smart Home', 'Garage'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
          'http://localhost:5000/images/property-2.png',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600607687920-4e2a09be1587?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80'
        ],
        agent: agents[0]._id
      },
      {
        title: 'Luxury Penthouse',
        description: 'Breathtaking views of the city skyline from this ultra-luxury penthouse in Manhattan. Floor-to-ceiling windows and premium finishes.',
        price: 8500,
        address: '456 Skyline Blvd',
        city: 'New York',
        type: 'Rent',
        amenities: ['Gym', 'Concierge', 'Rooftop Access', 'Balcony'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1e5240980c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
        ],
        agent: agents[1]._id
      }
    ];

    await Property.create(properties);

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
