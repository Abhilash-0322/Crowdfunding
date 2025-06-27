import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { CampaignDetails, CreateCampaign, Profile, Home, Payment, Withdraw, Logout } from "./pages";
import { Sidebar, Navbar } from "./components";

export function App() {
	return (
		<Router>
			<div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
				<div className="sm:flex hidden mr-10 relative">
					<Sidebar />
				</div>
				<div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
					<Navbar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/create-campaign" element={<CreateCampaign />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/campaign/:id" element={<CampaignDetails />} />
						<Route path="/payment" element={<Payment />} />
						<Route path="/withdraw" element={<Withdraw />} />
						<Route path="/logout" element={<Logout />} />
					</Routes>
				</div>
			</div>
		</Router>
	);
}
