import React, { useState, useEffect } from "react";
import BackdropGallery from "./BackdropGallery";

const Gallery = ({ product }) => {
	const IMAGES = product.images;
	const THUMBS = product.images;

	const [currentImage, setCurrentImage] = useState(product.images[0]);
	const [currentPassedImage, setCurrentPassedImage] = useState(
		product.images[0]
	);

	const [open, setOpen] = useState(false);
	const handleClick = (index) => {
		setCurrentImage(IMAGES[index]);
	};
	const handleToggle = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};
	const removeActivatedClass = (parent) => {
		parent.childNodes.forEach((node) => {
			node.childNodes[0].classList.contains("activated") &&
				node.childNodes[0].classList.remove("activated");
		});
	};
	useEffect(() => {
		setCurrentPassedImage(currentImage);
	}, [currentImage]);

	return (
		<section className="gallery-holder hide-in-mobile">
			<section className="gallery">
				<div className="image">
					<img
						src={currentImage}
						alt="product-1"
						onClick={handleToggle}
					/>
				</div>
				<BackdropGallery
					handleClose={handleClose}
					open={open}
					currentPassedImage={currentPassedImage}
					product={product}
				/>
				<div className="thumbnails">
					{THUMBS.map((th, index) => {
						return (
							<div
								className="img-holder"
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
										index === 0 && "activated"
									}`}
								></div>
								<img src={th} alt={`product-${index + 1}`} />
							</div>
						);
					})}
				</div>
			</section>
		</section>
	);
};

export default Gallery;
