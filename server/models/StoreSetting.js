import mongoose from 'mongoose';

const storeSettingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, default: 'My Store' },
    currency: { type: String, default: 'INR' },
    address: { type: String, default: '' },
    gst: { type: String, default: '' },
  },
  { timestamps: true }
);

const StoreSetting = mongoose.model('StoreSetting', storeSettingSchema);
export default StoreSetting;
