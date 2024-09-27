import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"


dotenv.config()

const generateAccessTokenAndRefreshToken = (userId) => {
  const accessToken = jwt.sign({ userId } , process.env.ACCESS_TOKEN_SECRET)
  const refreshToken = jwt.sign({userId} , process.env.REFRESH_TOKEN_SECRET)
  
  return {accessToken , refreshToken}
}

const setCookies = (res , accessToken , refreshToken) => {
  res.cookie("accessToken" , accessToken , {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000
  })
  res.cookie("refreshToken" , refreshToken , {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
}

export const userSignup = async(req , res ) => {
  const { name , email , password } = req.body
try {
  if(!(name || email || password)) res.status(401).json({
    error: true , 
    message: "All fields are required"
  })
  
  const existingUser = await User.findOne({ email })
  if(existingUser) res.status(401).json({
    error: true , 
    message: "User already exists"
  })

  const newUser = new User({
    name,
    email,
    password
  })

  await newUser.save()

  const {accessToken , refreshToken} = generateAccessTokenAndRefreshToken(newUser._id)

  setCookies(res , accessToken , refreshToken)

  res.status(200).json({
    error: false , 
    User: newUser ,
    message: "User created successfully"
  })

} catch (error) {
  console.log("Error in userSignup", error.message)
}
}


export const userLogin = async (req , res) => {
  try {
    const {email , password} = req.body;
  
    if(!(email || password)) res.status(401).json({
      error:true,
      message:"All fields are mandatory."
    })
  
    const user = await User.findOne({email})
    if(!user) res.status(401).json({
      error:true,
      message:"User doesn't exists."
    })
    
    const checkPassword = await user.comparePassword(password)
  
    if(!checkPassword) res.status(401).json({
      error:true,
      message:"Password Invalid."
    })
  
    const {accessToken , refreshToken} = generateAccessTokenAndRefreshToken(user._id)
    setCookies(res , accessToken ,refreshToken)
  
    res.status(200).json({
      error: false,
      user,
      message: "User logged in successfully."
    })
} catch (error) {
  console.log("Error in logging in User" , error.message)
}

}



export const userLogout = async (req , res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken) jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET)
    
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    res.status(200).json({
      error:false,
      message:"User logged out successfully"
    })
  } catch (error) {
   console.log("Error in logigng out user." , error.message) 
  }
}