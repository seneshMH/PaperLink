import React, { useEffect, useState } from "react";
import { Button, Container, Grid, Typography } from "@mui/material";
import styled from "@emotion/styled";

import ProductCard from "./ProductCard";

import backgroundImage from "./images/background.jpg";
import image1 from "./images/hero.png";

import image3 from "./images/image2.jpg";
import logo from "./images/logo.png";

import "./Home.css";
import { GetLatestProducts } from "../../apiCalls/products";
import { useMessage } from "../../hooks/message/Message";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loaderSlice";
import { useNavigate } from "react-router-dom";
import About from "../../components/aboutUS/About";
import Footer from "../../components/footer/Footer";
import Contact from "../../components/contact/Contact";

const RootContainer = styled.div`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const Section = styled.div`
	min-height: 100vh;
	width: 100vw;
	overflow: hidden;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	background: linear-gradient(
		to right,
		rgba(52, 152, 219, 0.1),
		rgba(41, 128, 185, 0.2)
	);
`;

const BackgroundImage = styled.div`
	background-image: ${(props) => `url(${props.backgroundImage})`};
	background-size: cover;
	background-attachment: fixed;
	background-position: center;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	filter: blur(2px); /* Apply a 4px blur to the background image */
	z-index: -1; /* Place the background image behind the content */
	opacity: 0.6; /* Adjust the opacity as needed */
`;

const LeftContent = styled.div`
	flex: 1;
	padding: ${(props) => props.theme.spacing(4)}px;
	border-radius: 8px;
	text-align: left;
`;

const ButtonContainer = styled.div`
	margin-top: 20px;
`;

const RightImage = styled.div`
	flex: 1;
	min-height: 100vh;
	background-image: ${(props) => `url(${props.backgroundImage})`};
	background-size: cover;
	background-attachment: fixed;
	background-position: center;
	position: relative;
	top: 0;
	right: 0;
	bottom: 0;
	width: 50%;
	mask-image: ${(props) => `url(${props.backgroundImage})`};
	mask-size: cover;
	mask-repeat: no-repeat;
	mask-position: center;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const LogoContainer = styled.div`
	width: 450px;
	height: 450px;
	background-color: #27b86d;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
`;

const Logo = styled.img`
	width: 400px;
	height: auto;
	filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
`;

function Home() {
	const message = useMessage();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [products, setProducts] = useState([]);

	const getData = async () => {
		try {
			dispatch(SetLoader(true));
			//get latest products
			const response = await GetLatestProducts();
			if (response.success) {
				setProducts(response.data);
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
		// eslint-disable-next-line
	}, []);

	return (
		<RootContainer>
			<Section className="Section">
				<BackgroundImage
					backgroundImage={backgroundImage}
				></BackgroundImage>
				<LeftContent>
					<Container maxWidth="md">
						<div style={{ textAlign: "left", paddingLeft: "20px" }}>
							<Typography variant="h1" color={"primary"}>
								PAPER LINK
							</Typography>
							<Typography
								variant="h5"
								color={"#383737"}
								paragraph
							>
								"An online marketplace linking paper makers and
								sustainable raw material suppliers."
							</Typography>
							<ButtonContainer>
								<Button
									variant="contained"
									color="primary"
									sx={{ marginRight: "10px" }}
									onClick={() => {
										document
											.querySelector("#readMore")
											.scrollIntoView({
												behavior: "smooth",
											});
									}}
								>
									READ MORE
								</Button>
								<Button
									variant="outlined"
									color="primary"
									onClick={() => {
										document
											.querySelector("#contact")
											.scrollIntoView({
												behavior: "smooth",
											});
									}}
								>
									CONTACT US
								</Button>
							</ButtonContainer>
						</div>
					</Container>
				</LeftContent>
				<RightImage backgroundImage={image1}>
					<LogoContainer>
						<Logo src={logo} alt="Logo" />
					</LogoContainer>
				</RightImage>
			</Section>

			<About />

			<Section>
				<BackgroundImage backgroundImage={image3}></BackgroundImage>
				<Container maxWidth="md">
					<Typography
						variant="h4"
						sx={{ fontSize: "28px", paddingBottom: "20px" }}
					>
						Featured Products
					</Typography>

					{/* Featured product cards */}
					<Grid container spacing={2} sx={{ paddingBottom: "20px" }}>
						{products?.map((product, index) => (
							<Grid item xs={12} sm={6} md={3} key={index}>
								{/* Replace this with your product card component */}
								<ProductCard product={product} isNew={true} />
							</Grid>
						))}
					</Grid>

					{/* "See More" button */}
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							navigate("/shop");
						}}
					>
						See More
					</Button>
				</Container>
			</Section>
			<Contact />

			<Footer />
		</RootContainer>
	);
}

export default Home;
