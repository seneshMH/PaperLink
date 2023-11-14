import React, { useEffect, useState } from "react";

import SideBar from "./Sidebar";
import { Grid } from "@mui/material";
import { Feed } from "./Feed";

import { useMessage } from "../../hooks/message/Message";
import { useDispatch } from "react-redux";
import { GetProducts } from "../../apiCalls/products";
import { SetLoader } from "../../redux/loaderSlice";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";

function Shop() {
	const message = useMessage();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [filters, setFilters] = useState({
		status: "approved",
		category: [],
		search: null,
	});
	const [products, setProducts] = useState([]);

	const getData = async () => {
		try {
			dispatch(SetLoader(true));
			const response = await GetProducts(filters);

			if (response.success) {
				setProducts(response.data);
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			message.error(error.message);
			if (error.message === "Access denied") {
				navigate("/login");
			}
		} finally {
			dispatch(SetLoader(false));
		}
	};

	useEffect(() => {
		getData();
		// eslint-disable-next-line
	}, [filters]);

	return (
		<>
			<Grid container sx={{ width: "100%" }}>
				<Grid item xs={2} sx={{ display: { xs: "none", sm: "block" } }}>
					<SideBar setFilters={setFilters} filters={filters} />
				</Grid>
				<Grid item xs={10}>
					<Feed
						setFilters={setFilters}
						filters={filters}
						products={products}
					/>
				</Grid>
			</Grid>
			<Footer />
		</>
	);
}

export default Shop;
