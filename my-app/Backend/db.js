const mongoose=require ('mongoose');

const mongoURI = "mongodb://localhost:27017/supplynote_task"
const connectToMongo=()=>{
    mongoose.connect(mongoURI)
}

module.exports=connectToMongo;