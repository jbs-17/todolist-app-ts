import mongoose from "mongoose";
import CONFIG from "./index.config.js";
import LOGGER from './logger.config.js';

try {
    LOGGER.info({
     message: "connecting to mongodb..."
    })
    await mongoose.connect(CONFIG.MONGODB_URL, {
        dbName: CONFIG.MONGODB_DBNAME,
    });
    LOGGER.info({
     message: "connected to mongodb!"
    });
} catch (error) {
    LOGGER.error({
     message: "failed to connect to mongodb!"
    ,error
    });
    //process.exit(1);
}
