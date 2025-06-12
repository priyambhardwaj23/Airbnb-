const mongoose = require('mongoose');
const initData=require("./data");
const Listing = require('../models/listing');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log('MongoDB is connected TO DATABASE: wanderlust');
    })
    .catch((err) => {
        console.log(err)
    });
async function main() {
    await mongoose.connect(MONGO_URL);

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner :"6842c2a2d7870b23abccf5be"}));
    //console.log(initData.data);
    await Listing.insertMany(initData.data);
    console.log("Data was inserted");
};
 initDB();