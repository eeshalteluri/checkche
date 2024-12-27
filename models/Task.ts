import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    taskFrequency: {
        type: String,
        required: true,
        enum: ["daily", "weekly", "monthly", "custom"],
        default: "daily"
    },
    frequency: {
        type: [String],
    },
    type: {
        type: String,
        required: true,
        enum: ["AT", "NT"],
        default: "AT"
    },
    accountabilityPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    endDate: {
        type: Date,
    }

},{timestamps: true}

)

const Task = mongoose.models.Notification || mongoose.model('Task', TaskSchema)
export default Task