import * as mongoose from 'mongoose';

export const ConsentRegistrySchema = new mongoose.Schema({
    email: { type: String, required: true },
    registrationForm: [Array],
    checkboxText: { type: String, required: true },
    date: { type: Date, required: true },
});