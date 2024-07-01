import mongoose from "mongoose"

const hospitalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        addressLine1: {
            type: String,
            required: true
        },
        name: {
            type: String,

        },
        city: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        specialisedIn: [
            {
                type: String,
                required: true
            },
        ],


    },
    { timestamps: true })

export const Hospital = mongoose.model("Hospital", "hospitalSchema")