import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Divider,
	Rating,
	Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { v4 as uuidv4 } from "uuid";

const Post = ({ product }) => {
	const navigate = useNavigate();
	const { addToCart } = useCart();

	return (
		<Card>
			<CardActionArea>
				<CardMedia
					component="img"
					height="150"
					image={String(product.images[0])}
					alt={product.name}
					sx={{ objectFit: "cover" }}
					onClick={() => {
						navigate(`/product/${product._id}`);
					}}
				/>
				<CardContent>
					<Box
						onClick={() => {
							navigate(`/product/${product._id}`);
						}}
					>
						<Typography gutterBottom variant="h5" component="div">
							{product.name}
						</Typography>
						<Typography
							gutterBottom
							variant="h5"
							component="div"
							color={"orangered"}
						>
							RS. {product.price}
						</Typography>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							<Rating
								name="read-only"
								value={product.rating}
								readOnly
								size="small"
							/>
							<Typography variant="body2" color="text.secondary">
								{product.totalRatings} reviews
							</Typography>
						</Box>
						<Divider sx={{ my: 1 }} />
					</Box>
					<Button
						variant="contained"
						fullWidth
						color="warning"
						onClick={() => {
							addToCart({
								id: uuidv4(),
								product,
								quantity: 1,
							});
						}}
					>
						Add to cart
					</Button>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default Post;
