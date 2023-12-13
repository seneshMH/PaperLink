import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../../redux/loaderSlice";
import { AddProduct, EditProduct } from "../../../../apiCalls/products";
import { useMessage } from "../../../../hooks/message/Message";

function ProductForm({
	showProductForm,
	setShowProductForm,
	selectedProduct,
	setSelectedProduct,
	getData,
}) {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.users);
	const message = useMessage();

	const [product, setproduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		seller: user._id,
		status: "",
	});

	const handleChange = (e) => {
		setproduct((prev) => {
			return { ...prev, [e.target.name]: e.target.value };
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(SetLoader(true));
			let response = null;
			if (selectedProduct) {
				product.seller = user._id;
				product.status = "pending";
				response = await EditProduct(selectedProduct._id, product);
			} else {
				product.seller = user._id;
				product.status = "pending";
				response = await AddProduct(product);
			}
			if (response.success) {
				message.success(response.message);
				getData();
				setShowProductForm(false);
				setSelectedProduct(null);
			} else {
				setSelectedProduct(null);
				setShowProductForm(false);
				throw new Error(response.message);
			}
		} catch (error) {
			dispatch(SetLoader(false));
			message.error(error.message);
		} finally {
			dispatch(SetLoader(false));
		}
	};

	useEffect(() => {
		if (selectedProduct) {
			setproduct(selectedProduct);
		}
	}, []);

	return (
		<>
			<Box component="form">
				<Dialog
					open={showProductForm}
					onClose={() => {
						setShowProductForm(false);
						setSelectedProduct(null);
					}}
				>
					<form onSubmit={handleSubmit}>
						<DialogTitle>
							{selectedProduct ? "Edit Product" : "Add Product"}
						</DialogTitle>
						<DialogContent>
							<FormControl sx={{ minWidth: "100%" }}>
								<TextField
									autoFocus
									margin="dense"
									name="name"
									id="name"
									label="Name"
									type="text"
									fullWidth
									variant="outlined"
									onChange={handleChange}
									defaultValue={
										selectedProduct
											? selectedProduct.name
											: ""
									}
									required
								/>
							</FormControl>

							<FormControl sx={{ minWidth: "100%" }}>
								<TextField
									autoFocus
									margin="dense"
									name="description"
									id="description"
									label="Description"
									type="text"
									fullWidth
									multiline
									rows={4}
									variant="outlined"
									onChange={handleChange}
									defaultValue={
										selectedProduct
											? selectedProduct.description
											: ""
									}
									required
								/>
							</FormControl>

							<FormControl sx={{ minWidth: "100%" }}>
								<TextField
									autoFocus
									margin="dense"
									name="price"
									id="price"
									label="Price"
									type="number"
									fullWidth
									variant="outlined"
									onChange={handleChange}
									defaultValue={
										selectedProduct
											? selectedProduct.price
											: ""
									}
									required
								/>
							</FormControl>

							<FormControl
								required
								sx={{ minWidth: "100%" }}
								margin="dense"
							>
								<InputLabel id="category-label">
									Category
								</InputLabel>
								<Select
									name="category"
									labelId="category-label"
									id="category"
									label="Category"
									variant="outlined"
									onChange={handleChange}
									defaultValue={
										selectedProduct
											? selectedProduct.category
											: ""
									}
								>
									<MenuItem value={"A0"}>A0</MenuItem>
									<MenuItem value={"A1"}>A1</MenuItem>
									<MenuItem value={"A2"}>A2</MenuItem>
									<MenuItem value={"A3"}>A3</MenuItem>
									<MenuItem value={"A4"}>A4</MenuItem>
									<MenuItem value={"A5"}>A5</MenuItem>
									<MenuItem value={"A6"}>A6</MenuItem>
									<MenuItem value={"A7"}>A7</MenuItem>
									<MenuItem value={"A8"}>A8</MenuItem>
									<MenuItem value={"A9"}>A9</MenuItem>
								</Select>
							</FormControl>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setShowProductForm(false)}>
								Cancel
							</Button>
							<Button type="submit">
								{selectedProduct
									? "Edit Product"
									: "Add Product"}
							</Button>
						</DialogActions>
					</form>
				</Dialog>
			</Box>
		</>
	);
}

export default ProductForm;
