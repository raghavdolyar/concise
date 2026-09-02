import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  long_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

urlSchema.index({ long_url: 1, user: 1 });

const Url = mongoose.model('Url', urlSchema);

export default Url;
