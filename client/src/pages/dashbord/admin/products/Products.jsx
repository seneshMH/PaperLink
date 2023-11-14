import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";

import { SetLoader } from "../../../../redux/loaderSlice";
import {
	GetProducts,
	UpdateProductStatus,
} from "../../../../apiCalls/products";

import { useMessage } from "../../../../hooks/message/Message";
import moment from "moment";

import BeenhereIcon from "@mui/icons-material/Beenhere";
import WebAssetOffIcon from "@mui/icons-material/WebAssetOff";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Products = () => {
	const dispatch = useDispatch();

	const message = useMessage();

	const [products, setProducts] = useState([]);

	const onStatusUpdate = async (id, status) => {
		try {
			dispatch(SetLoader(true));
			const response = await UpdateProductStatus(id, status);
			dispatch(SetLoader(false));

			if (response.success) {
				message.success(response.message);
				getData();
			} else {
				message.error(response.message);
			}
		} catch (error) {
			dispatch(SetLoader(false));
			message.error(error.message);
		}
	};

	const getData = async () => {
		try {
			dispatch(SetLoader(true));
			const response = await GetProducts(null);
			dispatch(SetLoader(false));

			if (response.success) {
				setProducts(response.data);
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			dispatch(SetLoader(false));
			message.error(error.message);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<div>
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
							<TableCell align="right">Description</TableCell>
							<TableCell align="right">Seller</TableCell>
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
									{product.description}
								</TableCell>
								<TableCell align="right">
									{product.seller.name}
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
									{product.status === "pending" && (
										<Button
											variant="outlined"
											startIcon={<BeenhereIcon />}
											onClick={() =>
												onStatusUpdate(
													product._id,
													"approved"
												)
											}
										>
											Aprove
										</Button>
									)}
									{product.status === "pending" && (
										<Button
											variant="outlined"
											color="error"
											startIcon={<WebAssetOffIcon />}
											onClick={() =>
												onStatusUpdate(
													product._id,
													"rejected"
												)
											}
										>
											Reject
										</Button>
									)}
									{product.status === "rejected" && (
										<Button
											variant="outlined"
											startIcon={<BeenhereIcon />}
											onClick={() =>
												onStatusUpdate(
													product._id,
													"approved"
												)
											}
										>
											Aprove
										</Button>
									)}
									{product.status === "approved" && (
										<Button
											variant="outlined"
											startIcon={<BlockIcon />}
											color="error"
											onClick={() =>
												onStatusUpdate(
													product._id,
													"blocked"
												)
											}
										>
											Block
										</Button>
									)}
									{product.status === "blocked" && (
										<Button
											variant="outlined"
											startIcon={<CheckCircleIcon />}
											onClick={() =>
												onStatusUpdate(
													product._id,
													"approved"
												)
											}
										>
											UnBlock
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default Products;
