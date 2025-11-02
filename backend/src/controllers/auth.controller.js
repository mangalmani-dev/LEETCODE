import bcrypt from "bcryptjs"
import {db} from "../libs/db.js"
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken"


 export const register = async(req,res)=>{

    const {email ,password,name}=req.body
      
    try {
       // validation for input
    if (!email || !password || !name) {
  return res.status(400).json({
    success: false,
    message: "All fields (name, email, password) are required",
  });
}
  
const existingUser=await db.user.findUnique({
    where:{
        email
    }
})

if(existingUser){
    return res.status(400).json({
        error :"user already exist"
    })
}
   
const hashedPassword=await bcrypt.hash(password ,10)

const newUser=await db.user.create({
    data:{
    email,
    password:hashedPassword,
    name,
    role :UserRole.USER
    }
})

const token=jwt.sign({id:newUser.id},process.env.JWT_SECRET,{
    expiresIn :"7d"
})

res.cookie("jwt",token,{
    httpOnly:true,
    sameSite:"strict",
    secure:process.env.NODE_ENV !== "development",
    maxAge:1000*60*60*24*7
})

res.status(201).json({
    success:true,
    message :"User created successfully",
    user:{
        id:newUser.id,
        email:newUser.email,
        name:newUser.name,
        role:newUser.role,
        image:newUser.image
    }
})
    } catch (error) {
        console.error("error in creating user",error)
        res.status(500).json({
            error :"error in crating user"
        })
    }
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2️⃣ Find user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 4️⃣ Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 5️⃣ Set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // 6️⃣ Send response
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      success: false,
      message: "error during login",
    });
  }
};

export const logout = async(req,res)=>{
   try {
    res.clearCookie("jwt",{
        httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    })

    res.status(200).json({
        success:true,
        message :"logout successfull"
    })
   } catch (error) {
      console.error("error in logout",error)
       res.status(500).json({
      success: false,
      message: "error logout",
    });
   }
    
}

export const check  = async(req,res)=>{

    try {
        res.status(200).json({
            success:true,
            message :"user authencated successfully",
            user:req.user
        })
        
    } catch (error) {
        console.error("error in check",error)
        res.status(500).json({
            message :"error in check user"
        })
    }
}