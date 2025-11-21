const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phone: String,
  role: String,
  isActive: Boolean,
});

const doctorSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  specialization: String,
  qualifications: [String],
  experience: Number,
  licenseNumber: String,
  consultationFee: Number,
  bio: String,
  isApproved: Boolean,
});

const User = mongoose.model('User', userSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);

const pendingDoctors = [
  {
    user: {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@pending.com',
      phone: '+91-9876543220',
      role: 'doctor',
      isActive: true,
    },
    doctor: {
      specialization: 'Orthopedics',
      qualifications: ['MBBS', 'MS Orthopedics', 'Fellowship in Joint Replacement'],
      experience: 12,
      licenseNumber: 'ORTHO-2024-001',
      consultationFee: 1200,
      bio: 'Specialized in joint replacement and sports injuries.',
      isApproved: false,
    },
  },
  {
    user: {
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@pending.com',
      phone: '+91-9876543221',
      role: 'doctor',
      isActive: true,
    },
    doctor: {
      specialization: 'Psychiatry',
      qualifications: ['MBBS', 'MD Psychiatry', 'Certification in CBT'],
      experience: 8,
      licenseNumber: 'PSY-2024-002',
      consultationFee: 1500,
      bio: 'Expert in cognitive behavioral therapy and anxiety disorders.',
      isApproved: false,
    },
  },
  {
    user: {
      firstName: 'David',
      lastName: 'Lee',
      email: 'david.lee@pending.com',
      phone: '+91-9876543222',
      role: 'doctor',
      isActive: true,
    },
    doctor: {
      specialization: 'ENT',
      qualifications: ['MBBS', 'MS ENT', 'Fellowship in Rhinology'],
      experience: 10,
      licenseNumber: 'ENT-2024-003',
      consultationFee: 900,
      bio: 'Specialized in sinus surgery and hearing disorders.',
      isApproved: false,
    },
  },
];

async function addPendingDoctors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/virtual_medical_home');
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('test123', 10);

    for (const item of pendingDoctors) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: item.user.email });
      if (existingUser) {
        console.log(`User ${item.user.email} already exists, skipping...`);
        continue;
      }

      // Create user
      const user = await User.create({
        ...item.user,
        password: hashedPassword,
      });
      console.log(`Created user: ${user.firstName} ${user.lastName}`);

      // Create doctor profile
      const doctor = await Doctor.create({
        ...item.doctor,
        userId: user._id,
      });
      console.log(`Created pending doctor profile for: Dr. ${user.firstName} ${user.lastName}`);
    }

    console.log('\n✅ Successfully added pending doctors!');
    console.log('You can now test the Doctor Approvals page.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addPendingDoctors();
