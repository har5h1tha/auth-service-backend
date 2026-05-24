import rateLimit from 'express-rate-limit'

export const authLimiter=rateLimit({
    windowMs=15*60*1000,
    max:5,
    message:{
        message:"TOO many requests try ,again later"
    },
    standardHeaders:true,
    legacyHeaders:false

})