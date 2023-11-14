import cloudinary from "../config/cloudinary.config.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

//add a new product
export const addProduct = async (req, res) => {
	try {
		const newProduct = new Product(req.body);
		await newProduct.save();

		//send notification to admin
		const admins = await User.find({ role: "admin" });
		const seller = await User.findById(req.body.seller);
		admins.forEach(async (admin) => {
			const newNotification = new Notification({
				user: admin._id,
				message: `New product added by ${seller.name}`,
				title: "New Product",
				onClick: "/admin-dashboard",
				read: false,
			});
			await newNotification.save();
		});

		res.send({
			success: true,
			message: "Product Added successfully",
		});
	} catch (error) {
		res.send({
			success: false,
			message: error.message,
		});
	}
};

//get all products
export const getAllProducts = async (req, res) => {
	try {
		const { seller, category = [], status, search } = req.body;

		let filters = {};

		if (seller) {
			filters.seller = seller;
		}

		if (status) {
			filters.status = status;
		}

		//filter by category
		if (category.length > 0) {
			filters.category = { $in: category };
		}

		//search by name
		if (search) {
			filters.name = { $regex: search, $options: "i" };
		}

		const products = await Product.find(filters)
			.populate("seller")
			.sort({ createdAt: -1 });

		res.send({
			success: true,
			data: products,
		});
	} catch (error) {
		res.send({
			success: false,
			message: error.message,
		});
	}
};

//get latest 8 products
export const getLatestProducts = async (req, res) => {
	try {

		// Use aggregation to calculate the average rating for each product
		const products = await Product.aggregate([
			{
				$match: { status: "approved" } // Filter for approved products
			},
			{
				$addFields: {
					// Calculate the average rating as rating divided by totalRatings, handling the case where totalRatings is zero
					averageRating: {
						$cond: [
							{ $gt: ["$totalRatings", 0] }, // Check if totalRatings is greater than zero
							{ $divide: ["$rating", "$totalRatings"] }, // Calculate the average rating
							null // If totalRatings is zero, set averageRating to null
						]
					}
				}
			},
			{
				$sort: { averageRating: -1 } // Sort by average rating in descending order
			},
			{
				$limit: 8 // Limit the result to 8 products
			}
		]);

		res.send({
			success: true,
			data: products,
		});
	} catch (error) {
		res.send({
			success: false,
			message: error.message,
		});
	}
};

//update product
export const updateProduct = async (req, res) => {
	try {
		await Product.findByIdAndUpdate(req.params.id, req.body);

		res.send({
			success: true,
			message: "Product updated successfully",
		});
	} catch (error) {
		res.send({
			success: false,
			message: error.message,
		});
	}
};

//get product by id
export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id).populate(
			"seller"
		);

		res.send({
			success: true,
			data: product,
		});
	} catch (error) {
		res.send({
			success: false,
			message: error.message,
		});
	}
};

//delete product
export const deleteProduct = async (req, res) => {
	try {
		await Product.findByIdAndDelete(req.params.id);

		res.send({
			success: true,
			message: "Product deleted successfully",
		});
	} catch (error) {
		res.send({
			success: false,
			message: error.message,
		});
	}
};

//Update Product status
export const updateProductStatus = async (req, res) => {
	try {
		const { status } = req.body;
		const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
			status,
		});

		//send notification to seller
		const newNotification = new Notification({
			user: updatedProduct.seller,
			message: `Your product ${updatedProduct.name} status has been changed to ${status}`,
			title: "Product Status Updated",
			onClick: "/papermaker-dashboard",
			read: false,
		});

		await newNotification.save();

		res.send({
			success: true,
			message: "Product status updated successfully",
		});
	} catch (error) {
		res.send({
			success: false,
			message: error.message,
		});
	}
};

//handle image upload to cloudinary
export const uploadProductImage = async (req, res) => {
	try {
		//upload to cloudinary
		const result = await cloudinary.v2.uploader.upload(req.file.path, {
			folder: "paperlink",
		});
		const productId = req.body.productId;
		await Product.findByIdAndUpdate(productId, {
			$push: { images: result.secure_url },
		});
		res.send({
			success: true,
			message: "Image uploaded successfully",
			data: result.secure_url,
		});
	} catch (error) {
		res.send({
			success: false,
			message: error.message,
		});
	}
};

//handel image delete from cloudinary
export const deleteProductImage = async (req, res) => {
	try {
		const { imgUrl, productId, index } = req.body;

		let publicId = imgUrl.match(/\/([^/]+)\.[^.]+$/)[1];
		const folder = "paperlink"
		publicId = `${folder}/${publicId}`;

		//delete from cloudinary
		const result = await cloudinary.v2.uploader.destroy(publicId);

		if (result.result !== 'ok') {
			throw new Error(`Something went wrong while deleting image : ${result.result}`);
		};

		//delete from db
		await Product.findByIdAndUpdate(productId, {
			$unset: { [`images.${index}`]: 1 }
		});

		await Product.findByIdAndUpdate(productId, {
			$pull: { images: null },
		});

		res.send({
			success: true,
			message: "Image deleted successfully",
		});
	} catch (error) {
		res.send({
			success: false,
			message: error.message,
		});
	}
};

//handle Image update
export const updateProductImage = async (req, res) => {
	try {
		const { imageId } = req.params;
		const { productId } = req.body;

		//delete old image from cloudinary
		await cloudinary.v2.uploader.destroy(imageId);

		//upload new image to cloudinary
		const result = await cloudinary.v2.uploader.upload(req.file, {
			folder: "paperlink",
		});

		const updatedImageUrl = result.secure_url;

		//update db
		await Product.findByIdAndUpdate(productId, {
			$push: { images: updatedImageUrl },
		});

		res.send({
			success: true,
			message: "Image updated successfully",
			data: updatedImageUrl,
		});


	} catch (error) {
		res.send({
			success: false,
			message: error.message,
		});
	}
};

//give rating to product
export const giveRating = async (req, res) => {
	try {
		const { rating } = req.body;

		if (!rating) {
			throw new Error("Rating is required");
		}

		if (rating > 5 || rating < 1) {
			throw new Error("Rating must be between 1 to 5");
		}

		if (!req.params.id) {
			throw new Error("Product id is required");
		}

		const product = await Product.findById(req.params.id);

		if (!product) {
			throw new Error("Product not found");
		}

		// Calculate the updated rating
		const currentRating = product.rating || 0; // Default to 0 if there are no previous ratings
		const totalRatings = product.totalRatings || 0; // Default to 0 if there are no previous ratings
		const updatedTotalRatings = totalRatings + 1; // Increment the total number of ratings
		const updatedRating = (currentRating * totalRatings + rating) / updatedTotalRatings;

		// Update the product's rating in the database
		await Product.findByIdAndUpdate(req.params.id, {
			rating: updatedRating,
			totalRatings: updatedTotalRatings,
		});

		res.send({
			success: true,
			message: "Rating given successfully",
		});
	} catch (error) {
		res.send({
			success: false,
			message: error.message,
		});
	}
};


