import mongoose from 'mongoose';

const furnitureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  priceMonthly: { type: Number, required: true },
  image: { type: String },
  subscriptionEnd: { type: Date }
});

const Furniture = mongoose.models.Furniture || mongoose.model('Furniture', furnitureSchema);
export default Furniture;
