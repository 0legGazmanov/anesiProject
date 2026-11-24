import mongoose from 'mongoose'

const connectDB = async () => {
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env

    const uri = `mongodb+srv://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}/${DB_NAME}`

    await mongoose.connect(uri)

    console.log('MongoDB connected')
}

export default connectDB