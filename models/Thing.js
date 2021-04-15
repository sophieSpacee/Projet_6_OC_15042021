const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
name: { type: String, required: true},
description: { type: String, required: true},
mainPepper: { type: String, required: true},
imageUrl: { type: String, required: true},
heat: { type: Number, required: true},
likes: { type: Number, required: true},
dislikes: { type: Number, required: true},
userId: { type: String, required: true},
userLiked: { type: [string], required: true},
userDisliked: { type: [string], required: true},
});

module.exports = mongoose.model('thing', thingSchema);