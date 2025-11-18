import express, {type Express} from 'express';


// instance app express 
const app : Express = express();

app.get('/', (req, res)=>{
    return res.json({
        'message': 'hello world!'
    })
})

// export untuk di listen worker
export default app;