import React from "react";
import {
	Box,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography,
	Button,
	Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

function Cart({
	showCart,
	setShowCart,
	cartItems,
	addToCart,
	removeFromCart,
	updateCartItemQuantity,
}) {
	const navigate = useNavigate();

	const totalCost = cartItems?.reduce(
		(total, item) => total + item?.product?.price * item.quantity,
		0
	);

	return (
		<Dialog open={showCart} onClose={() => setShowCart(false)}>
			<DialogTitle>
				<Typography variant="h5">Your Cart</Typography>
				<IconButton
					color="inherit"
					onClick={() => setShowCart(false)}
					aria-label="close"
					sx={{
						position: "absolute",
						right: "8px",
						top: "8px",
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ minWidth: "500px" }}>
				{cartItems?.length === 0 ? (
					<Typography>Your cart is empty.</Typography>
				) : (
					<Box>
						{cartItems.map((item) => (
							<>
								<Box
									key={item.id}
									sx={{
										display: "flex",
										padding: "5px",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									{/*show product image*/}
									<img
										src={item?.product?.images[0]}
										width={"100px"}
										height={"100px"}
										alt={item?.product?.name}
									/>
									<Typography variant="h6" p={2}>
										{item?.product?.name}
									</Typography>
									<Typography p={2}>
										Quantity: {item.quantity}
									</Typography>
									<IconButton
										onClick={() =>
											updateCartItemQuantity(
												item,
												item.quantity - 1
											)
										}
										aria-label="remove item"
										p={2}
									>
										<RemoveIcon />
									</IconButton>
									<IconButton
										onClick={() =>
											updateCartItemQuantity(
												item,
												item.quantity + 1
											)
										}
										aria-label="add item"
										p={2}
									>
										<AddIcon />
									</IconButton>
									<Typography p={2}>
										Price: Rs.
										{item?.product?.price * item.quantity}
									</Typography>
									<IconButton
										onClick={() => removeFromCart(item)}
										aria-label="remove from cart"
										p={2}
									>
										<DeleteIcon />
									</IconButton>
								</Box>
								<Divider />
							</>
						))}
						<Typography variant="h6" p={2}>
							Total: Rs. {totalCost}
						</Typography>
					</Box>
				)}
				<div>
					{cartItems?.length !== 0 && (
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								navigate("/checkout");
								setShowCart(false);
							}}
						>
							Checkout
						</Button>
					)}

					<Button
						variant="outlined"
						color="primary"
						onClick={() => setShowCart(false)}
						style={{ marginLeft: "10px" }}
					>
						Cancel
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default Cart;
