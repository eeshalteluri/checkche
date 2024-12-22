import { Schema, Document } from "mongoose";
export interface UserType extends Document {
    name: String,
    email: String,
    image:String,
    emailverified: boolean | null,
    username?: String,
    friends?: String[],
    groups?: String[]
  }
  
  export default UserType;