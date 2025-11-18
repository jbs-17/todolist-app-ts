import cluster from "node:cluster";
import process from "node:process";
import app from "./app.js";

if (cluster.isPrimary) {

    let worker = cluster.fork();
    worker.on('exit', (code, signal) => {
        worker = cluster.fork();
    });

}else{

    console.info('woi');
    app.listen(3000, (error)=>{
        console.error(error)
        
    })

}