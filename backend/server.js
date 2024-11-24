const app = require('./app');
const connectDatabase = require('./db/database');

process.on('uncaughtException', (err)=>{
    console.log(`ERROR: ${err.message}`);
    console.log('shutting down the server for handling exception');
    
})



// config 
if(process.env.NODE_ENV !== 'PRODUCTION'){
    require('dotenv').config({
        path: "config/.env"
    })
}


// create server
const server = app.listen(
    process.env.PORT,
    ()=> console.log(`Server is running on http://localhost:${process.env.PORT}`)
)


// connect db
connectDatabase()


// unhandled promise rejectio

process.on('unhandledRejection', (err)=>{
    console.log(`ERROR: ${err.message}`);
    console.log('shutting down the server for handling unhandled rejection');
    server.close(()=>{
        process.exit(1)
    })
})
