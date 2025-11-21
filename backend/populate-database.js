// Database Population Script
// Run this with: node populate-database.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/virtual_medical_home';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Define schemas (simplified versions)
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  phone: String,
  gender: String,
  dateOfBirth: Date,
  isEmailVerified: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  specialization: String,
  qualifications: [String],
  experience: Number,
  licenseNumber: String,
  consultationFee: Number,
  biography: String,
  isApproved: { type: Boolean, default: false },
  rating: Number,
  reviewCount: Number,
  availability: [{
    day: String,
    slots: [{
      startTime: String,
      endTime: String,
      isBooked: Boolean,
    }]
  }],
}, { timestamps: true });

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  appointmentDate: Date,
  timeSlot: {
    startTime: String,
    endTime: String,
  },
  type: String,
  status: String,
  symptoms: String,
  consultationNotes: String,
}, { timestamps: true });

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  diagnosis: String,
  medicines: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String,
  }],
  additionalNotes: String,
  tests: [{
    testName: String,
    instructions: String,
  }],
  followUpDate: Date,
}, { timestamps: true });

const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  documentType: String,
  fileName: String,
  fileUrl: String,
  description: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Create models
const User = mongoose.model('User', userSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);
const Prescription = mongoose.model('Prescription', prescriptionSchema);
const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

// Sample data
const populateDatabase = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({ email: { $ne: 'admin@vmh.com' } }); // Keep admin
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});
    await MedicalRecord.deleteMany({});

    console.log('👥 Creating users...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('test123', 10);

    // Create patients
    const patients = await User.insertMany([
      {
        firstName: 'John',
        lastName: 'Patient',
        email: 'patient@test.com',
        password: hashedPassword,
        role: 'patient',
        phone: '+1234567890',
        gender: 'male',
        dateOfBirth: new Date('1990-01-01'),
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma@test.com',
        password: hashedPassword,
        role: 'patient',
        phone: '+1234567891',
        gender: 'female',
        dateOfBirth: new Date('1985-05-15'),
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael@test.com',
        password: hashedPassword,
        role: 'patient',
        phone: '+1234567892',
        gender: 'male',
        dateOfBirth: new Date('1992-08-20'),
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Sophia',
        lastName: 'Davis',
        email: 'sophia@test.com',
        password: hashedPassword,
        role: 'patient',
        phone: '+1234567898',
        gender: 'female',
        dateOfBirth: new Date('1995-03-10'),
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Oliver',
        lastName: 'Martinez',
        email: 'oliver@test.com',
        password: hashedPassword,
        role: 'patient',
        phone: '+1234567899',
        gender: 'male',
        dateOfBirth: new Date('1988-11-25'),
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Ava',
        lastName: 'Taylor',
        email: 'ava@test.com',
        password: hashedPassword,
        role: 'patient',
        phone: '+1234567900',
        gender: 'female',
        dateOfBirth: new Date('1993-07-18'),
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'William',
        lastName: 'Anderson',
        email: 'william@test.com',
        password: hashedPassword,
        role: 'patient',
        phone: '+1234567901',
        gender: 'male',
        dateOfBirth: new Date('1991-02-28'),
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Isabella',
        lastName: 'Thomas',
        email: 'isabella@test.com',
        password: hashedPassword,
        role: 'patient',
        phone: '+1234567902',
        gender: 'female',
        dateOfBirth: new Date('1987-09-05'),
        isEmailVerified: true,
        isActive: true,
      },
    ]);

    // Create doctor users
    const doctorUsers = await User.insertMany([
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'doctor@test.com',
        password: hashedPassword,
        role: 'doctor',
        phone: '+1234567893',
        gender: 'female',
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'David',
        lastName: 'Chen',
        email: 'david.chen@test.com',
        password: hashedPassword,
        role: 'doctor',
        phone: '+1234567894',
        gender: 'male',
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.garcia@test.com',
        password: hashedPassword,
        role: 'doctor',
        phone: '+1234567895',
        gender: 'female',
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'James',
        lastName: 'Smith',
        email: 'james.smith@test.com',
        password: hashedPassword,
        role: 'doctor',
        phone: '+1234567896',
        gender: 'male',
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.anderson@test.com',
        password: hashedPassword,
        role: 'doctor',
        phone: '+1234567897',
        gender: 'female',
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Robert',
        lastName: 'Williams',
        email: 'robert.williams@test.com',
        password: hashedPassword,
        role: 'doctor',
        phone: '+1234567903',
        gender: 'male',
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Emily',
        lastName: 'Jones',
        email: 'emily.jones@test.com',
        password: hashedPassword,
        role: 'doctor',
        phone: '+1234567904',
        gender: 'female',
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Daniel',
        lastName: 'Rodriguez',
        email: 'daniel.rodriguez@test.com',
        password: hashedPassword,
        role: 'doctor',
        phone: '+1234567905',
        gender: 'male',
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Jennifer',
        lastName: 'Lee',
        email: 'jennifer.lee@test.com',
        password: hashedPassword,
        role: 'doctor',
        phone: '+1234567906',
        gender: 'female',
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Christopher',
        lastName: 'Taylor',
        email: 'christopher.taylor@test.com',
        password: hashedPassword,
        role: 'doctor',
        phone: '+1234567907',
        gender: 'male',
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Amanda',
        lastName: 'White',
        email: 'amanda.white@test.com',
        password: hashedPassword,
        role: 'doctor',
        phone: '+1234567908',
        gender: 'female',
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Matthew',
        lastName: 'Harris',
        email: 'matthew.harris@test.com',
        password: hashedPassword,
        role: 'doctor',
        phone: '+1234567909',
        gender: 'male',
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Jessica',
        lastName: 'Martin',
        email: 'jessica.martin@test.com',
        password: hashedPassword,
        role: 'doctor',
        phone: '+1234567910',
        gender: 'female',
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Andrew',
        lastName: 'Thompson',
        email: 'andrew.thompson@test.com',
        password: hashedPassword,
        role: 'doctor',
        phone: '+1234567911',
        gender: 'male',
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: 'Nicole',
        lastName: 'Moore',
        email: 'nicole.moore@test.com',
        password: hashedPassword,
        role: 'doctor',
        phone: '+1234567912',
        gender: 'female',
        isEmailVerified: true,
        isActive: true,
      },
    ]);

    console.log('👨‍⚕️ Creating doctor profiles...');
    
    const doctors = await Doctor.insertMany([
      {
        userId: doctorUsers[0]._id,
        specialization: 'Cardiologist',
        qualifications: ['MBBS', 'MD Cardiology', 'Fellowship in Interventional Cardiology'],
        experience: 12,
        licenseNumber: 'DOC001234',
        consultationFee: 150,
        biography: 'Dr. Sarah Johnson is a board-certified cardiologist with over 12 years of experience in treating heart conditions. She specializes in preventive cardiology and interventional procedures.',
        isApproved: true,
        rating: 4.8,
        reviewCount: 145,
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '10:00', endTime: '11:00', isBooked: false },
              { startTime: '14:00', endTime: '15:00', isBooked: false },
              { startTime: '15:00', endTime: '16:00', isBooked: false },
            ]
          },
          {
            day: 'Wednesday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '10:00', endTime: '11:00', isBooked: false },
              { startTime: '14:00', endTime: '15:00', isBooked: false },
            ]
          },
          {
            day: 'Friday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '11:00', endTime: '12:00', isBooked: false },
            ]
          },
        ],
      },
      {
        userId: doctorUsers[1]._id,
        specialization: 'Dermatologist',
        qualifications: ['MBBS', 'MD Dermatology', 'Fellowship in Cosmetic Dermatology'],
        experience: 8,
        licenseNumber: 'DOC001235',
        consultationFee: 120,
        biography: 'Dr. David Chen specializes in both medical and cosmetic dermatology. He has extensive experience in treating skin conditions, acne, and performing aesthetic procedures.',
        isApproved: true,
        rating: 4.9,
        reviewCount: 203,
        availability: [
          {
            day: 'Tuesday',
            slots: [
              { startTime: '10:00', endTime: '11:00', isBooked: false },
              { startTime: '11:00', endTime: '12:00', isBooked: false },
              { startTime: '15:00', endTime: '16:00', isBooked: false },
            ]
          },
          {
            day: 'Thursday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '14:00', endTime: '15:00', isBooked: false },
              { startTime: '16:00', endTime: '17:00', isBooked: false },
            ]
          },
        ],
      },
      {
        userId: doctorUsers[2]._id,
        specialization: 'Pediatrician',
        qualifications: ['MBBS', 'MD Pediatrics', 'Certified in Child Development'],
        experience: 15,
        licenseNumber: 'DOC001236',
        consultationFee: 100,
        biography: 'Dr. Maria Garcia is a compassionate pediatrician dedicated to providing comprehensive healthcare for children from infancy through adolescence.',
        isApproved: true,
        rating: 4.7,
        reviewCount: 189,
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '10:00', endTime: '11:00', isBooked: false },
              { startTime: '11:00', endTime: '12:00', isBooked: false },
            ]
          },
          {
            day: 'Wednesday',
            slots: [
              { startTime: '10:00', endTime: '11:00', isBooked: false },
              { startTime: '15:00', endTime: '16:00', isBooked: false },
            ]
          },
          {
            day: 'Friday',
            slots: [
              { startTime: '14:00', endTime: '15:00', isBooked: false },
              { startTime: '15:00', endTime: '16:00', isBooked: false },
            ]
          },
        ],
      },
      {
        userId: doctorUsers[3]._id,
        specialization: 'Orthopedic Surgeon',
        qualifications: ['MBBS', 'MS Orthopedics', 'Fellowship in Joint Replacement'],
        experience: 10,
        licenseNumber: 'DOC001237',
        consultationFee: 180,
        biography: 'Dr. James Smith is an experienced orthopedic surgeon specializing in joint replacement, sports injuries, and trauma care.',
        isApproved: true,
        rating: 4.6,
        reviewCount: 127,
        availability: [
          {
            day: 'Tuesday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '10:00', endTime: '11:00', isBooked: false },
            ]
          },
          {
            day: 'Thursday',
            slots: [
              { startTime: '14:00', endTime: '15:00', isBooked: false },
              { startTime: '15:00', endTime: '16:00', isBooked: false },
            ]
          },
        ],
      },
      {
        userId: doctorUsers[4]._id,
        specialization: 'Psychiatrist',
        qualifications: ['MBBS', 'MD Psychiatry', 'Certified in CBT and DBT'],
        experience: 9,
        licenseNumber: 'DOC001238',
        consultationFee: 130,
        biography: 'Dr. Lisa Anderson provides compassionate mental health care, specializing in anxiety, depression, and cognitive behavioral therapy.',
        isApproved: true,
        rating: 4.9,
        reviewCount: 156,
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '13:00', endTime: '14:00', isBooked: false },
              { startTime: '14:00', endTime: '15:00', isBooked: false },
              { startTime: '15:00', endTime: '16:00', isBooked: false },
            ]
          },
          {
            day: 'Wednesday',
            slots: [
              { startTime: '13:00', endTime: '14:00', isBooked: false },
              { startTime: '14:00', endTime: '15:00', isBooked: false },
            ]
          },
          {
            day: 'Friday',
            slots: [
              { startTime: '10:00', endTime: '11:00', isBooked: false },
              { startTime: '13:00', endTime: '14:00', isBooked: false },
            ]
          },
        ],
      },
      {
        userId: doctorUsers[5]._id,
        specialization: 'Neurologist',
        qualifications: ['MBBS', 'MD Neurology', 'Fellowship in Epilepsy'],
        experience: 14,
        licenseNumber: 'DOC001239',
        consultationFee: 170,
        biography: 'Dr. Robert Williams specializes in treating neurological disorders including migraines, epilepsy, and movement disorders with cutting-edge treatments.',
        isApproved: true,
        rating: 4.7,
        reviewCount: 98,
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '11:00', endTime: '12:00', isBooked: false },
            ]
          },
          {
            day: 'Thursday',
            slots: [
              { startTime: '10:00', endTime: '11:00', isBooked: false },
              { startTime: '14:00', endTime: '15:00', isBooked: false },
            ]
          },
        ],
      },
      {
        userId: doctorUsers[6]._id,
        specialization: 'Gastroenterologist',
        qualifications: ['MBBS', 'MD Gastroenterology', 'Advanced Endoscopy Certification'],
        experience: 11,
        licenseNumber: 'DOC001240',
        consultationFee: 140,
        biography: 'Dr. Emily Jones is an expert in digestive health, specializing in IBS, Crohn\'s disease, and advanced endoscopic procedures.',
        isApproved: true,
        rating: 4.8,
        reviewCount: 112,
        availability: [
          {
            day: 'Tuesday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '14:00', endTime: '15:00', isBooked: false },
              { startTime: '15:00', endTime: '16:00', isBooked: false },
            ]
          },
          {
            day: 'Friday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '10:00', endTime: '11:00', isBooked: false },
            ]
          },
        ],
      },
      {
        userId: doctorUsers[7]._id,
        specialization: 'ENT Specialist',
        qualifications: ['MBBS', 'MS ENT', 'Fellowship in Rhinology'],
        experience: 7,
        licenseNumber: 'DOC001241',
        consultationFee: 110,
        biography: 'Dr. Daniel Rodriguez treats ear, nose, and throat conditions with expertise in sinus surgery and hearing disorders.',
        isApproved: true,
        rating: 4.6,
        reviewCount: 87,
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '10:00', endTime: '11:00', isBooked: false },
              { startTime: '14:00', endTime: '15:00', isBooked: false },
            ]
          },
          {
            day: 'Wednesday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '11:00', endTime: '12:00', isBooked: false },
            ]
          },
          {
            day: 'Friday',
            slots: [
              { startTime: '14:00', endTime: '15:00', isBooked: false },
              { startTime: '15:00', endTime: '16:00', isBooked: false },
            ]
          },
        ],
      },
      {
        userId: doctorUsers[8]._id,
        specialization: 'Ophthalmologist',
        qualifications: ['MBBS', 'MS Ophthalmology', 'Fellowship in Retina'],
        experience: 13,
        licenseNumber: 'DOC001242',
        consultationFee: 160,
        biography: 'Dr. Jennifer Lee is a skilled ophthalmologist specializing in cataract surgery, retinal diseases, and laser vision correction.',
        isApproved: true,
        rating: 4.9,
        reviewCount: 176,
        availability: [
          {
            day: 'Tuesday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '10:00', endTime: '11:00', isBooked: false },
              { startTime: '11:00', endTime: '12:00', isBooked: false },
            ]
          },
          {
            day: 'Thursday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '14:00', endTime: '15:00', isBooked: false },
            ]
          },
        ],
      },
      {
        userId: doctorUsers[9]._id,
        specialization: 'General Physician',
        qualifications: ['MBBS', 'MD Internal Medicine'],
        experience: 16,
        licenseNumber: 'DOC001243',
        consultationFee: 90,
        biography: 'Dr. Christopher Taylor provides comprehensive primary care with focus on preventive medicine and chronic disease management.',
        isApproved: true,
        rating: 4.7,
        reviewCount: 234,
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '10:00', endTime: '11:00', isBooked: false },
              { startTime: '14:00', endTime: '15:00', isBooked: false },
              { startTime: '15:00', endTime: '16:00', isBooked: false },
            ]
          },
          {
            day: 'Wednesday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '10:00', endTime: '11:00', isBooked: false },
              { startTime: '14:00', endTime: '15:00', isBooked: false },
            ]
          },
          {
            day: 'Friday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '10:00', endTime: '11:00', isBooked: false },
            ]
          },
        ],
      },
      {
        userId: doctorUsers[10]._id,
        specialization: 'Endocrinologist',
        qualifications: ['MBBS', 'MD Endocrinology', 'Diabetes Specialist'],
        experience: 10,
        licenseNumber: 'DOC001244',
        consultationFee: 145,
        biography: 'Dr. Amanda White specializes in hormonal disorders, diabetes management, and thyroid conditions with personalized treatment plans.',
        isApproved: true,
        rating: 4.8,
        reviewCount: 121,
        availability: [
          {
            day: 'Tuesday',
            slots: [
              { startTime: '10:00', endTime: '11:00', isBooked: false },
              { startTime: '14:00', endTime: '15:00', isBooked: false },
            ]
          },
          {
            day: 'Thursday',
            slots: [
              { startTime: '10:00', endTime: '11:00', isBooked: false },
              { startTime: '15:00', endTime: '16:00', isBooked: false },
            ]
          },
        ],
      },
      {
        userId: doctorUsers[11]._id,
        specialization: 'Pulmonologist',
        qualifications: ['MBBS', 'MD Pulmonology', 'Sleep Medicine Certified'],
        experience: 9,
        licenseNumber: 'DOC001245',
        consultationFee: 135,
        biography: 'Dr. Matthew Harris treats respiratory conditions including asthma, COPD, and sleep disorders with evidence-based approaches.',
        isApproved: true,
        rating: 4.6,
        reviewCount: 94,
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '11:00', endTime: '12:00', isBooked: false },
              { startTime: '15:00', endTime: '16:00', isBooked: false },
            ]
          },
          {
            day: 'Wednesday',
            slots: [
              { startTime: '10:00', endTime: '11:00', isBooked: false },
              { startTime: '14:00', endTime: '15:00', isBooked: false },
            ]
          },
        ],
      },
      {
        userId: doctorUsers[12]._id,
        specialization: 'Rheumatologist',
        qualifications: ['MBBS', 'MD Rheumatology', 'Autoimmune Specialist'],
        experience: 12,
        licenseNumber: 'DOC001246',
        consultationFee: 155,
        biography: 'Dr. Jessica Martin provides expert care for arthritis, lupus, and other autoimmune conditions using latest treatment modalities.',
        isApproved: true,
        rating: 4.8,
        reviewCount: 103,
        availability: [
          {
            day: 'Tuesday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '11:00', endTime: '12:00', isBooked: false },
            ]
          },
          {
            day: 'Thursday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '14:00', endTime: '15:00', isBooked: false },
            ]
          },
        ],
      },
      {
        userId: doctorUsers[13]._id,
        specialization: 'Urologist',
        qualifications: ['MBBS', 'MS Urology', 'Robotic Surgery Certified'],
        experience: 11,
        licenseNumber: 'DOC001247',
        consultationFee: 165,
        biography: 'Dr. Andrew Thompson specializes in urinary tract conditions, kidney stones, and minimally invasive urological surgeries.',
        isApproved: true,
        rating: 4.7,
        reviewCount: 88,
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '14:00', endTime: '15:00', isBooked: false },
              { startTime: '15:00', endTime: '16:00', isBooked: false },
            ]
          },
          {
            day: 'Friday',
            slots: [
              { startTime: '10:00', endTime: '11:00', isBooked: false },
              { startTime: '11:00', endTime: '12:00', isBooked: false },
            ]
          },
        ],
      },
      {
        userId: doctorUsers[14]._id,
        specialization: 'Oncologist',
        qualifications: ['MBBS', 'MD Oncology', 'Clinical Trials Specialist'],
        experience: 15,
        licenseNumber: 'DOC001248',
        consultationFee: 200,
        biography: 'Dr. Nicole Moore provides compassionate cancer care with expertise in chemotherapy, immunotherapy, and personalized treatment plans.',
        isApproved: true,
        rating: 4.9,
        reviewCount: 142,
        availability: [
          {
            day: 'Wednesday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '10:00', endTime: '11:00', isBooked: false },
              { startTime: '14:00', endTime: '15:00', isBooked: false },
            ]
          },
          {
            day: 'Friday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isBooked: false },
              { startTime: '14:00', endTime: '15:00', isBooked: false },
            ]
          },
        ],
      },
    ]);

    console.log('📅 Creating appointments...');
    
    // Get dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const appointments = await Appointment.insertMany([
      // Patient 1 (John) - Upcoming appointments
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        appointmentDate: tomorrow,
        timeSlot: { startTime: '09:00', endTime: '10:00' },
        type: 'video',
        status: 'confirmed',
        symptoms: 'Chest pain and shortness of breath during exercise',
      },
      {
        patientId: patients[0]._id,
        doctorId: doctors[1]._id,
        appointmentDate: nextWeek,
        timeSlot: { startTime: '10:00', endTime: '11:00' },
        type: 'video',
        status: 'pending',
        symptoms: 'Persistent acne and skin redness',
      },
      // Patient 2 (Emma) - Upcoming appointment
      {
        patientId: patients[1]._id,
        doctorId: doctors[0]._id,
        appointmentDate: tomorrow,
        timeSlot: { startTime: '14:00', endTime: '15:00' },
        type: 'video',
        status: 'confirmed',
        symptoms: 'High blood pressure and palpitations',
      },
      // Patient 1 (John) - Past appointments
      {
        patientId: patients[0]._id,
        doctorId: doctors[4]._id,
        appointmentDate: yesterday,
        timeSlot: { startTime: '13:00', endTime: '14:00' },
        type: 'video',
        status: 'completed',
        symptoms: 'Anxiety and sleep issues',
        consultationNotes: 'Patient showing signs of moderate anxiety. Recommended relaxation techniques and follow-up in 2 weeks.',
      },
      {
        patientId: patients[0]._id,
        doctorId: doctors[2]._id,
        appointmentDate: lastWeek,
        timeSlot: { startTime: '10:00', endTime: '11:00' },
        type: 'video',
        status: 'completed',
        symptoms: 'Regular checkup',
        consultationNotes: 'General health checkup completed. All vitals normal.',
      },
      // Patient 4 (Sophia) - New appointments
      {
        patientId: patients[3]._id,
        doctorId: doctors[5]._id, // Dr. Robert Williams (Neurologist)
        appointmentDate: tomorrow,
        timeSlot: { startTime: '11:00', endTime: '12:00' },
        type: 'video',
        status: 'confirmed',
        symptoms: 'Frequent headaches and dizziness',
      },
      {
        patientId: patients[3]._id,
        doctorId: doctors[8]._id, // Dr. Jennifer Lee (Ophthalmologist)
        appointmentDate: lastWeek,
        timeSlot: { startTime: '09:00', endTime: '10:00' },
        type: 'video',
        status: 'completed',
        symptoms: 'Blurry vision and eye strain',
        consultationNotes: 'Prescribed reading glasses. Vision test completed successfully.',
      },
      // Patient 5 (Oliver) - New appointments
      {
        patientId: patients[4]._id,
        doctorId: doctors[6]._id, // Dr. Emily Jones (Gastroenterologist)
        appointmentDate: nextWeek,
        timeSlot: { startTime: '14:00', endTime: '15:00' },
        type: 'video',
        status: 'pending',
        symptoms: 'Abdominal pain and digestive issues',
      },
      {
        patientId: patients[4]._id,
        doctorId: doctors[9]._id, // Dr. Christopher Taylor (General Physician)
        appointmentDate: yesterday,
        timeSlot: { startTime: '10:00', endTime: '11:00' },
        type: 'video',
        status: 'completed',
        symptoms: 'Annual health checkup',
        consultationNotes: 'Overall health good. Recommended maintaining current lifestyle.',
      },
      // Patient 6 (Ava) - New appointments
      {
        patientId: patients[5]._id,
        doctorId: doctors[7]._id, // Dr. Daniel Rodriguez (ENT Specialist)
        appointmentDate: tomorrow,
        timeSlot: { startTime: '14:00', endTime: '15:00' },
        type: 'video',
        status: 'confirmed',
        symptoms: 'Persistent sore throat and ear pain',
      },
      {
        patientId: patients[5]._id,
        doctorId: doctors[10]._id, // Dr. Amanda White (Endocrinologist)
        appointmentDate: lastWeek,
        timeSlot: { startTime: '10:00', endTime: '11:00' },
        type: 'video',
        status: 'completed',
        symptoms: 'Thyroid screening and fatigue',
        consultationNotes: 'Thyroid levels normal. Recommended vitamin D supplements.',
      },
      // Patient 7 (William) - New appointments
      {
        patientId: patients[6]._id,
        doctorId: doctors[3]._id, // Dr. James Smith (Orthopedic Surgeon)
        appointmentDate: nextWeek,
        timeSlot: { startTime: '09:00', endTime: '10:00' },
        type: 'video',
        status: 'pending',
        symptoms: 'Knee pain and mobility issues',
      },
      {
        patientId: patients[6]._id,
        doctorId: doctors[11]._id, // Dr. Matthew Harris (Pulmonologist)
        appointmentDate: yesterday,
        timeSlot: { startTime: '11:00', endTime: '12:00' },
        type: 'video',
        status: 'completed',
        symptoms: 'Breathing difficulties and cough',
        consultationNotes: 'Prescribed inhaler for asthma management. Follow-up in 1 month.',
      },
      // Patient 8 (Isabella) - New appointments
      {
        patientId: patients[7]._id,
        doctorId: doctors[12]._id, // Dr. Jessica Martin (Rheumatologist)
        appointmentDate: tomorrow,
        timeSlot: { startTime: '09:00', endTime: '10:00' },
        type: 'video',
        status: 'confirmed',
        symptoms: 'Joint pain and stiffness',
      },
      {
        patientId: patients[7]._id,
        doctorId: doctors[2]._id, // Dr. Maria Garcia (Pediatrician)
        appointmentDate: lastWeek,
        timeSlot: { startTime: '15:00', endTime: '16:00' },
        type: 'video',
        status: 'completed',
        symptoms: 'General health consultation',
        consultationNotes: 'All vitals normal. Health maintenance advised.',
      },
    ]);

    console.log('💊 Creating prescriptions...');
    
    await Prescription.insertMany([
      {
        appointmentId: appointments[3]._id,
        patientId: patients[0]._id,
        doctorId: doctors[4]._id,
        diagnosis: 'Generalized Anxiety Disorder (GAD)',
        medicines: [
          {
            name: 'Sertraline',
            dosage: '50mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take in the morning with food',
          },
          {
            name: 'Lorazepam',
            dosage: '0.5mg',
            frequency: 'As needed (max 3 times daily)',
            duration: '15 days',
            instructions: 'Take only when experiencing acute anxiety',
          },
        ],
        additionalNotes: 'Practice relaxation techniques daily. Avoid caffeine and alcohol.',
        tests: [
          {
            testName: 'Follow-up consultation',
            instructions: 'Schedule in 2 weeks to assess medication effectiveness',
          },
        ],
        followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        appointmentId: appointments[4]._id,
        patientId: patients[0]._id,
        doctorId: doctors[2]._id,
        diagnosis: 'Routine Health Checkup - Normal',
        medicines: [
          {
            name: 'Multivitamin',
            dosage: '1 tablet',
            frequency: 'Once daily',
            duration: '90 days',
            instructions: 'Take after breakfast',
          },
        ],
        additionalNotes: 'Maintain healthy diet and regular exercise. All parameters within normal range.',
        tests: [],
        followUpDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log('📄 Creating medical records...');
    
    await MedicalRecord.insertMany([
      {
        patientId: patients[0]._id,
        documentType: 'lab_report',
        fileName: 'blood-test-results.pdf',
        fileUrl: 'https://example.com/uploads/blood-test-results.pdf',
        description: 'Complete blood count and lipid profile',
        uploadedBy: patients[0]._id,
      },
      {
        patientId: patients[0]._id,
        documentType: 'xray',
        fileName: 'chest-xray.jpg',
        fileUrl: 'https://example.com/uploads/chest-xray.jpg',
        description: 'Chest X-ray - Routine checkup',
        uploadedBy: patients[0]._id,
      },
      {
        patientId: patients[0]._id,
        documentType: 'prescription',
        fileName: 'prescription-dermatology.pdf',
        fileUrl: 'https://example.com/uploads/prescription-dermatology.pdf',
        description: 'Dermatology prescription for skin condition',
        uploadedBy: doctors[1]._id,
      },
      {
        patientId: patients[0]._id,
        documentType: 'lab_report',
        fileName: 'thyroid-test.pdf',
        fileUrl: 'https://example.com/uploads/thyroid-test.pdf',
        description: 'Thyroid function test results',
        uploadedBy: patients[0]._id,
      },
      {
        patientId: patients[1]._id,
        documentType: 'lab_report',
        fileName: 'ecg-report.pdf',
        fileUrl: 'https://example.com/uploads/ecg-report.pdf',
        description: 'ECG Test Results',
        uploadedBy: patients[1]._id,
      },
      {
        patientId: patients[1]._id,
        documentType: 'scan',
        fileName: 'mri-scan.pdf',
        fileUrl: 'https://example.com/uploads/mri-scan.pdf',
        description: 'MRI Brain Scan - Normal findings',
        uploadedBy: doctors[0]._id,
      },
      {
        patientId: patients[1]._id,
        documentType: 'other',
        fileName: 'hospital-discharge.pdf',
        fileUrl: 'https://example.com/uploads/hospital-discharge.pdf',
        description: 'Hospital discharge summary - Minor surgery',
        uploadedBy: doctors[3]._id,
      },
      {
        patientId: patients[2]._id,
        documentType: 'lab_report',
        fileName: 'diabetes-screening.pdf',
        fileUrl: 'https://example.com/uploads/diabetes-screening.pdf',
        description: 'Diabetes screening panel - HbA1c test',
        uploadedBy: patients[2]._id,
      },
      {
        patientId: patients[2]._id,
        documentType: 'xray',
        fileName: 'dental-xray.jpg',
        fileUrl: 'https://example.com/uploads/dental-xray.jpg',
        description: 'Dental X-ray for routine checkup',
        uploadedBy: patients[2]._id,
      },
      {
        patientId: patients[2]._id,
        documentType: 'other',
        fileName: 'vaccination-card.pdf',
        fileUrl: 'https://example.com/uploads/vaccination-card.pdf',
        description: 'COVID-19 and flu vaccination records',
        uploadedBy: patients[2]._id,
      },
    ]);

    console.log('✅ Database populated successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Patients: ${patients.length}`);
    console.log(`   - Doctors: ${doctors.length}`);
    console.log(`   - Appointments: ${appointments.length}`);
    console.log(`   - Prescriptions: 2`);
    console.log(`   - Medical Records: 10`);
    
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin:');
    console.log('     Email: admin@vmh.com');
    console.log('     Password: test123');
    console.log('\n   Sample Patients (All password: test123):');
    console.log('     - patient@test.com (John Patient)');
    console.log('     - emma@test.com (Emma Wilson)');
    console.log('     - michael@test.com (Michael Brown)');
    console.log('     - sophia@test.com (Sophia Davis)');
    console.log('     - oliver@test.com (Oliver Martinez)');
    console.log('     - and 3 more...');
    console.log('\n   Sample Doctors (All password: test123):');
    console.log('     - doctor@test.com (Dr. Sarah Johnson - Cardiologist)');
    console.log('     - david.chen@test.com (Dr. David Chen - Dermatologist)');
    console.log('     - maria.garcia@test.com (Dr. Maria Garcia - Pediatrician)');
    console.log('     - james.smith@test.com (Dr. James Smith - Orthopedic)');
    console.log('     - lisa.anderson@test.com (Dr. Lisa Anderson - Psychiatrist)');
    console.log('     - and 10 more specializations...');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating database:', error);
    process.exit(1);
  }
};

// Run the script
populateDatabase();
