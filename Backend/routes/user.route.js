import express from "express"
import { userSignup, userLogin, userLogout } from "../controllers/user.controller.js"

const router = express.Router()

router.route("/signup").post(userSignup)
router.route("/login").post(userLogin)
router.route("/logout").post(userLogout)

export default router