import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { User } from '../models/user.model.js';

dotenv.config()

export const protectRoute = async (req , res , next) => {
 try {
   const token = req.cookies.accessToken;
   if(!token ) return res.status(401).json({
     error: true,
     message: "Token not found."
    })
    
    const decoded = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decoded.userId).select('-password')
    if(!user) return res.status(401).json({
      error: true,
      message: "User not authenticated."
    })
    
    req.user = user
   next()
 } catch (error) {
  console.log("Error in protect route middleware" , error.message)
 }
}

export const adminRoute = async (req , res , next) => {
 try {
   if(req.user && req.user.role === 'admin') next()
   return res.status(401).json({
    error:true,
    message:'Access denied Admin-only.'
  })
 } catch (error) {
  console.log("Error in admin route middleware." , error.message)
 }
}