import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["completed", "missed", "pending"],
    required: true,
  },
});

const TaskLogSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Task",
  },
  type: {
    type: String,
    enum: ["daily", "weekly", "monthly", "custom"],
    required: true,
  },
  logs: {
    type: Map, // Flexible structure to store logs for any type
    of: [LogSchema], // Each key contains an array of `LogSchema`
  },
});

const TaskLog = mongoose.models.TaskLog || mongoose.model("TaskLog", TaskLogSchema);
export default TaskLog;
