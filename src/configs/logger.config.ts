import winston from "winston";
const { combine, timestamp, json, prettyPrint, colorize } = winston.format;

const consoleInfoTransport = new winston.transports.Console({
    level: "info",
    format: combine(timestamp(), json(), prettyPrint(), colorize({ all: true })),
    handleExceptions: true,
    handleRejections: true
});

const fileErrorTransport = new winston.transports.File({
    filename: "./logs/error.log",
    level: "error",
    format: combine(json(), timestamp(), prettyPrint()),
    handleExceptions: true,
    handleRejections: true
});

const LOGGER = winston.createLogger({
    transports: [consoleInfoTransport, fileErrorTransport]
});

export default LOGGER;
