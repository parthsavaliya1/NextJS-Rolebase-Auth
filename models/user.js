import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" }, // Reference to Role model
  createdAt: { type: Date, default: Date.now },
});

if (mongoose.models.User) {
  module.exports = mongoose.models.User;
} else {
  module.exports = mongoose.model("User", UserSchema);
}
