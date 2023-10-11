import { Box, Container, Grid, InputAdornment, TextField } from "@mui/material";
import Post from "./Post";

import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

export const Feed = ({ setFilters, filters, products }) => {
	const [searchTerm, setSearchTerm] = useState(null);

	const handleChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleSearch = () => {
		setFilters({ ...filters, search: searchTerm });
	};

	return (
		<>
			<Container
				sx={{
					mt: 2,
					mb: 2,
					marginLeft: 0,
					marginRight: 0,
					paddingLeft: 0,
					paddingRight: 0,
					maxWidth: "100% !important",
				}}
			>
				<TextField
					id="search"
					type="search"
					label="Search"
					value={searchTerm}
					onChange={handleChange}
					sx={{ width: "100%" }}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<SearchIcon
									onClick={handleSearch}
									sx={{ cursor: "pointer" }}
								/>
							</InputAdornment>
						),
					}}
				/>
			</Container>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Box p={2}>
						<Grid container spacing={2}>
							{products?.map((product, index) => {
								return (
									<Grid
										item
										xs={6}
										sm={4}
										md={3}
										lg={2}
										xl={2}
										key={index}
									>
										<Post product={product} />
									</Grid>
								);
							})}
						</Grid>
					</Box>
				</Grid>
			</Grid>
		</>
	);
};
