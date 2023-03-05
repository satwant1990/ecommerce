import catchAsyncError from '../middlewares/catchAsync.js'
import Product from '../models/productModel.js'
import ErrorHandler from '../utils/errorHandler.js';
import ProductApiFeatures from '../utils/features.js';

//Get All Products
export const getAllProducts = catchAsyncError(async (req, resp, next) => {
    const resultPerPage = 5;
    const productApi = await new ProductApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)
    const products = await productApi.query;
    const totalProduct = products.length;
    resp.status(200).json({
        success: true,
        totalProduct,
        products
    })
})

//Get Single product
export const getSingleProduct = catchAsyncError(async (req, resp, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 400))
    }
    resp.status(201).json({
        success: true,
        product
    })
})

//Create new product

export const addProduct = catchAsyncError(async (req, resp, next) => {
    const { name, description, brand, category, price, stock } = req.body;
    const product = await Product.create({
        user: req.user._id, name, description, brand, category, price, stock
    })
    resp.status(201).json({
        success: true,
        message: "Product added successfully",
        product
    })

})

//Update Product
export const updateProduct = catchAsyncError(async (req, resp, next) => {
    const id = req.params.id;
    const { name, description, category, price, stock } = req.body;
    let product = await Product.findById(id)
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 400))
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price) product.price = price;
    if (stock) product.stock = stock;

    await product.save();

    resp.status(201).json({
        success: true,
        message: "Product updated successfully",
        product
    })

})

export const deleteProduct = catchAsyncError(async (req, resp, next) => {
    const id = req.params.id;

    let product = await Product.findById(id)
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 400))
    }
    await product.deleteOne();
    resp.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})

//Add or update Review
export const addProductReview = catchAsyncError(async (req, resp, next) => {
    const { productID, rating, comment } = req.body
    if (!productID) {
        return next(new ErrorHandler("Please provide product id", 400))
    }

    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productID)
    if (!product) {
        return next(new ErrorHandler("Product not found!", 400))
    }

    const isReview = product.reviews.find(review => review.user.toString() === req.user.id)
    if (isReview) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user.id) {
                rev.rating = rating
                rev.comment = comment
            }
        })
    }
    else {
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }
    let proAvg = 0
    let total_rat = product.reviews.map((rev) => {
        return proAvg += rev.rating
    })

    product.ratings = total_rat / product.reviews.length;
    await product.save({ validateBeforeSave: false })
    resp.status(200).json({
        success: true,
        message: "Rating Added"
    })
})

//Get All Product Reivew
export const getAllProReview = catchAsyncError(async (req, resp, next) => {
    const { id } = req.query;
    const product = await Product.findById(id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 400))
    }
    resp.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

//Get All Product Reivew
export const deleteProReview = catchAsyncError(async (req, resp, next) => {
    const { productId } = req.query;
    const product = await Product.findById(productId)
    if (!product) {
        return next(new ErrorHandler("Product not found", 400))
    }
    const reviews = product.reviews.filter((rev) => {

        return rev._id.toString() !== req.query.reviewId.toString();
    })

    let total_rat = reviews.reduce((acc, cur) => {
        acc = acc.rating + cur.rating
        return acc
    })

    const ratings = total_rat / reviews.length;
    const numOfReviews = reviews.length

    await Product.findByIdAndUpdate(productId, {
        ratings,
        numOfReviews,
        reviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    resp.status(200).json({
        success: true,
        message: "Reivew deleted successfully"
    })
})




