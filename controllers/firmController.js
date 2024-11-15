const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');

// configure storage for uploading images (Multer, Standard)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Destination folder where the uploaded images will be stored.
    },
    filename: function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      //cb(null, uniqueSuffix + path.extname(file.originalname)); // Generating a unique filename.
      cb(null,Date.now()+ path.extname(file.originalname));
    }
  });
const upload = multer({storage: storage});

const addFirm = async(req,res)=>{

    try{const {firmName, area,category, region,offer}= req.body;
    const image = req.file? req.file.filename: undefined;
    const vendor = await Vendor.findById(req.vendorId);
    if(!vendor){
        res.status(404).json({message:"Vendor not found"})
    }
    const firm = new Firm({
        firmName, area,category, region,offer, image, vendor: vendor._id
    })
   
    const savedFirm = await firm.save();
    
    vendor.firm.push(savedFirm);
    await vendor.save()


    return res.status(200).json({message:"Firm added succesfully"});
}
    catch(error){
    console.error(error)
    return res.status(500).json({message:"Internal Server error"});
    }   
}

const deleteFirmById = async(req,res)=>{
  try{
    const firmId = req.params.firmId;
    const deletedFirm = await Firm.findByIdAndDelete(firmId);

    if(!deletedFirm){
        return res.status(404).json({error: "No firm found"});
    }
}
catch(error){
    console.error(error);
    res.status(500).json({error:"Internal server error"});

}
}

module.exports =  {addFirm: [upload.single('image'), addFirm], deleteFirmById};