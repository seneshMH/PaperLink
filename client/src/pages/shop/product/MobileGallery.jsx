import { IconButton } from "@mui/material";
import React, { useState } from "react";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const MobileGallery = ({ product }) => {
	const IMAGES = product.images;
	const [currentMobileImage, setCurrentMobileImage] = useState(
		product.images[0]
	);
	const [mobileImageIndex, setMobileImageIndex] = useState(1);

	const handleIncrement = () => {
		if (mobileImageIndex === IMAGES.length - 1) {
			setCurrentMobileImage(IMAGES[0]);
			setMobileImageIndex(0);
		} else {
			setCurrentMobileImage(IMAGES[mobileImageIndex + 1]);
			setMobileImageIndex(mobileImageIndex + 1);
		}
	};

	const handleDecrement = () => {
		if (mobileImageIndex === 0) {
			setCurrentMobileImage(IMAGES[IMAGES.length - 1]);
			setMobileImageIndex(IMAGES.length - 1);
		} else {
			setCurrentMobileImage(IMAGES[mobileImageIndex - 1]);
			setMobileImageIndex(mobileImageIndex - 1);
		}
	};

	return (
		<section className="mobile-gallery hide-in-desktop">
			<IconButton
				className="icon-button-prev"
				disableRipple
				onClick={handleDecrement}
				sx={{
					height: "42px",
					width: "42px",
					bgcolor: "#fff",
				}}
			>
				<ArrowBackIcon />
			</IconButton>
			<img src={currentMobileImage} alt="featured-product" />
			<IconButton
				className="icon-button-next"
				disableRipple
				onClick={handleIncrement}
				sx={{
					height: "42px",
					width: "42px",
					bgcolor: "#fff",
				}}
			>
				<NavigateNextIcon />
			</IconButton>
		</section>
	);
};

export default MobileGallery;
