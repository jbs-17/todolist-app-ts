import mongoose from "mongoose";
import CONFIG from "./index.config.js";

try {
    await mongoose.connect(CONFIG.MONGODB_URL as string, {
        dbName: CONFIG.MONGODB_DBNAME as string,
    });
} catch (error) {
    error.
}
