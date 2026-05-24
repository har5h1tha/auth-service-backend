import {Router} from "express"
import * as authController from '../controllers/auth.controller.js' 
import { authLimiter } from "../middlewares/rateLimiter.js"

const authRouter=Router()

/* POST /api/user/register */
authRouter.post("/register",authLimiter,authController.register)

/* POST /api/user/login */
authRouter.post("/login",authLimiter,authController.login)

/*GET /api/user/get-me */
authRouter.get("/get-me",authController.getMe)

/*GET /api/user/refresh-token */
authRouter.get("/refresh-token",authLimiter,authController.refreshToken)

/*GET /api/user/get-me */
authRouter.get("/log-out",authController.logOut)

/*GET /api/user/get-me */
authRouter.get("/log-out-all",authController.logOutAll)

/*GET /api/user/verify-email */
authRouter.get("/verify-email",authController.verifyEmail)

export default authRouter;