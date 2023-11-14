import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import { Box } from "@mui/material";

export default function Footer() {
	return (
		<Box
			sx={{
				overflowX: "hidden",
				width: "100vw",
				backgroundImage: "linear-gradient(to bottom, #149121, #4f8255)",
				color: "#fff",
				padding: "2rem 0",
			}}
		>
			<Box
				component="footer"
				sx={{
					backgroundColor: "transparent",
				}}
			>
				<Container maxWidth="lg">
					<Grid container spacing={5}>
						<Grid item xs={12} sm={4}>
							<Typography variant="h6" gutterBottom>
								About Us
							</Typography>
							<Typography variant="body2">
								We are PaperLink, dedicated to providing the
								best service to our customers.
							</Typography>
						</Grid>
						<Grid item xs={12} sm={4}>
							<Typography variant="h6" gutterBottom>
								Contact Us
							</Typography>
							<Typography variant="body2">
								123 Main Street, Anytown, USA
							</Typography>
							<Typography variant="body2">
								Email: info@example.com
							</Typography>
							<Typography variant="body2">
								Phone: +1 234 567 8901
							</Typography>
						</Grid>
						<Grid item xs={12} sm={4}>
							<Typography variant="h6" gutterBottom>
								Follow Us
							</Typography>
							<Link
								href="https://www.facebook.com/"
								color="inherit"
							>
								<Facebook />
							</Link>
							<Link
								href="https://www.instagram.com/"
								color="inherit"
								sx={{ ml: 1, mr: 1 }}
							>
								<Instagram />
							</Link>
							<Link
								href="https://www.twitter.com/"
								color="inherit"
							>
								<Twitter />
							</Link>
						</Grid>
					</Grid>
					<Box mt={5}>
						<Typography variant="body2" align="center">
							© {new Date().getFullYear()} PaperLink. All rights
							reserved.
						</Typography>
					</Box>
				</Container>
			</Box>
		</Box>
	);
}
