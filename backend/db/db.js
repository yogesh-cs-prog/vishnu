import mongoose from 'mongoose'

const connectDB = async() => {
    try {
        mongoose.connect(`mongodb+srv://yogesh5prog:12345@cluster0.baotudi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {

        })
            .then(() => {
                console.log("Successfully connected to MongoDB Atlas")
            })
            .catch((err) => {
                console.log(err, "Error In database connection")
            })
    } catch (error) {
        console.log(error)
    }
}


export {connectDB}