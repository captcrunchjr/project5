const mongoose = require('mongoose');
const {Schema} = mongoose;
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

const itemSchema = new Schema({
    title: {type: String, required: true},
    condition: {type: String, required: true, enum: ['Mint', 'New', 'Very Good', 'Good', 'Fair']},
    price: {type: Number, required: true, min: 0.01},
    seller: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    image: {
            data: {type: Buffer, required: true},
            contentType: {type: String, required: true}
            },
    details: {type: String, required: true},
    totalOffers: {type: Number, default: 0},
    active: {type: Boolean, default: true},
    highestOffer: {type: Number, default: 0},
});

//used to seed the database
// const data = [
//     {title: "Assassin's Creed Mirage", condition: "New", price: 70.00, seller: "Ubisoft", image: fs.readFileSync('/Development/project3/public/src/assassinscreed.png'), details: "Basim returns in the latest installment of the award winning Assassin's Creed series. Explore his story and a painstakingly reconstructed Baghdad."},
//     {title: "Crusader Kings 3", condition: "New", price: 40.00, seller: "Paradox", image: fs.readFileSync('/Development/project3/public/src/crusaderkings.jpg'), details: "Have you ever wanted to conquer the world and place your family members on the various thrones of medieval Europe? Well now you can in this dynastic strategy game. Grow you family, expand your borders, build your renown."},
//     {title: "Factorio", condition: "New", price: 35.00, seller: "Wube", image: fs.readFileSync('/Development/project3/public/src/factorio.avif'), details: "The factory must grow. Tame a dangerous planet by harnessing it's resources to build an ever expanding factory in this critically acclaimed indie title. Use bots and your own ingenuity to protect your factory from the hostile alien life."},
//     {title: "HELLDIVERS™ 2", condition: "New", price: 40.00, seller: "Arrowhead", image: fs.readFileSync('/Development/project3/public/src/baldursgate.jpg'), details: "The war against the bugs continues in this top down shooter. Join the Helldivers and fight for Super Earth in this cooperative shooter. The bugs are relentless, but so are you."},
//     {title: "Path of Exile", condition: "New", price: 30.00, seller: "GGG", image: fs.readFileSync('/Development/project3/public/src/pathofexile.jpg'), details: "Path of Exile builds on the classic gameplay loop of Diablo 2 and reimagines many aspects from loot to character customization. Each year brings new leagues with new content to explore. Will you find the Mirror?"},
//     {title: "Palworld", condition: "New", price: 30.00, seller: "Pocketpair", image: fs.readFileSync('/Development/project3/public/src/palworld.jpg'), details: "Palworld is a brand new open world survival crafting game with a twist: the inhabitants are ready to help build you dream base, but first you must beat them and train them up. This game asks 'What would Pokemon be like if Terry Pratchett wrote it?'"}
// ];

module.exports = mongoose.model('Item', itemSchema);