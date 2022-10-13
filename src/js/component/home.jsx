import React, {useState, useEffect, useRef}  from "react";
import Main_body from "./main_body.jsx";

//create your first component
const Home = () => {
	return (
		<div className="col-12" style={{minWidth: "1115px", background:"#34495e"}}>
			<header className="p-4 bg-dark d-flex" style={{minHeight:"10vh"}}>
				<h1 className="text-light ms-4" style={{fontSize:"30px"}}>
					Audio player like Spotify with React.js
				</h1>
			</header>
			<Main_body />
		</div>
	);
};

export default Home;
