import {
	Box,
	Button,
	Container,
	Divider,
	Paper,
	Typography,
} from "@mui/material";
import {
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useMessage } from "../../../hooks/message/Message";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../redux/loaderSlice";
import { CreateOrder, DeleteOrder } from "../../../apiCalls/product.order";

const CheckoutForm = ({ cartItems }) => {
	const stripe = useStripe();
	const elements = useElements();

	const { user } = useSelector((state) => state.users);
	const [isProcessing, setIsProcessing] = useState(false);

	const message = useMessage();
	const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		try {
			dispatch(SetLoader(true));
			setIsProcessing(true);

			//create order for each item in the cart and add response to an array
			const orderResponses = await Promise.all(
				cartItems.map(async (item) => {
					const response = await CreateOrder({
						product: item.product._id,
						buyer: user._id,
						price: item.product.price,
						quantity: item.quantity,
					});

					return response;
				})
			);

			//check if all orders are created successfully
			const isAllOrdersCreated = orderResponses.every(
				(response) => response.success
			);

			if (!isAllOrdersCreated) {
				throw new Error("Failed to create orders");
			}

			const response = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/shop`,
				},
			});

			if (response.error) {
				//delete all orders if payment failed
				const deleteOrderResponses = await Promise.all(
					orderResponses.map(async (response) => {
						if (response.success) {
							const deleteResponse = await DeleteOrder(
								response.data._id
							);
							return deleteResponse;
						}
					})
				);

				//check if all orders are deleted successfully
				const isAllOrdersDeleted = deleteOrderResponses.every(
					(response) => response.success
				);

				if (!isAllOrdersDeleted) {
					throw new Error("Failed to delete orders");
				}

				if (
					response.error.type === "card_error" ||
					response.error.type === "validation_error"
				) {
					throw new Error(response.error.message);
				} else {
					throw new Error("An unexpected error occurred.");
				}
			}

			if (response.paymentIntent.status === "succeeded") {
				message.success("Payment Succeeded");
			} else {
				throw new Error("Payment Failed");
			}
		} catch (error) {
			message.error(error.message);
		} finally {
			setIsProcessing(false);
			dispatch(SetLoader(false));
		}
	};

	return (
		<Container
			maxWidth="sm"
			sx={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				padding: "2rem",
			}}
			component={Paper}
		>
			<Box>
				<Typography variant="h4" gutterBottom>
					Payment Details
				</Typography>
				<Divider sx={{ marginBottom: "1rem" }} />
				<form id="payment-form" onSubmit={handleSubmit}>
					<PaymentElement id="payment-element" />
					<Button
						variant="contained"
						color="primary"
						disabled={isProcessing || !stripe || !elements}
						type="submit"
						sx={{ marginTop: "1rem" }}
					>
						{isProcessing ? "Processing..." : "Pay Now"}
					</Button>
				</form>
			</Box>
		</Container>
	);
};

export default CheckoutForm;
