import {Router} from "express"
import * as authController from '../controllers/auth.controller.js' 

const authRouter=Router()

/* POST /api/user/register */
authRouter.post("/register",authController.register)

/* POST /api/user/login */
authRouter.post("/login",authController.login)

/*GET /api/user/get-me */
authRouter.get("/get-me",authController.getMe)

/*GET /api/user/refresh-token */
authRouter.get("/refresh-token",authController.refreshToken)

/*GET /api/user/get-me */
authRouter.get("/log-out",authController.logOut)

/*GET /api/user/get-me */
authRouter.get("/log-out-all",authController.logOutAll)

export default authRouter;