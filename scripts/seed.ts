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

    // Seed 5 venues with comprehensive details
    const venues = [
      {
        name: 'Grand Ballroom',
        description: 'Elegant ballroom perfect for weddings and corporate events with crystal chandeliers and marble floors.',
        address: '123 Main Street, Downtown City',
        city: 'Dhaka',
        state: 'Dhaka Division',
        zipCode: '1000',
        country: 'Bangladesh',
        capacity: 500,
        area: 5000.00,
        venueType: 'indoor',
        pricePerHour: 250.00,
        minimumHours: 4,
        securityDeposit: 5000.00,
        facilities: ['parking', 'ac', 'wifi', 'sound_system', 'lighting', 'stage', 'kitchen', 'restrooms', 'wheelchair_accessible'],
        amenities: ['bridal_room', 'groom_room', 'vip_lounge', 'dance_floor', 'bar_area'],
        cateringAllowed: true,
        decorationAllowed: true,
        alcoholAllowed: false,
        smokingAllowed: false,
        petFriendly: false,
        images: ['https://example.com/grand-ballroom-1.jpg', 'https://example.com/grand-ballroom-2.jpg'],
        contactPerson: 'Ahmed Hassan',
        contactPhone: '+8801712345678',
        contactEmail: 'contact@grandballroom.com',
        operatingHours: {
          monday: { open: '09:00', close: '23:00' },
          tuesday: { open: '09:00', close: '23:00' },
          wednesday: { open: '09:00', close: '23:00' },
          thursday: { open: '09:00', close: '23:00' },
          friday: { open: '09:00', close: '23:00' },
          saturday: { open: '08:00', close: '24:00' },
          sunday: { open: '08:00', close: '24:00' }
        },
        rating: 4.8,
        totalReviews: 125
      },
      {
        name: 'Garden Pavilion',
        description: 'Beautiful outdoor pavilion surrounded by lush gardens, ideal for intimate ceremonies and receptions.',
        address: '456 Park Avenue, Green Valley',
        city: 'Chittagong',
        state: 'Chittagong Division',
        zipCode: '4000',
        country: 'Bangladesh',
        capacity: 200,
        area: 3000.00,
        venueType: 'outdoor',
        pricePerHour: 150.00,
        minimumHours: 6,
        securityDeposit: 3000.00,
        facilities: ['parking', 'wifi', 'sound_system', 'lighting', 'restrooms', 'garden'],
        amenities: ['outdoor_space', 'gazebo', 'fountain'],
        cateringAllowed: true,
        decorationAllowed: true,
        alcoholAllowed: false,
        smokingAllowed: true,
        petFriendly: true,
        images: ['https://example.com/garden-pavilion-1.jpg', 'https://example.com/garden-pavilion-2.jpg'],
        contactPerson: 'Fatima Rahman',
        contactPhone: '+8801812345678',
        contactEmail: 'info@gardenpavilion.com',
        operatingHours: {
          monday: { open: '10:00', close: '22:00' },
          tuesday: { open: '10:00', close: '22:00' },
          wednesday: { open: '10:00', close: '22:00' },
          thursday: { open: '10:00', close: '22:00' },
          friday: { open: '10:00', close: '22:00' },
          saturday: { open: '09:00', close: '23:00' },
          sunday: { open: '09:00', close: '23:00' }
        },
        rating: 4.5,
        totalReviews: 89
      },
      {
        name: 'Conference Center',
        description: 'Modern conference facility with state-of-the-art AV equipment and flexible seating arrangements.',
        address: '789 Business District, Metro City',
        city: 'Sylhet',
        state: 'Sylhet Division',
        zipCode: '3100',
        country: 'Bangladesh',
        capacity: 300,
        area: 4000.00,
        venueType: 'indoor',
        pricePerHour: 180.00,
        minimumHours: 4,
        securityDeposit: 4000.00,
        facilities: ['parking', 'ac', 'wifi', 'sound_system', 'lighting', 'projector', 'kitchen', 'restrooms', 'wheelchair_accessible'],
        amenities: ['conference_rooms', 'break_out_areas', 'business_center'],
        cateringAllowed: true,
        decorationAllowed: true,
        alcoholAllowed: false,
        smokingAllowed: false,
        petFriendly: false,
        images: ['https://example.com/conference-center-1.jpg', 'https://example.com/conference-center-2.jpg'],
        contactPerson: 'Mohammad Ali',
        contactPhone: '+8801912345678',
        contactEmail: 'bookings@conferencecentersylhet.com',
        operatingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '09:00', close: '20:00' },
          sunday: { open: '09:00', close: '20:00' }
        },
        rating: 4.3,
        totalReviews: 67
      },
      {
        name: 'Rooftop Terrace',
        description: 'Stunning rooftop venue with panoramic city views, perfect for cocktail parties and celebrations.',
        address: '321 Skyline Boulevard, Uptown',
        city: 'Dhaka',
        state: 'Dhaka Division',
        zipCode: '1205',
        country: 'Bangladesh',
        capacity: 150,
        area: 2500.00,
        venueType: 'outdoor',
        pricePerHour: 200.00,
        minimumHours: 4,
        securityDeposit: 3500.00,
        facilities: ['wifi', 'sound_system', 'lighting', 'restrooms', 'elevator'],
        amenities: ['bar_area', 'city_view', 'sunset_view'],
        cateringAllowed: true,
        decorationAllowed: true,
        alcoholAllowed: true,
        smokingAllowed: true,
        petFriendly: false,
        images: ['https://example.com/rooftop-terrace-1.jpg', 'https://example.com/rooftop-terrace-2.jpg'],
        contactPerson: 'Sarah Khan',
        contactPhone: '+8801612345678',
        contactEmail: 'events@rooftopterrace.com',
        operatingHours: {
          monday: { open: '16:00', close: '24:00' },
          tuesday: { open: '16:00', close: '24:00' },
          wednesday: { open: '16:00', close: '24:00' },
          thursday: { open: '16:00', close: '24:00' },
          friday: { open: '16:00', close: '02:00' },
          saturday: { open: '14:00', close: '02:00' },
          sunday: { open: '14:00', close: '24:00' }
        },
        rating: 4.7,
        totalReviews: 156
      },
      {
        name: 'Heritage Hall',
        description: 'Historic venue with vintage charm, featuring original architecture and classic interior design.',
        address: '654 Historic Lane, Old Town',
        city: 'Rajshahi',
        state: 'Rajshahi Division',
        zipCode: '6000',
        country: 'Bangladesh',
        capacity: 400,
        area: 4500.00,
        venueType: 'indoor',
        pricePerHour: 220.00,
        minimumHours: 5,
        securityDeposit: 4500.00,
        facilities: ['parking', 'ac', 'wifi', 'sound_system', 'lighting', 'stage', 'kitchen', 'restrooms'],
        amenities: ['heritage_architecture', 'vintage_decor', 'grand_staircase', 'courtyard'],
        cateringAllowed: true,
        decorationAllowed: true,
        alcoholAllowed: false,
        smokingAllowed: false,
        petFriendly: false,
        images: ['https://example.com/heritage-hall-1.jpg', 'https://example.com/heritage-hall-2.jpg'],
        contactPerson: 'Rashid Ahmed',
        contactPhone: '+8801512345678',
        contactEmail: 'heritage@heritagehall.com',
        operatingHours: {
          monday: { open: '09:00', close: '22:00' },
          tuesday: { open: '09:00', close: '22:00' },
          wednesday: { open: '09:00', close: '22:00' },
          thursday: { open: '09:00', close: '22:00' },
          friday: { open: '09:00', close: '22:00' },
          saturday: { open: '08:00', close: '23:00' },
          sunday: { open: '08:00', close: '23:00' }
        },
        rating: 4.6,
        totalReviews: 98
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

    // Seed 5 meals with comprehensive details
    const meals = [
      {
        name: 'Vegetarian Deluxe',
        description: 'Premium vegetarian menu featuring seasonal vegetables, quinoa salad, pasta primavera, and dessert.',
        type: 'veg',
        cuisine: 'continental',
        servingStyle: 'plated',
        pricePerPerson: 325.00,
        minimumGuests: 50,
        menuItems: {
          appetizers: ['Vegetable Spring Rolls', 'Hummus with Pita', 'Caprese Salad'],
          main_course: ['Quinoa Stuffed Bell Peppers', 'Pasta Primavera', 'Grilled Vegetables'],
          desserts: ['Chocolate Mousse', 'Fresh Fruit Tart', 'Vanilla Panna Cotta'],
          sides: ['Garlic Bread', 'Mixed Green Salad', 'Roasted Potatoes']
        },
        beverages: ['tea', 'coffee', 'soft_drinks', 'juices', 'water'],
        specialDietary: ['halal', 'gluten_free', 'dairy_free'],
        serviceHours: { setup: 1, service: 3, cleanup: 1 },
        staffIncluded: true,
        equipmentIncluded: true,
        images: ['https://example.com/veg-deluxe-1.jpg', 'https://example.com/veg-deluxe-2.jpg'],
        isPopular: true,
        rating: 4.5,
        totalReviews: 78
      },
      {
        name: 'Chicken & Beef Combo',
        description: 'Hearty non-vegetarian meal with grilled chicken, beef tenderloin, roasted vegetables, and chocolate cake.',
        type: 'nonveg',
        cuisine: 'continental',
        servingStyle: 'plated',
        pricePerPerson: 335.00,
        minimumGuests: 40,
        menuItems: {
          appetizers: ['Chicken Wings', 'Beef Carpaccio', 'Caesar Salad'],
          main_course: ['Grilled Chicken Breast', 'Beef Tenderloin', 'Roasted Vegetables'],
          desserts: ['Chocolate Cake', 'Tiramisu', 'Ice Cream'],
          sides: ['Mashed Potatoes', 'Steamed Rice', 'Garlic Bread']
        },
        beverages: ['tea', 'coffee', 'soft_drinks', 'juices', 'water'],
        specialDietary: ['halal'],
        serviceHours: { setup: 1, service: 3, cleanup: 1 },
        staffIncluded: true,
        equipmentIncluded: true,
        images: ['https://example.com/chicken-beef-1.jpg', 'https://example.com/chicken-beef-2.jpg'],
        isPopular: true,
        rating: 4.7,
        totalReviews: 92
      },
      {
        name: 'International Buffet',
        description: 'Extensive buffet with international cuisine including Asian, Mediterranean, and American dishes.',
        type: 'buffet',
        cuisine: 'international',
        servingStyle: 'buffet',
        pricePerPerson: 445.00,
        minimumGuests: 100,
        menuItems: {
          asian: ['Fried Rice', 'Sweet & Sour Chicken', 'Vegetable Chow Mein', 'Spring Rolls'],
          mediterranean: ['Greek Salad', 'Grilled Lamb', 'Hummus', 'Pita Bread'],
          american: ['BBQ Ribs', 'Mac & Cheese', 'Coleslaw', 'Cornbread'],
          desserts: ['Assorted Cakes', 'Fresh Fruits', 'Ice Cream Station']
        },
        beverages: ['tea', 'coffee', 'soft_drinks', 'juices', 'water', 'mocktails'],
        specialDietary: ['halal', 'gluten_free', 'dairy_free', 'nut_free'],
        serviceHours: { setup: 2, service: 4, cleanup: 2 },
        staffIncluded: true,
        equipmentIncluded: true,
        images: ['https://example.com/intl-buffet-1.jpg', 'https://example.com/intl-buffet-2.jpg'],
        isPopular: true,
        rating: 4.8,
        totalReviews: 156
      },
      {
        name: 'Seafood Special',
        description: 'Fresh seafood selection with grilled salmon, shrimp cocktail, lobster bisque, and seasonal sides.',
        type: 'nonveg',
        cuisine: 'seafood',
        servingStyle: 'plated',
        pricePerPerson: 550.00,
        minimumGuests: 30,
        menuItems: {
          appetizers: ['Shrimp Cocktail', 'Oysters Rockefeller', 'Crab Cakes'],
          main_course: ['Grilled Salmon', 'Lobster Thermidor', 'Pan-Seared Scallops'],
          desserts: ['Key Lime Pie', 'Chocolate Lava Cake', 'Sorbet'],
          sides: ['Lemon Rice', 'Grilled Asparagus', 'Garlic Butter Bread']
        },
        beverages: ['tea', 'coffee', 'soft_drinks', 'juices', 'water'],
        specialDietary: ['halal'],
        serviceHours: { setup: 1, service: 3, cleanup: 1 },
        staffIncluded: true,
        equipmentIncluded: true,
        images: ['https://example.com/seafood-1.jpg', 'https://example.com/seafood-2.jpg'],
        isPopular: false,
        rating: 4.6,
        totalReviews: 45
      },
      {
        name: 'Vegan Gourmet',
        description: 'Sophisticated vegan menu with plant-based proteins, organic vegetables, and dairy-free desserts.',
        type: 'veg',
        cuisine: 'vegan',
        servingStyle: 'plated',
        pricePerPerson: 430.00,
        minimumGuests: 40,
        menuItems: {
          appetizers: ['Avocado Toast', 'Quinoa Salad', 'Stuffed Mushrooms'],
          main_course: ['Lentil Wellington', 'Cauliflower Steak', 'Jackfruit Curry'],
          desserts: ['Coconut Panna Cotta', 'Vegan Chocolate Cake', 'Fresh Berry Bowl'],
          sides: ['Roasted Vegetables', 'Wild Rice', 'Herb Bread']
        },
        beverages: ['herbal_tea', 'coffee', 'fresh_juices', 'coconut_water', 'kombucha'],
        specialDietary: ['vegan', 'gluten_free', 'dairy_free', 'nut_free'],
        serviceHours: { setup: 1, service: 3, cleanup: 1 },
        staffIncluded: true,
        equipmentIncluded: true,
        images: ['https://example.com/vegan-gourmet-1.jpg', 'https://example.com/vegan-gourmet-2.jpg'],
        isPopular: false,
        rating: 4.4,
        totalReviews: 34
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