import express, { Router } from 'express'
import { addToCart, getCartProducts, removeAllCartProduct, updateCartQuantity } from '../controllers/cart.controller.js'

const router = Router()

router.route('/').get(getCartProducts)
router.route('/').delete(removeAllCartProduct)
router.route('/:id').patch(updateCartQuantity)
router.route('/').post(addToCart)

export default router