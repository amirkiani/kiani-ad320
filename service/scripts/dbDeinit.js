import mongoose from 'mongoose'
import { User } from '../models/User.js'

const sleepAndQuit = new Promise((resolve) => {
  setTimeout(() => {
    mongoose.connection.close()
    resolve()
  }, 5000)
})

const deinitDB = async () => {
  const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tqkxx.mongodb.net/notoreity?retryWrites=true&w=majority`
  try {
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000})
    console.log("Connected to the database!");
  } catch (err) {
    console.log('error ', err)
  }

  await User.deleteMany({})

  await sleepAndQuit

  console.log('finished deleting users')
}

deinitDB()