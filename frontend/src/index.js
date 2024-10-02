import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider, Link, Navigate, redirect, useNavigate, BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./login.js";
import { Flex } from "antd";

const Root = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const PrivateRoute = ({ auth: { isAuthenticated }, children }) => {
        return isAuthenticated ? children : <Navigate to="/" />;
    };

    useEffect(() => {
        console.log(authenticated);
    }, [authenticated]);

    return (
        <Routes>
            <Route
                path="/"
                element={
					<Flex justify="center" style={{height: '100vh'}}>
						<LoginForm setAuthenticated={setAuthenticated}></LoginForm>
					</Flex>
                }
            />
			<Route
				path="/dashboard"
				element={
					<PrivateRoute auth={{isAuthenticated: authenticated}}>
						<div>
							<h1>Dashboard</h1>
							<Link to={"/dashboard/profile1"}>Go to profile1</Link>
						</div>
					</PrivateRoute>
				}
			/>
			<Route path="/dashboard/profile1" element={
				<PrivateRoute auth={{isAuthenticated: authenticated}}>
    				<React.StrictMode>
    					<App />
    				</React.StrictMode>
    			</PrivateRoute>
			}/>
        </Routes>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <Root />
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
