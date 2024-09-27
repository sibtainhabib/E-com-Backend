import { Product } from "../models/product.model.js"

export const addToCart = async (req , res) => {
  try {
    const {productId} = req.body
    const user = req.user

    const existingItem = user.cartItems.find((item) => item.id === productId)
    if(existingItem){
      existingItem.quantity += 1
    }
    else{
      user.cartItems.push(productId)
    }
  } catch (error) {
    console.log('Error in add to cart controller.' , error.message)
  }
}

export const removeAllCartProduct = async (req , res) => {
  try {
    const {productId} = req.body
    const user = req.user

    if(!productId) {
      user.cartItems = []
    }
    else{
      user.cartItems = user.cartItems.filter((item) => item.id !== productId)
    }
    await user.save()
    res.json(user.cartItems)
  } catch (error) {
    console.log('Error in remove all cart product.' , error.message)
  }
}

export const updateCartQuantity = async (req , res) => {
  try {
    const {id: productId} = req.params
    const user = req.user
    const{quantity} = req.body
  
    const existingItem = user.cartItems.find((item) => item.id === productId )
    if(existingItem){
      if(quantity === 0){
        user.cartItems = user.cartItems.filter((item) => item.id !== productId)
        await user.save()
        return res.json(user.cartItems)
      }
      existingItem.quantity = quantity
      await user.save()
      return res.json(user.cartItems)
    }else{
      return res.status(401).json({message:'Product not found'})
    }
  } catch (error) {
    console.log('Error in update cart quantity controller.' , error.message)
  }
}

export const getCartProducts = async (req, res) => {
	try {
		const products = await Product.find({ _id: { $in: req.user.cartItems } });

		const cartItems = products.map((product) => {
			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
			return { ...product.toJSON(), quantity: item.quantity };
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};