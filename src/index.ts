import cluster from "node:cluster";
import process from "node:process";

import app from "./app.js";
import LOGGER from "./configs/logger.config.js";
import CONFIG from "./configs/index.config.js";

import "./configs/mongodb.connection.config.js";

LOGGER.info({
 message: "starting the app..."
})

if (cluster.isPrimary) {
    // proses master berjalan
    LOGGER.info({
        message: `Master ${process.pid} is running`
    });

    // fork worker
    cluster.fork();

    // kalau worker exit , fork lagi
    cluster.on("exit", (worker, code, signal) => {
        LOGGER.error({
            message: `Worker ${worker.process.pid} died. Forking a new worker...`,
            code,
            signal
        });
        cluster.fork();
    });
} else {
 
    
 
    // worker mulai bekerja
    app.listen(CONFIG.APP_PORT, error => {
        if (error) {
            LOGGER.error({
                message: `worker with pid: ${process.pid} failed to start! stoping process...`,
                error
            });
            process.exit(1);
        }
        LOGGER.info({
            message: `worker with pid: ${process.pid} started and listening on port ${CONFIG.APP_PORT}...`
        });
    });
}
