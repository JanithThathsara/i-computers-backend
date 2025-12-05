import express from 'express'
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/productController.js'

const productRouter = express.Router()

productRouter.post("/", createProduct)
productRouter.get("/", getProducts)

productRouter.get("/trending", (req, res)=> {
    res.status(200).json({message: "trending products"})
})

productRouter.delete("/:productId", deleteProduct)
productRouter.put("/:productId", updateProduct)
productRouter.get("/:productId", getProductById)

export default productRouter