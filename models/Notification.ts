
import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    type:{
        type: String,
        required: true,
        enum: ["friend-request"]
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    message: {
        type: String,
        default: null,
    }
},
    {timestamps: true}
)

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema)

export default Notification;