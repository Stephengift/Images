const mongoose = require("mongoose");
const cities = require("./cities");
const{places, descriptors} = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp",{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0; i<10;i++){
        const random10 = Math.floor(Math.random() * 10);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author:"5ff9726fcd29d320306622d1", 
            location: `${cities[random10].city}, ${cities[random10].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/542210/1600x900',
            description: 'Cars all around the world',
            price,
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});