const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/Anushka`);

const courseSchema = mongoose.Schema({
    image: String,
    name: String,
    code:String,
    credit:Number,
    Type:String,
    Description:String
})




module.exports = mongoose.model("course",courseSchema);                       