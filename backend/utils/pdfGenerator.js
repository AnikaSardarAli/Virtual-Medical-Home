const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePrescriptionPDF = async (prescription, patient, doctor) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const fileName = `prescription-${prescription._id}.pdf`;
      const filePath = path.join(__dirname, '../uploads', fileName);

      // Pipe the PDF to a file
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(24).text('Virtual Medical Home', { align: 'center' });
      doc.fontSize(12).text('Medical Prescription', { align: 'center' });
      doc.moveDown();

      // Line separator
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Patient Information
      doc.fontSize(14).text('Patient Information:', { underline: true });
      doc.fontSize(11);
      doc.text(`Name: ${patient.firstName} ${patient.lastName}`);
      doc.text(`Email: ${patient.email}`);
      doc.text(`Phone: ${patient.phone}`);
      doc.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`);
      doc.moveDown();

      // Doctor Information
      doc.fontSize(14).text('Doctor Information:', { underline: true });
      doc.fontSize(11);
      doc.text(`Dr. ${doctor.firstName} ${doctor.lastName}`);
      doc.text(`Specialization: ${doctor.specialization}`);
      doc.text(`License: ${doctor.licenseNumber}`);
      doc.moveDown();

      // Diagnosis
      doc.fontSize(14).text('Diagnosis:', { underline: true });
      doc.fontSize(11).text(prescription.diagnosis);
      doc.moveDown();

      // Medicines
      doc.fontSize(14).text('Prescribed Medicines:', { underline: true });
      doc.moveDown(0.5);

      prescription.medicines.forEach((medicine, index) => {
        doc.fontSize(12).text(`${index + 1}. ${medicine.name}`, { bold: true });
        doc.fontSize(10);
        doc.text(`   Dosage: ${medicine.dosage}`);
        doc.text(`   Frequency: ${medicine.frequency}`);
        doc.text(`   Duration: ${medicine.duration}`);
        if (medicine.instructions) {
          doc.text(`   Instructions: ${medicine.instructions}`);
        }
        doc.moveDown(0.5);
      });

      // Additional Notes
      if (prescription.additionalNotes) {
        doc.moveDown();
        doc.fontSize(14).text('Additional Notes:', { underline: true });
        doc.fontSize(11).text(prescription.additionalNotes);
      }

      // Tests
      if (prescription.tests && prescription.tests.length > 0) {
        doc.moveDown();
        doc.fontSize(14).text('Recommended Tests:', { underline: true });
        prescription.tests.forEach((test, index) => {
          doc.fontSize(11).text(`${index + 1}. ${test.testName}`);
          if (test.instructions) {
            doc.fontSize(10).text(`   ${test.instructions}`);
          }
        });
      }

      // Follow-up
      if (prescription.followUpDate) {
        doc.moveDown();
        doc.fontSize(11).text(`Follow-up Date: ${new Date(prescription.followUpDate).toLocaleDateString()}`);
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(10).text('This is a digitally generated prescription.', { align: 'center' });
      doc.text('Virtual Medical Home - Your Health, Our Priority', { align: 'center' });

      // Finalize PDF
      doc.end();

      stream.on('finish', () => {
        resolve(fileName);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generatePrescriptionPDF,
};
