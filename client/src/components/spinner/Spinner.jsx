import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

const Spinner = () => {
	return (
		<div>
			<Backdrop
				sx={{
					color: "#fff",
					zIndex: (theme) => theme.zIndex.drawer + 999,
				}}
				open={true}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
		</div>
	);
};

export default Spinner;
