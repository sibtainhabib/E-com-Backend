import cloudinary from "../middlewares/cloudinary.middleware.js";
import { Product } from "../models/product.model.js";

export const allProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(201).json({
      error: false,
      Products: products,
      message: "All products retrived successfully.",
    });
  } catch (error) {
    console.log("Error in all products controller", error.message);
  }
};

export const allFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts)
      return res.status(401).json({
        error: true,
        message: "Featured Products not found.",
      });

    return res.status(201).json({
      error: false,
      featuredProducts,
      message: "Featured products retrieved successfully.",
    });
  } catch (error) {
    console.log("Error in featured products controller.", error.message);
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    if (!(name || description || price || category || image))
      return res.status(401).json({
        error: true,
        message: "All fields are mandatory.",
      });

    const uploadImage = await cloudinary.uploader.upload(image, {
      folder: "products",
    });

    const newProducts = new Product({
      name,
      description,
      price,
      category,
      image: uploadImage?.secure_url ? uploadImage.secure_url : "",
    });
    await newProducts.save();

    return res.status(201).json({
      error: false,
      newProducts,
      message: "Products added successfully.",
    });
  } catch (error) {
    console.log("Error in create product controller.", error.message);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(401).json({
        error: true,
        message: "Product not found.",
      });

    const imageId = product.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`products/${imageId}`);

    await Product.findByIdAndDelete(req.params.id);
    return res.json({
      error: false,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.log("Error in delete product controller.", error.message);
  }
};

export const productByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const product = await Product.find({ category });
    if (!product)
      return res.json({
        error: true,
        message: "Product not found.",
      });

    return res.json({
      error: false,
      product,
    });
  } catch (error) {
    console.log("Error in product by category controller.", error.message);
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      await product.save();
    } else {
      return res.status(401).json({
        message: "Product not found.",
      });
    }
    return res.json({
      product,
    });
  } catch (error) {
    console.log("Errror in toogle featured product.", error.message);
  }
};
