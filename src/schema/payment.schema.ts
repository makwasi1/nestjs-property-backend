import mongoose from "mongoose";

export const PaymentSchema = new mongoose.Schema({
    name: String,
    email: String,
    status: String,
    amount: Number,
    billingReference: String,
    date: {type: Date, default: Date.now},
})