import userModel from "../models/user.model.js"
import { sendEmail } from "../services/mail.service.js"
import jwt from "jsonwebtoken"

export async function register(req,res){
    const {username,email,password} = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(isUserAlreadyExists)
    {
        return res.status(400).json({
            message : "User already exists",
            success: false,
            err:"User already exists"
        })
    }

    const user = await userModel.create({
        username,
        email,
        password  
    })

    const emailVerificationToken = jwt.sign({
        userId:user._id,
        email:user.email
    },process.env.JWT_SECRET,{expiresIn:"24h"})

    //res.cookie("token",emailVerificationToken)

    const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${encodeURIComponent(emailVerificationToken)}`
    try {
        await sendEmail({
            to: email,
            subject: "Welcome to QueryFlow!",
            html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>QueryFlow</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="${verificationUrl}">Verify Email</a>
                <p>If you did not sign up for this account, please ignore this email.</p>
                <p>Thank you,<br>The QueryFlow Team</p>
                
                
                
            `
        })
    } catch (error) {
        // Local development often has no mail credentials. Return the verification
        // link so the account created above can still be activated during testing.
        if (process.env.NODE_ENV === "production") {
            console.error("Verification email could not be sent:", error?.message || error)
        }
    }

    res.status(201).json({
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        },
        message: "User registered successfully. Verify your email before logging in.",
        ...(process.env.NODE_ENV !== "production" ? { verificationUrl } : {})
    });
}



export async function verifyEmail(req,res)
{
    const {token} = req.query
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"

    if (!token) {
        return res.status(400).json({
            message: "Invalid Token",
            success: false,
            err: "Token is required"
        })
    }

    const verificationhtml = `
        <h1>Verification Link Expired</h1>
        <p>This verification link is no longer valid.</p>
        <p>Please request a new verification email and try again.</p>
    `
    const Invalidverificationhtml = `
        <h1>Invalid Verification Link</h1>
        <p>This verification link is invalid or broken.</p>
        <p>Please check your email link or request a new verification email.</p>
    `

    let decoded 
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch(err){
        if(err.name ==="TokenExpiredError")
        {
            return res.status(400).send(verificationhtml)
        }
        else{
            return res.status(400).send(Invalidverificationhtml)
        }
    }

    const user = await userModel.findOne({ email: decoded.email })

    if(!user)
    {
        return res.status(400).json({
            message : "Invalid Token",
            success: false,
            err: "User not found"
        })
    }

   
    if(user.verified == true)
    {
        const alreadylogin =`
            <h1>Email Already Verified</h1>
            <p>Your email address has already been verified.</p>
            <a href="${frontendUrl}/login">Go to Login</a>
        `
        return res.send(alreadylogin)

    }
    else
    {
        user.verified = true

    await user.save();

    const html =`
        <h1>Email Verified Successfully</h1>
        <p>Thank you for verifying your email address. Your account is now active.</p>
        <p>You can now log in to your account and start using our services.</p>
        <a href="${frontendUrl}/login">Go to Login</a>
    `
    res.send(html)

    }
     
}


export async function login(req,res)
{
    const {email,password} = req.body

    const user = await userModel.findOne({email}).select("+password")

    if(!user)
    {
        return res.status(400).json({
            message: "Invalid Credentials",
            success:false,
            err: "User not found"
        })
    }

    if(!user.verified)
    {
        return res.status(400).json({
            message: "Email not verified",
            success:false,
            err:"Please verify your email before logging in"
        })
    }

    const isPasswordValid = await user.comparePassword(password)

    if(!isPasswordValid)
    {
        return res.status(400).json({
            message: "Invalid Credentials",
            success:false,
            err:"Password is incorrect"
        })
    }

    const token = jwt.sign({
        userId: user._id,
        username: user.username,
        email:user.email
    },process.env.JWT_SECRET,{expiresIn:"1h"})

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: 60 * 60 * 1000
    })

    res.status(200).json({
        message:"Login successful",
        success:true,
        err:null,
        user:{
            id : user._id,
            username : user.username,
            email : user.email
        }
    })


}


export async function getMe(req,res)
{
    const userId = req.user.userId

    const user = await userModel.findById(userId)

    if(!user)
    {
        return res.status(404).json({
            message:"User not found",
            success:false,
            err:"User not found"
        })
    }

    res.status(200).json({
        message : "user data fetch successfully",
        success:true,
        user
    })


}

export async function resendVerificationEmail(req,res)
{
    const {email} = req.body

    if(!email)
    {
        return res.status(400).json({
            message :"Email is required",
            success:false,
            err:"Email not given"
        })
    }

    const user = await userModel.findOne({email})

    if(!user)
    {
        return res.status(200).json({
            message : "If this email exists, a verification email has been sent",
            success:true,
            err:null
        })
    }

    if(user.verified == true)
    {
        return res.status(200).json({
            message : "Email already verified",
            success:true,
            err:null
        })
    }
    else{

        const token = jwt.sign({
        userId: user._id,
        username: user.username,
        email:user.email
    },process.env.JWT_SECRET,{expiresIn:"24h"})


    await sendEmail({
        to: email,
        subject: "Welcome to QueryFlow!",
        html: `
                <p>Hi ${user.username},</p>
                <p>Thank you for registering at <strong>QueryFlow</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${token}">Verify Email</a>
                <p>If you did not sign up for this account, please ignore this email.</p>
                <p>Thank you,<br>The QueryFlow Team</p>
                
                
                
        `
    })



    }

    res.status(200).json({
        message: "Verification email sent successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });

}
