import dotenv from 'dotenv'

dotenv.config()

if(!process.env.MONGO_URI){
  throw new Error("dB not found")
}
if(!process.env.JWT_SECRET){
  throw new Error("JWT secret not found")
}

const  config= {
  MONGO_URI : process.env.MONGO_URI ,
  JWT_SECRET:process.env.JWT_SECRET
}

export default config;