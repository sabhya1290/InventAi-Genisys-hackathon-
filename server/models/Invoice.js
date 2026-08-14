import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    invoice_date: { type: Date, default: Date.now },
    total_amount: { type: Number, required: true },
    payment_status: {
      type: String,
      enum: ['Unpaid', 'Paid', 'Partially Paid'],
      default: 'Unpaid',
    },
    payment_method: { type: String, default: 'N/A' },
  },
  { timestamps: true }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
