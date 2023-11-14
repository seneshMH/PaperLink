import {
	Box,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import ProductForm from "./ProductForm";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../../redux/loaderSlice";

import { DeleteProduct, GetProducts } from "../../../../apiCalls/products";
import moment from "moment/moment";
import ImageForm from "./ImageForm";
import { useMessage } from "../../../../hooks/message/Message";

function Product() {
	const message = useMessage();
	const [showProductForm, setShowProductForm] = useState(false);
	const [showImageForm, setShowImageForm] = useState(false);
	const [products, setProducts] = useState();
	const [selectedProduct, setSelectedProduct] = useState(null);

	const { user } = useSelector((state) => state.users);
	const dispatch = useDispatch();

	const getData = async () => {
		try {
			if (!user) return;

			dispatch(SetLoader(true));
			const response = await GetProducts({
				seller: user._id,
			});

			if (response.success) {
				setProducts(response.data);
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			message.error(error.message);
		} finally {
			dispatch(SetLoader(false));
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const deleteProduct = async (id) => {
		try {
			dispatch(SetLoader(true));
			const response = await DeleteProduct(id);
			dispatch(SetLoader(false));
			if (response.success) {
				message.success(response.message);
				getData();
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			dispatch(SetLoader(false));
			message.error(error.message);
		}
	};

	return (
		<Box sx={{ paddingBottom: "4px" }}>
			<Button
				variant="contained"
				endIcon={<AddIcon />}
				onClick={() => {
					setSelectedProduct(null);
					setShowProductForm(true);
				}}
				sx={{ marginBottom: "10px" }}
			>
				Add Product
			</Button>

			<TableContainer component={Paper}>
				<Table
					sx={{ minWidth: 650 }}
					size="small"
					aria-label="a dense table"
				>
					<TableHead>
						<TableRow>
							<TableCell>Product</TableCell>
							<TableCell align="right">Name</TableCell>
							<TableCell align="right">Price</TableCell>
							<TableCell align="right">Category</TableCell>
							<TableCell align="right">Status</TableCell>
							<TableCell align="right">Added On</TableCell>
							<TableCell align="right">Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{products?.map((product) => (
							<TableRow
								key={product._id}
								sx={{
									"&:last-child td, &:last-child th": {
										border: 0,
									},
								}}
							>
								<TableCell component="th" scope="row">
									<img
										src={product.images[0]}
										alt={product.name}
										width={100}
									/>
								</TableCell>
								<TableCell align="right">
									{product.name}
								</TableCell>
								<TableCell align="right">
									{product.price}
								</TableCell>
								<TableCell align="right">
									{product.category}
								</TableCell>
								<TableCell align="right">
									{product.status}
								</TableCell>
								<TableCell align="right">
									{moment(product.createdAt).format(
										"DD-MM-YYYY hh-mm A"
									)}
								</TableCell>
								<TableCell align="right">
									<Button
										variant="outlined"
										color="warning"
										startIcon={<ImageIcon />}
										onClick={() => {
											setSelectedProduct(product);
											setShowImageForm(true);
										}}
									>
										Upload Images
									</Button>
									<Button
										variant="outlined"
										startIcon={<EditIcon />}
										onClick={() => {
											setSelectedProduct(product);
											setShowProductForm(true);
										}}
									>
										Edit
									</Button>
									<Button
										variant="outlined"
										color="error"
										startIcon={<DeleteIcon />}
										onClick={() =>
											deleteProduct(product._id)
										}
									>
										Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{showProductForm && (
				<ProductForm
					showProductForm={showProductForm}
					setShowProductForm={setShowProductForm}
					selectedProduct={selectedProduct}
					setSelectedProduct={setSelectedProduct}
					getData={getData}
				/>
			)}

			{showImageForm && (
				<ImageForm
					showImageForm={showImageForm}
					setShowImageForm={setShowImageForm}
					selectedProduct={selectedProduct}
					setSelectedProduct={setSelectedProduct}
					getData={getData}
				/>
			)}
		</Box>
	);
}

export default Product;
