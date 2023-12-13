import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import { Box, Divider, Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)`
	position: relative;
	cursor: pointer;
	min-height: 280px;
	max-height: 280px;

	//remove default box shadow
	box-shadow: none;

	&:hover {
		transform: scale(1.05);
		transition: all 0.2s ease-in-out;
		box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
		background-color: #149121;
		color: white;
	}
`;

const NewLabel = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	background-color: #f44336; /* Red color for "New" label */
	color: white;
	padding: 4px 8px;
	font-weight: bold;
	font-size: 12px;
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px;
`;

const ProductCard = ({ product, isNew }) => {
	const navigate = useNavigate();

	return (
		<StyledCard
			onClick={() => {
				navigate(`/product/${product._id}`);
			}}
		>
			{isNew && <NewLabel>New</NewLabel>}
			<CardMedia
				component="img"
				alt={product.name}
				max-height="200px"
				image={product.images[0]}
				sx={{ objectFit: "contain" }}
			/>
			<CardContent>
				<Typography variant="h5" component="div">
					{product.name}
				</Typography>
				<Divider sx={{ paddingBottom: "5px" }} />
				<Typography variant="body2" color="red">
					Rs.{product.price}
				</Typography>
				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					<Rating
						name="read-only"
						value={product.rating}
						precision={0.5}
						readOnly
						size="small"
					/>
					<Typography variant="body2" color="text.secondary">
						{product.totalRatings} reviews
					</Typography>
				</Box>
			</CardContent>
		</StyledCard>
	);
};

export default ProductCard;
