import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req, res){

    if(!isAdmin(req)) {
        res.status(403).json({message : "Access denied . Admin only"})
        return;
    }

    // creating a product
    try {
        
        const existingProduct = await Product.findOne({
            productId : req.body.productId
        })

        if(existingProduct) {
            res.status(400).json({message : "product with given productId already exists"})
            return
        }

        const data = {}

        data.productId = req.body.productId;
        if(req.body.name == null ) {
            res.status(400).json({message : "product name is required"})
            return
        }
        data.name = req.body.name;

        data.description = req.body.description || ""

        data.altNames = req.body.altNames || []

        if(req.body.price == null) {
            res.status(400).json({message : "product price has be required"})
            return
        }
        data.price = req.body.price

        data.labelledPrice = req.body.labelledPrice || req.body.price

        data.category = req.body.category || "others"

        data.images = req.body.images || ["/images/default-product.png","/images/default-product-2.png"]

        data.isVisible = req.body.isVisible

        data.brand = req.body.brand || "Generic"

        data.model = req.body.model || "Standard"

        const newProduct = new Product(data);

        await newProduct.save();

        res.status(201).json({message :"product created successfully", product: newProduct})

    }catch(error) {
        res.status(500).json({message : "error creating product", error : error})
    }   
}

// get all products

export async function getProducts(req, res) {

    try{

        if(isAdmin(req)) {
            const products = await Product.find({})
            res.status(200).json({products})
        }else{
            const products =  await Product.find({isVisible : true})
            res.status(200).json({products})
        }

    }catch(error){
        res.status(500).json({message : "error fetching products", error : error})
    }
}

// delete a product

export async function deleteProduct(req, res) {

    if(!isAdmin(req)) {

        res.status(403).json({message : "Access denied . Admin only"})
        return
    }

    try{

        const productId = req.params.productId

        await Product.deleteOne({productId : productId})

        res.status(200).json({message : "product delete successfully"})

    }catch(error){
        res.status(500).json({message : "error deleting products", error, error})
        return
    }

}

//update product

export async function updateProduct(req, res) {

    if(!isAdmin(req))  { 
        res.status(403).json({message : "access denied . Admin only"})
        return
    }

     try {

        const productId = req.params.productId

        const data = {}

        if(req.body.name == null ) {
            res.status(400).json({message : "product name is required"})
            return
        }
        data.name = req.body.name;

        data.description = req.body.description || ""

        data.altNames = req.body.altNames || []

        if(req.body.price == null) {
            res.status(400).json({message : "product price has be required"})
            return
        }
        data.price = req.body.price

        data.labelledPrice = req.body.labelledPrice || req.body.price

        data.category = req.body.category || "others"

        data.images = req.body.images || ["/images/default-product.png","/images/default-product-2.png"]

        data.isVisible = req.body.isVisible

        data.brand = req.body.brand || "Generic"

        data.model = req.body.model || "Standard"

        await Product.updateOne({productId : productId}, data)

        res.status(201).json({message :"product updated successfully"})

    }catch(error) {
        res.status(500).json({message : "error updating product", error : error})
    }   
}

//get single product details

export async function getProductById(req, res) {

    try {

        const productId =  req.params.productId

        const product =  await Product.findOne({productId : productId})

        if(product == null){
            res.status(404).json({message : "product not found"})
        }

        if(!product.isVisible) { 
            if(!isAdmin(req)) {
                res.status(404).json({message : "product not found"})
                return
            }
        }
        res.status(200).json({product})

    }catch(error) {
        res.status(500).json({message : "error fetching product details", error : error})
    }
}

export async function searchProducts() {

}