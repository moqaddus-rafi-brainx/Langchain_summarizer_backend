import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const SummaryModel = mongoose.model('Summary', summarySchema);

export default SummaryModel; 