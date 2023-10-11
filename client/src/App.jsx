import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import { useSelector } from "react-redux";
import Spinner from "./components/spinner/Spinner";
import ProtctedPage from "./components/protectedPage/ProtctedPage";
import PapermakerDashboard from "./pages/dashbord/papermaker/PapermakerDashboard";
import AdminDashboard from "./pages/dashbord/admin/AdminDashbord";
import SupplierDashboard from "./pages/dashbord/supplier/SupplierDashboard";
import BuyerDashboard from "./pages/dashbord/buyer/BuyerDashboard";
import ProductInfo from "./pages/shop/product/ProductInfo";
import ChatPage from "./pages/dashbord/supplier/chats/ChatPage";
import Shop from "./pages/shop/Shop";
import Checkout from "./components/navbar/checkout/Checkout";
import Success from "./pages/order/Success";
import Cancel from "./pages/order/Cancle";
import AboutUS from "./pages/aboutUs/AboutUS";
import ContactUS from "./pages/contactUS/ContactUS";
import BidSuccess from "./pages/bid/BidSuccess";
import BidCancel from "./pages/bid/BidCancel";

function App() {
	const { loading } = useSelector((state) => state.loaders);
	return (
		<div>
			{loading && <Spinner />}
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={
							<ProtctedPage>
								<Home />
							</ProtctedPage>
						}
					/>
					<Route
						path="/aboutUS"
						element={
							<ProtctedPage>
								<AboutUS />
							</ProtctedPage>
						}
					/>
					<Route
						path="/contactUS"
						element={
							<ProtctedPage>
								<ContactUS />
							</ProtctedPage>
						}
					/>
					<Route
						path="/shop"
						element={
							<ProtctedPage>
								<Shop />
							</ProtctedPage>
						}
					/>
					<Route
						path="/checkout"
						element={
							<ProtctedPage>
								<Checkout />
							</ProtctedPage>
						}
					/>
					<Route path="/order">
						<Route
							index
							element={<ProtctedPage>{404}</ProtctedPage>}
						/>
						<Route
							path="success/:orderId"
							element={
								<ProtctedPage>
									<Success />
								</ProtctedPage>
							}
						/>
						<Route
							path="cancel/:orderId"
							element={
								<ProtctedPage>
									<Cancel />
								</ProtctedPage>
							}
						/>
					</Route>
					<Route path="/bid">
						<Route
							index
							element={<ProtctedPage>{404}</ProtctedPage>}
						/>
						<Route
							path="success/:bidId"
							element={
								<ProtctedPage>
									<BidSuccess />
								</ProtctedPage>
							}
						/>
						<Route
							path="cancel/:bidId"
							element={
								<ProtctedPage>
									<BidCancel />
								</ProtctedPage>
							}
						/>
					</Route>
					<Route
						path="/product/:id"
						element={
							<ProtctedPage>
								<ProductInfo />
							</ProtctedPage>
						}
					/>
					<Route
						path="/papermaker-dashboard"
						element={
							<ProtctedPage>
								<PapermakerDashboard />
							</ProtctedPage>
						}
					/>
					<Route
						path="/buyer-dashboard"
						element={
							<ProtctedPage>
								<BuyerDashboard />
							</ProtctedPage>
						}
					/>
					<Route
						path="/admin-dashboard"
						element={
							<ProtctedPage>
								<AdminDashboard />
							</ProtctedPage>
						}
					/>
					<Route
						path="/supplier-dashboard"
						element={
							<ProtctedPage>
								<SupplierDashboard />
							</ProtctedPage>
						}
					/>
					<Route
						path="/chats/:id"
						element={
							<ProtctedPage>
								<ChatPage />
							</ProtctedPage>
						}
					/>
					<Route path="/register" element={<Register />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
