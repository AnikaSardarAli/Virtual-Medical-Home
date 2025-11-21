const mongoose = require('mongoose');
require('dotenv').config();

const doctorSchema = new mongoose.Schema({}, { strict: false, strictPopulate: false });
const userSchema = new mongoose.Schema({}, { strict: false });

const Doctor = mongoose.model('Doctor', doctorSchema);
const User = mongoose.model('User', userSchema);

async function updateDoctorStatuses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/virtual_medical_home');
    console.log('✅ Connected to MongoDB\n');

    console.log('🔧 Updating doctor profiles...\n');

    // Get all doctors
    const doctors = await Doctor.find({});
    let approvedCount = 0;
    let pendingCount = 0;

    for (const doctor of doctors) {
      // Determine status based on doctor's data
      let status = 'approved'; // Default to approved
      
      // Check if this doctor is one of the pending ones
      const user = await User.findById(doctor.userId);
      if (user && user.email && (
        user.email.includes('@pending.com') ||
        user.email === 'michael.brown@pending.com' ||
        user.email === 'sarah.wilson@pending.com' ||
        user.email === 'david.lee@pending.com'
      )) {
        status = 'pending';
        pendingCount++;
      } else {
        status = 'approved';
        approvedCount++;
      }

      // Update the doctor document
      await Doctor.updateOne(
        { _id: doctor._id },
        { 
          $set: { 
            status: status,
            // Ensure other required fields exist
            consultationFee: doctor.consultationFee || 100,
            experience: doctor.experience || 5,
          }
        }
      );

      console.log(`✅ Updated: ${user?.email || 'Unknown'} - Status: ${status}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Approved doctors: ${approvedCount}`);
    console.log(`⏳ Pending doctors: ${pendingCount}`);
    console.log(`📋 Total doctors: ${doctors.length}`);
    console.log('='.repeat(60));
    console.log('\n✨ All doctor statuses updated!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateDoctorStatuses();
