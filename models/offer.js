const mongoose = require('mongoose');
const {Schema} = mongoose;

const offerSchema = new Schema({
    item: {type: Schema.Types.ObjectId, ref: 'Item', required: true},
    buyer: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    seller: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    amount: {type: Number, required: true, min: 0.01},
    status: {type: String, required: true, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending'},
});

module.exports = mongoose.model('Offer', offerSchema);