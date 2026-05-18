import userModel from '../models/user.model.js'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import sessionModel from '../models/session.model.js'
import {sendEmail} from '../services/email.service.js'
import {generateOtp,getOtpHtml} from "../utils/util.js"
import otpModel from "../models/otp.model.js"

export async function register(req,res) {
    const{username,email,password}=req.body;

    const isAlreadyRegistered = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(isAlreadyRegistered){
        return res.status(409).json({
            message:"username or email already exists."
        })
    }
    
    const hashedPswd= await bcrypt.hash(password,10)
    const user = await userModel.create({
        username,
        email,
        password:hashedPswd,
    })

    const otp = generateOtp();
    const otpHtml = getOtpHtml(otp);

    const otpHash= crypto.createHash('sha256').update(otp).digest("hex");
    await otpModel.create({
        email,
        user:user._id,
        otpHash
    })

    await sendEmail(email,"OTP verification",`Your OTP for ANTHRIX is ${otp}`,otpHtml) 


    res.status(201).json({
        message:"registered successfully", 
        user:{
            username : user.username,
            email:user.email,
            verified: user.verified
        }
    })
    

}

export async function login(req,res) {

    const {email,password} = req.body;

    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(401).json({
            message:"invalid email or password"
        })
    }

    if(!user.verified){
         return res.status(401).json({
            message:"Email not verified"
        })
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    )
    
    if(!isPasswordValid){
        return res.status(401).json({
            message:"invalid email or password"
        })
    }
    
    const refreshtoken = jwt.sign({
        id:user._id
    },config.JWT_SECRET,{
        expiresIn:'7d'
    })

    const refreshTokenHash = crypto.createHash('sha256').update(refreshtoken).digest("hex") ;

    const session = await sessionModel.create({
        user:user,
        refreshTokenHash,
        ip:req.ip,
        userAgent: req.headers["user-agent"]

    })

    const accesstoken=jwt.sign({
        id:user._id,
        sessionId : session._id
    },config.JWT_SECRET,{
        expiresIn:'15m'
    })


    res.cookie("refreshToken",refreshtoken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",        
        maxAge: 7*24*60*60*1000

    })


    res.status(201).json({
        message:"logged in  successfully", 
        user:{
            username : user.username,
            email:user.email
        },
        accesstoken
    })


    

    
}

export async function getMe(req,res){
    const token = req.headers.authorization?.split(" ")[ 1 ]   
    // in header--> {authourization=Bearer token}-----> [Bearer,Token] split based on space and obtain token at index1
    if(!token){
        return res.status(401).json({
            message:"token not found"
        })
    }

    const decoded=jwt.verify(token,config.JWT_SECRET)
    console.log(decoded)

    const user = await userModel.findById(decoded.id)
    console.log(user)
    res.status(200).json({
        message:"user fetched successfully",
        user:{
            username : user.username,
            email:user.email
        }
    })

}

export async function refreshToken(req,res){
    const refreshToken=req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({
            message:"refresh Token not found"
        })
    }

    const decodeRefresh=jwt.verify(refreshToken,config.JWT_SECRET)
    const refreshTokenHash=crypto.createHash("sha256").update(refreshToken).digest("hex")


    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked:false
    })

    if(!session){
        return res.status(400).json({
            message:"invalid refresh token"
        })

    }


    const accesstoken=jwt.sign({
        id:decodeRefresh.id
    },config.JWT_SECRET,{
        expiresIn:"15m"
    })
    
    const newRefreshToken=jwt.sign({
        id:decodeRefresh.id
    },config.JWT_SECRET,{
        expiresIn:"15m"
    })

    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex")
    session.refreshTokenHash=newRefreshTokenHash;
    await session.save();





    res.cookie("refreshToken",newRefreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",        
        maxAge: 7*24*60*60*1000
    })

    res.status(200).json({
        message:"access token created",
        accesstoken
    })
        
}

export async function logOut(req,res){
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(400).json({
            message:"refreshToken not Found" 
        })
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked:false
    })

    if(!session){
        return res.status(400).json({
            message:"Invalid refresh token"
        })
    }

    session.revoked =true;
    await session.save();

    res.clearCookie("refreshToken")

    res.status(200).json({
        message:"Logged out successfully"
    })



}

export async function logOutAll(req,res) {

    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(400).json({
            message:"refreshToken not Found" 
        })
    }

    const decoded=jwt.verify(refreshToken,config.JWT_SECRET)
    await sessionModel.updateMany({
        user : decoded.id,
        revoked:false
    },{
        revoked:true
    })

    res.clearCookie("refreshToken")

    res.status(200).json({
        message:"logged out from all devices"
    })

    
}

export async function verifyEmail(req,res){
    const {otp,email}=req.body;

    const otpHash= crypto.createHash('sha256').update(otp).digest("hex");

    const otpDoc = await otpModel.findOne({
        email,
        otpHash
    })
    
    if(!otpDoc){
         return res.status(400).json({
            message:"invalid OTP"
        })
    }

    const user = await userModel.findByIdAndUpdate(otpDoc.user,{
        verified:true
    })

    await otpModel.deleteMany({
        user: otpDoc.user
    })

    return res.status(200).json({
        message:"Email verified successfully",
        user:{
            username: user.username,
            email:user.email,
            verified:user.verified
        }
    })
}