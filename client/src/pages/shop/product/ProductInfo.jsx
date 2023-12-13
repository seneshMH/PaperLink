import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../redux/loaderSlice";
import { GetProductById } from "../../../apiCalls/products";
import { useMessage } from "../../../hooks/message/Message";
import { Container } from "@mui/material";

import Gallery from "./Gallery";
import MobileGallery from "./MobileGallery";
import Description from "./Description";
import "./ProductInfo.css";

function ProductInfo() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const message = useMessage();

	const [product, setProduct] = useState(null);

	const getData = async () => {
		try {
			dispatch(SetLoader(true));
			const response = await GetProductById(id);

			if (response.success) {
				setProduct(response.data);
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

	const [quant, setQuant] = useState(0);
	const [orderedQuant, setOrderedQuant] = useState(0);

	const addQuant = () => {
		setQuant(quant + 1);
	};

	const removeQuant = () => {
		setQuant(quant - 1);
	};

	const resetQuant = () => {
		setQuant(0);
		setOrderedQuant(0);
	};

	return (
		product && (
			// {product.name}
			// {product.price}
			// {product.description}
			// {product.category}

			<main className="App">
				<Container component="section" maxWidth={"lg"}>
					<section className="core">
						<Gallery product={product} />
						<MobileGallery product={product} />
						<Description
							product={product}
							onQuant={quant}
							onAdd={addQuant}
							onRemove={removeQuant}
							onSetOrderedQuant={setOrderedQuant}
						/>
					</section>
				</Container>
			</main>
		)
	);
}

export default ProductInfo;
