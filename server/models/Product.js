import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    purchase_price: { type: Number, required: true, min: 0 },
    selling_price: { type: Number, required: true, min: 0 },
    stock_quantity: { type: Number, required: true, min: 0, default: 0 },
    reorder_threshold: { type: Number, required: true, min: 0, default: 10 },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock',
    },
  },
  { timestamps: true }
);

// Auto-calculate status based on stock
productSchema.pre('save', function (next) {
  if (this.stock_quantity === 0) {
    this.status = 'Out of Stock';
  } else if (this.stock_quantity <= this.reorder_threshold) {
    this.status = 'Low Stock';
  } else {
    this.status = 'In Stock';
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
