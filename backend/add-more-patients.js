const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phone: String,
  dateOfBirth: Date,
  gender: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  bloodGroup: String,
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
  },
  role: String,
  isActive: Boolean,
  profilePicture: String,
});

const User = mongoose.model('User', userSchema);

const newPatients = [
  {
    firstName: 'Emma',
    lastName: 'Thompson',
    email: 'emma.thompson@patient.com',
    phone: '+1-555-0101',
    dateOfBirth: new Date('1988-05-15'),
    gender: 'female',
    address: {
      street: '123 Maple Street',
      city: 'Boston',
      state: 'Massachusetts',
      zipCode: '02101',
    },
    bloodGroup: 'O+',
    emergencyContact: {
      name: 'James Thompson',
      relationship: 'Husband',
      phone: '+1-555-0102',
    },
  },
  {
    firstName: 'Liam',
    lastName: 'Anderson',
    email: 'liam.anderson@patient.com',
    phone: '+1-555-0103',
    dateOfBirth: new Date('1992-08-22'),
    gender: 'male',
    address: {
      street: '456 Oak Avenue',
      city: 'Seattle',
      state: 'Washington',
      zipCode: '98101',
    },
    bloodGroup: 'A+',
    emergencyContact: {
      name: 'Sarah Anderson',
      relationship: 'Sister',
      phone: '+1-555-0104',
    },
  },
  {
    firstName: 'Olivia',
    lastName: 'Martinez',
    email: 'olivia.martinez@patient.com',
    phone: '+1-555-0105',
    dateOfBirth: new Date('1985-03-10'),
    gender: 'female',
    address: {
      street: '789 Pine Road',
      city: 'Miami',
      state: 'Florida',
      zipCode: '33101',
    },
    bloodGroup: 'B+',
    emergencyContact: {
      name: 'Carlos Martinez',
      relationship: 'Father',
      phone: '+1-555-0106',
    },
  },
  {
    firstName: 'Noah',
    lastName: 'Garcia',
    email: 'noah.garcia@patient.com',
    phone: '+1-555-0107',
    dateOfBirth: new Date('1990-11-30'),
    gender: 'male',
    address: {
      street: '321 Elm Street',
      city: 'Austin',
      state: 'Texas',
      zipCode: '78701',
    },
    bloodGroup: 'AB+',
    emergencyContact: {
      name: 'Maria Garcia',
      relationship: 'Mother',
      phone: '+1-555-0108',
    },
  },
  {
    firstName: 'Ava',
    lastName: 'Rodriguez',
    email: 'ava.rodriguez@patient.com',
    phone: '+1-555-0109',
    dateOfBirth: new Date('1995-07-18'),
    gender: 'female',
    address: {
      street: '654 Birch Lane',
      city: 'Denver',
      state: 'Colorado',
      zipCode: '80201',
    },
    bloodGroup: 'O-',
    emergencyContact: {
      name: 'Luis Rodriguez',
      relationship: 'Brother',
      phone: '+1-555-0110',
    },
  },
  {
    firstName: 'Ethan',
    lastName: 'Wilson',
    email: 'ethan.wilson@patient.com',
    phone: '+1-555-0111',
    dateOfBirth: new Date('1987-12-05'),
    gender: 'male',
    address: {
      street: '987 Cedar Court',
      city: 'Portland',
      state: 'Oregon',
      zipCode: '97201',
    },
    bloodGroup: 'A-',
    emergencyContact: {
      name: 'Emily Wilson',
      relationship: 'Wife',
      phone: '+1-555-0112',
    },
  },
  {
    firstName: 'Sophia',
    lastName: 'Lee',
    email: 'sophia.lee@patient.com',
    phone: '+1-555-0113',
    dateOfBirth: new Date('1993-04-25'),
    gender: 'female',
    address: {
      street: '147 Willow Drive',
      city: 'San Diego',
      state: 'California',
      zipCode: '92101',
    },
    bloodGroup: 'B-',
    emergencyContact: {
      name: 'David Lee',
      relationship: 'Husband',
      phone: '+1-555-0114',
    },
  },
  {
    firstName: 'Mason',
    lastName: 'Taylor',
    email: 'mason.taylor@patient.com',
    phone: '+1-555-0115',
    dateOfBirth: new Date('1991-09-14'),
    gender: 'male',
    address: {
      street: '258 Spruce Avenue',
      city: 'Phoenix',
      state: 'Arizona',
      zipCode: '85001',
    },
    bloodGroup: 'AB-',
    emergencyContact: {
      name: 'Rachel Taylor',
      relationship: 'Sister',
      phone: '+1-555-0116',
    },
  },
  {
    firstName: 'Isabella',
    lastName: 'Brown',
    email: 'isabella.brown@patient.com',
    phone: '+1-555-0117',
    dateOfBirth: new Date('1989-06-08'),
    gender: 'female',
    address: {
      street: '369 Redwood Street',
      city: 'Chicago',
      state: 'Illinois',
      zipCode: '60601',
    },
    bloodGroup: 'O+',
    emergencyContact: {
      name: 'Michael Brown',
      relationship: 'Father',
      phone: '+1-555-0118',
    },
  },
  {
    firstName: 'Lucas',
    lastName: 'Davis',
    email: 'lucas.davis@patient.com',
    phone: '+1-555-0119',
    dateOfBirth: new Date('1994-02-20'),
    gender: 'male',
    address: {
      street: '741 Cypress Road',
      city: 'Atlanta',
      state: 'Georgia',
      zipCode: '30301',
    },
    bloodGroup: 'A+',
    emergencyContact: {
      name: 'Jennifer Davis',
      relationship: 'Mother',
      phone: '+1-555-0120',
    },
  },
];

const existingPatientsUpdates = [
  {
    email: 'patient@test.com',
    updates: {
      phone: '+1-555-0201',
      dateOfBirth: new Date('1990-01-15'),
      gender: 'male',
      address: {
        street: '100 Main Street',
        city: 'New York',
        state: 'New York',
        zipCode: '10001',
      },
      bloodGroup: 'O+',
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1-555-0202',
      },
    },
  },
  {
    email: 'emma@test.com',
    updates: {
      phone: '+1-555-0203',
      dateOfBirth: new Date('1988-06-20'),
      gender: 'female',
      address: {
        street: '200 Park Avenue',
        city: 'Los Angeles',
        state: 'California',
        zipCode: '90001',
      },
      bloodGroup: 'A+',
      emergencyContact: {
        name: 'Robert Wilson',
        relationship: 'Father',
        phone: '+1-555-0204',
      },
    },
  },
  {
    email: 'michael@test.com',
    updates: {
      phone: '+1-555-0205',
      dateOfBirth: new Date('1992-03-12'),
      gender: 'male',
      address: {
        street: '300 Broadway',
        city: 'San Francisco',
        state: 'California',
        zipCode: '94102',
      },
      bloodGroup: 'B+',
      emergencyContact: {
        name: 'Lisa Brown',
        relationship: 'Sister',
        phone: '+1-555-0206',
      },
    },
  },
  {
    email: 'sophia@test.com',
    updates: {
      phone: '+1-555-0207',
      dateOfBirth: new Date('1985-11-08'),
      gender: 'female',
      address: {
        street: '400 Fifth Avenue',
        city: 'Houston',
        state: 'Texas',
        zipCode: '77001',
      },
      bloodGroup: 'AB+',
      emergencyContact: {
        name: 'Mark Davis',
        relationship: 'Husband',
        phone: '+1-555-0208',
      },
    },
  },
  {
    email: 'oliver@test.com',
    updates: {
      phone: '+1-555-0209',
      dateOfBirth: new Date('1993-09-25'),
      gender: 'male',
      address: {
        street: '500 Market Street',
        city: 'Philadelphia',
        state: 'Pennsylvania',
        zipCode: '19101',
      },
      bloodGroup: 'O-',
      emergencyContact: {
        name: 'Karen Martinez',
        relationship: 'Mother',
        phone: '+1-555-0210',
      },
    },
  },
  {
    email: 'ava@test.com',
    updates: {
      phone: '+1-555-0211',
      dateOfBirth: new Date('1991-07-30'),
      gender: 'female',
      address: {
        street: '600 State Street',
        city: 'Detroit',
        state: 'Michigan',
        zipCode: '48201',
      },
      bloodGroup: 'A-',
      emergencyContact: {
        name: 'Thomas Taylor',
        relationship: 'Brother',
        phone: '+1-555-0212',
      },
    },
  },
  {
    email: 'william@test.com',
    updates: {
      phone: '+1-555-0213',
      dateOfBirth: new Date('1987-04-18'),
      gender: 'male',
      address: {
        street: '700 Washington Street',
        city: 'Dallas',
        state: 'Texas',
        zipCode: '75201',
      },
      bloodGroup: 'B-',
      emergencyContact: {
        name: 'Amanda Anderson',
        relationship: 'Wife',
        phone: '+1-555-0214',
      },
    },
  },
  {
    email: 'isabella@test.com',
    updates: {
      phone: '+1-555-0215',
      dateOfBirth: new Date('1994-12-03'),
      gender: 'female',
      address: {
        street: '800 Jefferson Avenue',
        city: 'Nashville',
        state: 'Tennessee',
        zipCode: '37201',
      },
      bloodGroup: 'AB-',
      emergencyContact: {
        name: 'Christopher Thomas',
        relationship: 'Father',
        phone: '+1-555-0216',
      },
    },
  },
];

async function updatePatientsData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/virtual_medical_home');
    console.log('✅ Connected to MongoDB\n');

    const hashedPassword = await bcrypt.hash('test123', 10);
    let newCount = 0;
    let updateCount = 0;

    // Add new patients
    console.log('📝 Adding new patients...');
    for (const patient of newPatients) {
      const existingUser = await User.findOne({ email: patient.email });
      if (existingUser) {
        console.log(`⏭️  ${patient.email} already exists, skipping...`);
        continue;
      }

      await User.create({
        ...patient,
        password: hashedPassword,
        role: 'patient',
        isActive: true,
      });
      newCount++;
      console.log(`✅ Created: ${patient.firstName} ${patient.lastName} (${patient.email})`);
    }

    console.log('\n📝 Updating existing patients...');
    // Update existing patients
    for (const update of existingPatientsUpdates) {
      const user = await User.findOne({ email: update.email });
      if (!user) {
        console.log(`⚠️  User ${update.email} not found, skipping...`);
        continue;
      }

      await User.updateOne(
        { email: update.email },
        { $set: update.updates }
      );
      updateCount++;
      console.log(`✅ Updated: ${user.firstName} ${user.lastName} (${update.email})`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ New patients added: ${newCount}`);
    console.log(`✅ Existing patients updated: ${updateCount}`);
    console.log(`📋 Total patients in database: ${await User.countDocuments({ role: 'patient' })}`);
    console.log('='.repeat(60));
    console.log('\n✨ All patients now have complete details!');
    console.log('\n📌 All patients can login with password: test123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updatePatientsData();
