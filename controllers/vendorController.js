const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv= require('dotenv')

dotEnv.config();

const secretKey = process.env.WhatIsYourName;

//capture vendor details from the form, use jwt authentication and hashing password
const vendorRegister = async(req,res)=>{
    const {username, email,password} = req.body;
    try{
        const vendorEmail = await Vendor.findOne({email});
        if(vendorEmail){
            return res.status(400).json("Email already taken");
        }
        const hashedPassword = await bcrypt.hash(password,10);
        
        //To store input values from the body in database, create an instance and store values as records in db through instance.
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword});
        await newVendor.save();

        res.status(201).json({message: "Vendor registered successfully"});
        console.log('registered');

    }catch(error){
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }
}

const vendorLogin = async(req,res)=>{
    const{email,password} = req.body;
try{
    const vendor = await Vendor.findOne({email}) //get email saved in vendor register
    if(!vendor || !(await bcrypt.compare(password, vendor.password))){
        return res.status(401).json({error: "Invalid username or password"});
    }
    const token = jwt.sign({vendorId: vendor._id},secretKey,{expiresIn: "1d"});
    res.status(200).json({success:"Login successful", token});
    console.log(email, "this is token",token);
}catch(error){
    res.status(500).json({error:"Internal Server error"});
}
}

const getAllVendors = async(req,res)=>{
    try{
        const vendors = await Vendor.find().populate('firm');
        res.json({vendors});
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Internal Server error"});
    }
}

const getVendorById = async(req,res)=>{
    const vendorId =   req.params.apple;         // query params means endpoints
    try{
        const vendor = await Vendor.findById(vendorId).populate('firm'); //.populate is used to show all details in firm.
        if(!vendor){
            return res.status(404).json({error: "vendor not found"});
        }
        res.status(200).json({vendor});
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Internal Server error"});
    }

}

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById }