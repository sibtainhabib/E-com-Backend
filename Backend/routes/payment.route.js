import express, { Router } from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js';
import { checkoutSuccess, createCheckoutSession } from '../controllers/payment.controller.js';

const router = Router()

router.route('/create-checkout-session').get(protectRoute , createCheckoutSession)
router.route('/checkout-success').get(protectRoute , checkoutSuccess)

export default router;