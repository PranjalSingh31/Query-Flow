import mongoose from "mongoose"

async function connectToDb()
{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connect to db")
    })
    .catch((err)=>{
        console.log(err)
    })
}

export default connectToDb