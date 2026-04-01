import mongoose from "mongoose";
import moduleSchema from "./schema.js";
export default mongoose.model("Module", moduleSchema, "modules");
