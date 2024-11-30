import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" }, // Reference to Role model
  createdAt: { type: Date, default: Date.now },
});

// To handle reloading and prevent model re-definition during hot reloads
if (mongoose.models.User) {
  // If the User model is already defined, use it.
  module.exports = mongoose.models.User;
} else {
  // Otherwise, define and export the model
  module.exports = mongoose.model("User", UserSchema);
}
