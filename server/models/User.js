const {Schema, model, ObjectId} = require("mongoose")

const User = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    diskSpace: {type: Number, default: 50 * 1024 * 1024},
    usedSpace: {type: Number, default: 0},
    avatar: {type: String},
    role: {type: String, default: "USER"},
    files : [{type: ObjectId, ref:'File'}]
})

module.exports = model('User', User)