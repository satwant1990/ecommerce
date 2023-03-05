import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: [true, "Please enter Product Title"]
    },
    description: {
        type: String,
        required: [true, "Please enter product Description"]
    },
    image: [
        {
            public_id: {
                type: String,
                required: true,
            },
            public_url: {
                type: String,
                required: true,
            }
        }
    ],
    brand: {
        type: String,
        required: [true, "Please enter Product Brand"],
    },
    category: {
        type: String,
        required: [true, "Please enter Product Category"],
    },
    reviews: [
       {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String
        }
       }
    ],
    ratings: {
        type: Number,
        default:0
    },
    numOfReviews: {
        type: Number
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
})

const Product = mongoose.model("Product", productSchema)

export default Product;