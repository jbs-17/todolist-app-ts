import { env } from "node:process";

import dotenv from 'dotenv';
dotenv.config();


type ConfigValueType = "string" | "boolean" | "number";

class ConfigurationError extends TypeError {
    constructor(
        message,
        public key: string,
        public value: unknown
    ) {
        super(message);
        this.key = key;
        this.value = value;
    }
}
/**
 * default valueType is string
 */
function configFromEnv(
    key: string,
    valueType: ConfigValueType = "string"
): boolean | number | string {
    const value = process.env[key];
    

    // jika nilai yg di env tidak ada atau undefined
    if (!value)
        throw new ConfigurationError(
            `Config ${key} does not exist on env!`,
            key,
            value
        );

    // defaultnya string dengan length !== 0
    if (valueType === "string") {
        if (valueType.length <= 0)
            throw new ConfigurationError(
                "config value is zero lenghth string!", key, value
            );
        return value as string;
    }

    if (valueType === "number") {
        const result = Number(value);

        if (isNaN(result))
            throw new ConfigurationError(
                "config value is NaN, make sure the value is correct!"
            ,key, value);

        return result;
    }

    if (value === "1" || value === "true") {
        return true;
    } else if (value === "0" || value === "false") {
        return false;
    } else {
        throw new ConfigurationError(
            `allowed boolean value is string 'true', 'false', '0', '1'`
        , key, value);
    }
}

type ConfigSpec = Readonly<{
    MONGODB_URL: string;
    MONGODB_DBNAME: string;
    APP_PORT: number;
}>;

const CONFIG: ConfigSpec = Object.freeze({
    MONGODB_URL: configFromEnv("MONGODB_URL") as string,
    MONGODB_DBNAME: configFromEnv("MONGODB_DBNAME") as string,
    APP_PORT: configFromEnv("APP_PORT", "number") as number
});

export default CONFIG;
