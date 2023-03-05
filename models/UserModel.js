import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import Jwt from "jsonwebtoken";
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter username"]
    },
    email: {
        type: String,
        required: [true, "Please enter email"],
        unique: [true, "Email already exist"]
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        minLength: [8, "Password must be 8 characters"],
        select: false
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
})
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
})

userSchema.methods.generateToken = function () {
    return Jwt.sign({ id: this._id }, process.env.JWT_TOKEN)
}
userSchema.methods.isMatched = async function (password) {
    return await bcrypt.compare(password, this.password)
}

//User Password token
userSchema.methods.getUserPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;

}

const User = mongoose.model("User", userSchema)
export default User;