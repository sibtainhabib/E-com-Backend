import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({ extended: true }))

import userRoutes from "./routes/user.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from './routes/cart.routes.js'
import paymentRoutes from './routes/payment.route.js'

app.use('/api/auth' , userRoutes)
app.use('/api/products' , productRoutes)
app.use('/api/cart' , cartRoutes)
app.use('/api/payment' , paymentRoutes)

export default app
