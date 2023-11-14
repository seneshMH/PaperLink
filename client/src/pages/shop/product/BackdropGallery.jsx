import React, { useState, useEffect } from "react";
import { Backdrop, IconButton } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const BackdropGallery = ({
	open,
	handleClose,
	currentPassedImage,
	product,
}) => {
	const IMAGES = product.images;
	const THUMBS = product.images;

	const [backdropImage, setBackdropImage] = useState(currentPassedImage);
	const [currentPassedImageIndex, setCurrentPassedImageIndex] = useState(1);

	useEffect(() => {
		setBackdropImage(currentPassedImage);
		IMAGES.forEach((imgg, index) => {
			imgg === currentPassedImage && setCurrentPassedImageIndex(index);
		});
	}, [currentPassedImage]);

	const handleClick = (index = null) => {
		setBackdropImage(IMAGES[index]);
		setCurrentPassedImageIndex(index);
	};

	const handleIncrement = () => {
		if (currentPassedImageIndex === IMAGES.length - 1) {
			setBackdropImage(IMAGES[0]);
			setCurrentPassedImageIndex(0);
		} else {
			setBackdropImage(IMAGES[currentPassedImageIndex + 1]);
			setCurrentPassedImageIndex(currentPassedImageIndex + 1);
		}
	};

	const handleDecrement = () => {
		if (currentPassedImageIndex === 0) {
			setBackdropImage(IMAGES[IMAGES.length - 1]);
			setCurrentPassedImageIndex(IMAGES.length - 1);
		} else {
			setBackdropImage(IMAGES[currentPassedImageIndex - 1]);
			setCurrentPassedImageIndex(currentPassedImageIndex - 1);
		}
	};

	const removeActivatedClass = (parent) => {
		parent.childNodes.forEach((node) => {
			node.childNodes[0].classList.contains("activated") &&
				node.childNodes[0].classList.remove("activated");
		});
	};

	return (
		<Backdrop
			className="backdrop"
			sx={{
				color: "#fff",
				backgroundColor: "rgba(0, 0, 0, 0.8)",
				zIndex: (theme) => theme.zIndex.drawer + 1,
			}}
			open={open}
		>
			<section className="backdrop-content">
				<IconButton
					onClick={handleClose}
					sx={{
						color: "#fff",
						bgcolor: "transparent",
						alignSelf: "flex-end",
					}}
				>
					<CloseIcon fillColor={"#fff"} />
				</IconButton>
				<div className="image">
					<IconButton
						className="icon-button-prev"
						disableRipple
						onClick={() => {
							handleDecrement();
							removeActivatedClass(
								document.querySelector(".thumbnails")
							);
						}}
						sx={{
							height: "42px",
							width: "42px",
							bgcolor: "#fff",
						}}
					>
						<ArrowBackIcon />
					</IconButton>
					<IconButton
						className="icon-button-next"
						disableRipple
						onClick={() => {
							handleIncrement();
							removeActivatedClass(
								document.querySelector(".thumbnails")
							);
						}}
						sx={{
							height: "42px",
							width: "42px",
							bgcolor: "#fff",
						}}
					>
						<NavigateNextIcon />
					</IconButton>
					<img
						src={backdropImage}
						alt="selected-product"
						style={{ cursor: "auto" }}
					/>
				</div>
				<div className="thumbnails">
					{THUMBS.map((th, index) => {
						return (
							<div
								className="img-holder-backd"
								key={index}
								onClick={(e) => {
									handleClick(index);
									removeActivatedClass(
										e.currentTarget.parentNode
									);
									e.currentTarget.childNodes[0].classList.toggle(
										"activated"
									);
								}}
							>
								<div
									className={`outlay ${
										index === currentPassedImageIndex &&
										"activated"
									}`}
								></div>
								<img src={th} alt={`product-${index + 1}`} />
							</div>
						);
					})}
				</div>
			</section>
		</Backdrop>
	);
};

export default BackdropGallery;
