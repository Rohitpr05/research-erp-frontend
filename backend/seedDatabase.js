const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Initial users data (from your original JSON file + some additional test users)
const initialUsers = [
  {
    username: "deepak",
    email: "deepak@christuniversity.in",
    password: "deepak123",
    fullName: "Dr. Deepak",
    department: "Computer Science",
    role: "faculty",
    phoneNumber: "+91 9876543210"
  },
  {
    username: "john.doe",
    email: "john.doe@christuniversity.in", 
    password: "password123",
    fullName: "Dr. John Doe",
    department: "Mathematics",
    role: "faculty",
    phoneNumber: "+91 9876543211"
  },
  {
    username: "jane.smith",
    email: "jane.smith@christuniversity.in",
    password: "secure456",
    fullName: "Dr. Jane Smith", 
    department: "Physics",
    role: "faculty",
    phoneNumber: "+91 9876543212"
  },
  {
    username: "admin",
    email: "admin@christuniversity.in",
    password: "admin123",
    fullName: "System Administrator",
    department: "IT Administration",
    role: "admin",
    phoneNumber: "+91 9876543213"
  },
  {
    username: "student.test",
    email: "student.test@btech.christuniversity.in",
    password: "student123",
    fullName: "Test Student",
    department: "Computer Science",
    role: "student",
    phoneNumber: "+91 9876543214"
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 ========================================');
    console.log('🌱   Research ERP Database Seeder');
    console.log('🌱 ========================================');
    console.log('');
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    console.log('🔗 URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB successfully!');
    console.log(`🗄️  Database: ${mongoose.connection.name}`);
    console.log('========================================');

    // Check existing users
    const existingUsersCount = await User.countDocuments();
    console.log(`📊 Current users in database: ${existingUsersCount}`);

    if (existingUsersCount > 0) {
      console.log('');
      console.log('ℹ️  Database already contains users.');
      console.log('💡 This will add new users without duplicates.');
      console.log('');
    } else {
      console.log('');
      console.log('📝 No existing users found. Creating fresh data...');
      console.log('');
    }

    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    console.log('👥 Processing users...');
    console.log('========================================');

    // Process each user
    for (const userData of initialUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [
            { username: userData.username },
            { email: userData.email }
          ]
        });

        if (existingUser) {
          console.log(`⏭️  SKIPPED: ${userData.fullName} (${userData.username}) - already exists`);
          skippedCount++;
          continue;
        }

        // Create new user
        const user = new User(userData);
        await user.save();
        
        console.log(`✅ CREATED: ${userData.fullName} (${userData.username}) - ${userData.role.toUpperCase()}`);
        console.log(`   📧 Email: ${userData.email}`);
        console.log(`   🏢 Dept: ${userData.department}`);
        console.log('   ---');
        
        createdCount++;
        
      } catch (error) {
        console.error(`❌ ERROR creating ${userData.username}:`, error.message);
        errorCount++;
      }
    }

    console.log('========================================');
    console.log('📋 SEEDING SUMMARY:');
    console.log(`✅ Users successfully created: ${createdCount}`);
    console.log(`⏭️  Users skipped (already exist): ${skippedCount}`);
    console.log(`❌ Errors encountered: ${errorCount}`);
    console.log('========================================');

    // Display current database state
    const allUsers = await User.find({}).select('-password').sort({ role: 1, fullName: 1 });
    console.log('');
    console.log(`👥 TOTAL USERS IN DATABASE: ${allUsers.length}`);
    console.log('========================================');

    // Group by role for better display
    const roles = ['admin', 'faculty', 'student'];
    
    for (const role of roles) {
      const roleUsers = allUsers.filter(user => user.role === role);
      if (roleUsers.length > 0) {
        console.log('');
        console.log(`🎯 ${role.toUpperCase()} USERS (${roleUsers.length}):`);
        roleUsers.forEach((user, index) => {
          console.log(`   ${index + 1}. ${user.fullName}`);
          console.log(`      👤 Username: ${user.username}`);
          console.log(`      📧 Email: ${user.email}`);
          console.log(`      🏢 Department: ${user.department || 'Not specified'}`);
          console.log(`      📞 Phone: ${user.phoneNumber || 'Not provided'}`);
          console.log(`      📅 Created: ${user.createdAt?.toLocaleDateString() || 'Unknown'}`);
          if (index < roleUsers.length - 1) console.log('      ---');
        });
      }
    }

    console.log('');
    console.log('🔑 LOGIN CREDENTIALS FOR TESTING:');
    console.log('========================================');
    console.log('👨‍🏫 FACULTY LOGIN:');
    console.log('   Username: john.doe');
    console.log('   Password: password123');
    console.log('');
    console.log('👨‍💼 ADMIN LOGIN:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('');
    console.log('🔄 ALTERNATIVE FACULTY:');
    console.log('   Username: deepak');
    console.log('   Password: deepak123');
    console.log('');
    console.log('👨‍🎓 STUDENT LOGIN:');
    console.log('   Username: student.test');
    console.log('   Password: student123');
    console.log('========================================');

    // Get and display database statistics
    const stats = await User.getUserStats();
    console.log('');
    console.log('📊 DATABASE STATISTICS:');
    console.log('========================================');
    console.log(`📈 Total Users: ${stats.total}`);
    console.log(`✅ Active Users: ${stats.active}`);
    console.log(`❌ Inactive Users: ${stats.inactive}`);
    console.log(`👨‍🏫 Faculty: ${stats.faculty}`);
    console.log(`👨‍💼 Admins: ${stats.admins}`);
    console.log(`🔒 Locked Accounts: ${stats.locked}`);
    console.log('========================================');

    console.log('');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('');
    console.log('🚀 NEXT STEPS:');
    console.log('1. Start your backend server: npm run dev');
    console.log('2. Update your frontend authService.js');
    console.log('3. Test login with the credentials above');
    console.log('');
    console.log('✨ Your Research ERP system is ready!');

  } catch (error) {
    console.error('');
    console.error('❌ SEEDING FAILED!');
    console.error('========================================');
    console.error('Error details:', error.message);
    console.error('');
    
    if (error.name === 'MongoNetworkError' || error.code === 'ENOTFOUND') {
      console.error('💡 TROUBLESHOOTING:');
      console.error('1. Make sure MongoDB is running on port 27019:');
      console.error('   mongod --port 27019 --dbpath "C:\\data\\db"');
      console.error('');
      console.error('2. Check if the port is available:');
      console.error('   netstat -an | findstr :27019');
      console.error('');
      console.error('3. Verify your .env file has the correct MONGODB_URI');
    }
    
    if (error.name === 'MongooseError') {
      console.error('💡 Database connection issue detected.');
    }
    
    console.error('========================================');
    process.exit(1);
  } finally {
    // Always close the connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('📴 Database connection closed');
    }
    console.log('👋 Seeding process finished');
    process.exit(0);
  }
};

// Handle script interruption gracefully
process.on('SIGINT', async () => {
  console.log('');
  console.log('⚠️  Seeding process interrupted by user (Ctrl+C)');
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
  }
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection during seeding:', error);
  process.exit(1);
});

// Add a small delay before starting (makes it easier to read console)
console.log('🌱 Initializing Research ERP Database Seeder...');
console.log('⏳ Starting in 3 seconds...');
console.log('');

setTimeout(() => {
  seedDatabase();
}, 3000);