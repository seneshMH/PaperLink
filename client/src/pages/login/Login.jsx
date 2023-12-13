import React from "react";
import {
	Container,
	Typography,
	TextField,
	Button,
	Grid,
	Link,
	Box,
} from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import { LoginUser } from "../../apiCalls/users";
import { useMessage } from "../../hooks/message/Message";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loaderSlice";
import Footer from "../../components/footer/Footer";

const Login = () => {
	const message = useMessage();

	const dispatch = useDispatch();

	const handleLogin = async (e) => {
		e.preventDefault();
		const email = e.target.email.value;
		const password = e.target.password.value;

		const payload = {
			email,
			password,
		};

		try {
			dispatch(SetLoader(true));
			const response = await LoginUser(payload);

			if (response.success) {
				message.success(response.message);
				localStorage.setItem("token", response.token);
				window.location.href = "/";
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			message.error(error.message);
		} finally {
			dispatch(SetLoader(false));
		}
	};

	return (
		<div>
			<Navbar hideIcons={true} />
			<Container maxWidth="xs" sx={{ height: "50vh" }}>
				<Box sx={{ marginTop: 8 }}>
					<Typography variant="h5" align="center" gutterBottom>
						Login
					</Typography>
					<form onSubmit={handleLogin}>
						<TextField
							id="email"
							label="Email"
							type="email"
							variant="outlined"
							margin="normal"
							fullWidth
							required
						/>
						<TextField
							id="password"
							label="Password"
							type="password"
							variant="outlined"
							margin="normal"
							fullWidth
							required
						/>
						<Button
							type="submit"
							variant="contained"
							fullWidth
							sx={{ marginTop: 2, marginBottom: 2 }}
						>
							Login
						</Button>
					</form>
					<Grid container>
						<Grid item xs>
							<Link href="#" variant="body2">
								Forgot password?
							</Link>
						</Grid>
						<Grid item>
							<Link href="/register" variant="body2">
								Don't have an account? Sign Up
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Container>
			<Footer />
		</div>
	);
};

export default Login;
