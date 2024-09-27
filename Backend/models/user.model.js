import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["coustomer", "admin"],
    default: "coustomer",
  },
  cartItems: [
    {
      quantity: {
        type: Number,
        default: 1,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    },
  ],
},
{
  timestamps: true
});

userSchema.pre("save" , async function (next) {
  if(!this.isModified("password"))  next()
  
  this.password = await bcrypt.hash(this.password , 10)
  next()
})

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password , this.password)
}

export const User = mongoose.model("User" , userSchema)