import React from "react";

import styled from "@emotion/styled";
import { Container, Divider, Grid, Typography } from "@mui/material";

import about from "./images/about.png";

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

function About() {
	return (
		<Section id="readMore">
			<Container maxWidth="md">
				<Grid container alignItems="center">
					{/* Text on the left */}
					<Grid item xs={12} sm={6}>
						<Typography variant="h4">About Us</Typography>
						<Divider sx={{ paddingBottom: "20px" }} />
						<Typography variant="body1" paragraph>
							PaperLink is a groundbreaking initiative dedicated
							to addressing the urgent need for reducing
							environmental damage caused by polythene through the
							promotion of sustainable paper alternatives. Our
							project aims to create a comprehensive marketplace
							that connects self-employed paper producers and raw
							material suppliers, revolutionizing the paper
							industry and driving positive change towards a
							greener and more sustainable future.
						</Typography>
					</Grid>

					{/* Image on the right */}
					<Grid item xs={12} sm={6}>
						<img
							src={about}
							alt="About Us"
							style={{ maxWidth: "100%", height: "auto" }}
						/>
					</Grid>
				</Grid>
			</Container>
		</Section>
	);
}

export default About;
