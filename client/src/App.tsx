import { ConnectButton } from "thirdweb/react";
import thirdwebIcon from "./thirdweb.svg";
import { client } from "./client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { CampaignDetails,CreateCampaign,Profile,Home } from "./pages";
import { Sidebar, Navbar } from "./components";

export function App() {
	return (
		<div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
			<div className="sm:flex hidden mr-10 relative">
				Sidebar
			</div>

			<div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
				<Navbar/>
				<Router>
					<Routes>
						<Route path="/" element={<Home/>}/>
					</Routes>
				</Router>
			</div>
		</div>
	);
}
