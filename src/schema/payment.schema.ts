import mongoose from "mongoose";

export const PaymentSchema = new mongoose.Schema({
    name: String,
    userId: String,
    status: String,
    amount: Number,
    billingReference: String,
    date: {type: Date, default: Date.now},
})