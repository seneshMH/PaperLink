import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import QuantityButton from "./QuantityButton";
import { Button } from "@mui/material";
import { useCart } from "../../../context/CartContext";

import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";

const Description = ({
	onQuant,
	onAdd,
	onRemove,
	onSetOrderedQuant,
	product,
}) => {
	const { addToCart } = useCart();

	const { user } = useSelector((state) => state.users);

	return (
		<section className="description">
			<p className="pre">Papers</p>
			<h1>{product.name}</h1>
			<p className="desc">{product.description}</p>
			<div className="price">
				<div className="main-tag">RS.{product.price}</div>
			</div>
			{user && user.role === "buyer" && (
				<div className="buttons">
					<QuantityButton
						onQuant={onQuant}
						onRemove={onRemove}
						onAdd={onAdd}
					/>
					<Button
						onClick={() => {
							onSetOrderedQuant(onQuant);
							if (onQuant > 0)
								addToCart({
									id: uuidv4(),
									product,
									quantity: onQuant,
								});
						}}
						endIcon={<ShoppingCartIcon />}
					>
						add to cart
					</Button>
				</div>
			)}
		</section>
	);
};

export default Description;
