const mongoose = require('mongoose');

// Connect to MongoDB

const connectDB = () => {
    try {
        // mongoose.connect('mongodb://localhost:27017/FullStack_Final_Project').then(()=>{
        //     console.log('Database connection established')
        const mongoURI = process.env.MONGODB_URI;
        mongoose.connect(mongoURI).then(()=>{
            console.log('Database connection established')
        });
    } catch (error) {
        alert (error.message);
    }
}
   

module.exports = connectDB;
       
// const { MongoClient } = require('mongodb');
// // or as an es module:
// // import { MongoClient } from 'mongodb'

// // Connection URL
// const url = 'mongodb://localhost:27017';
// const client = new MongoClient(url);

// // Database Name
// const dbName = 'FullStack_Final_Project';

// const connectDBFunc = async () => {
//   // Use connect method to connect to the server
//   await client.connect();
//   console.log('Connected successfully to server');
//   const db = client.db(dbName);
// //   const collection = db.collection('documents');

//   // the following code examples can be pasted here...

//   return 'done.';
// }

// const connectDB = () => {
//     connectDBFunc()
//         .then(console.log)
//         .catch(console.error)
//         .finally(() => client.close());
// }

// module.exports = connectDB;

