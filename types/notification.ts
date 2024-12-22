import { Schema, Document } from "mongoose";
export interface NotificationType extends Document {
    userId: Schema.Types.ObjectId;
    fromUserId: Schema.Types.ObjectId;
    type: string;
    status: string;
    message?: string;
  }
  
  export default NotificationType;
  