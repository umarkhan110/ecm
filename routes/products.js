const express = require('express')
const router = express.Router();
const Products = require('../model/Products');
const multer = require('multer');
const path = require('path');
const Authenticate = require("../midleware/Authentication");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
// Create New Product
router.post('/additem', upload.single("image"),async (req, res) => {
    const { name, price, description, category} = req.body;
    const image = (req.file) ? req.file.filename : null;
    
    try {
        const item = new Products({name, price, description, category, image});
        const saveitem = await item.save();
        return res.status(200).json({ message: "Product Added" });
    } catch (error) {
        console.log(error);
    }
})

// Get Products
router.get('/showitems', async (req, res) => {
    try {
        const items = await Products.find();
        res.json(items)
        
    } catch (error) {
        console.log(error);
    }
})

// Get Item by id
router.get('/edit/:id', async (req, res) => {
    try {
        const items = await Products.findById( req.params.id);
        res.json(items)
        console.log(items)
    } catch (error) {
        console.log(error);
    }
})


// Update Item
router.put('/updateitem/:id', async (req, res) => {
    try {
        
        const item = await Products.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    "name": req.body.name,
                    "price":  req.body.price,
                    "description":req.body.description,
                    "category":req.body.category,
                    "image":req.body.image,
                }
            },{new:true});
            res.json(item)

    } catch (error) {
        console.log(error);
    }
})

// Delete Item
router.delete('/deleteitem/:id',async (req,res)=>{
    try {
        const del = await Products.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Item Deleted" });
    } catch (error) {
     console.log(error)   
    }
})

module.exports = router;