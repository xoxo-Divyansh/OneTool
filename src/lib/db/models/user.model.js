import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },

      email: {
         type: String,
         required: true,
         unique:true,
         lowercase:true,
         index: true,
      },

      passwordHash: {
      type: String,
      required: true,
    },

    avatar: String,

    role: {
      type:String,
      enum: ["user","admin"],
      default: "user",
    },

      authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: Date,
   },
   { timestamps: true }
);

export default mongoose.models.User ||
mongoose.model("User", UserSchema);
