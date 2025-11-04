import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!@#';
  const adminName = process.env.ADMIN_NAME || 'System Administrator';

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        name: adminName,
        email: adminEmail,
        passwordHash: hashedPassword,
        phone: '+1234567890',
      },
    });

    console.log('✅ Admin user created:', admin.email);

    // Seed 5 venues
    const venues = [
      {
        name: 'Grand Ballroom',
        address: '123 Main Street, Downtown City',
        capacity: 500,
        pricePerHour: 250.00,
        description: 'Elegant ballroom perfect for weddings and corporate events with crystal chandeliers and marble floors.',
      },
      {
        name: 'Garden Pavilion',
        address: '456 Park Avenue, Green Valley',
        capacity: 200,
        pricePerHour: 150.00,
        description: 'Beautiful outdoor pavilion surrounded by lush gardens, ideal for intimate ceremonies and receptions.',
      },
      {
        name: 'Conference Center',
        address: '789 Business District, Metro City',
        capacity: 300,
        pricePerHour: 180.00,
        description: 'Modern conference facility with state-of-the-art AV equipment and flexible seating arrangements.',
      },
      {
        name: 'Rooftop Terrace',
        address: '321 Skyline Boulevard, Uptown',
        capacity: 150,
        pricePerHour: 200.00,
        description: 'Stunning rooftop venue with panoramic city views, perfect for cocktail parties and celebrations.',
      },
      {
        name: 'Heritage Hall',
        address: '654 Historic Lane, Old Town',
        capacity: 400,
        pricePerHour: 220.00,
        description: 'Historic venue with vintage charm, featuring original architecture and classic interior design.',
      },
    ];

    for (const venueData of venues) {
      const existingVenue = await prisma.venue.findFirst({
        where: { name: venueData.name },
      });
      
      if (!existingVenue) {
        const venue = await prisma.venue.create({
          data: venueData,
        });
        console.log('✅ Venue created:', venue.name);
      } else {
        console.log('⏭️ Venue already exists:', existingVenue.name);
      }
    }

    // Seed 5 meals
    const meals = [
      {
        name: 'Vegetarian Deluxe',
        type: 'veg',
        pricePerPerson: 325.00,
        description: 'Premium vegetarian menu featuring seasonal vegetables, quinoa salad, pasta primavera, and dessert.',
      },
      {
        name: 'Chicken & Beef Combo',
        type: 'nonveg',
        pricePerPerson: 335.00,
        description: 'Hearty non-vegetarian meal with grilled chicken, beef tenderloin, roasted vegetables, and chocolate cake.',
      },
      {
        name: 'International Buffet',
        type: 'buffet',
        pricePerPerson: 445.00,
        description: 'Extensive buffet with international cuisine including Asian, Mediterranean, and American dishes.',
      },
      {
        name: 'Seafood Special',
        type: 'nonveg',
        pricePerPerson: 550.00,
        description: 'Fresh seafood selection with grilled salmon, shrimp cocktail, lobster bisque, and seasonal sides.',
      },
      {
        name: 'Vegan Gourmet',
        type: 'veg',
        pricePerPerson: 430.00,
        description: 'Sophisticated vegan menu with plant-based proteins, organic vegetables, and dairy-free desserts.',
      },
    ];

    for (const mealData of meals) {
      const existingMeal = await prisma.meal.findFirst({
        where: { name: mealData.name },
      });
      
      if (!existingMeal) {
        const meal = await prisma.meal.create({
          data: mealData,
        });
        console.log('✅ Meal created:', meal.name);
      } else {
        console.log('⏭️ Meal already exists:', existingMeal.name);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });