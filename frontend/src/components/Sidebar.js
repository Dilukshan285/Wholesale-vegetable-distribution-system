import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Sidebar.css";

function AppLayout() {
    return (
        <div className="app-container">
            <div className="sidebar">
                <div className="sidebar-brand">
                    <Link to="/" style={{ color: "red", textDecoration: "none" }}>
                        G.S.P. Traders
                    </Link>
                </div>
                <ul className="sidebar-nav">
                    <li className="nav-item">
                        <NavLink to="/" className="nav-link" activeClassName="active">
                            All Farmers
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/add" className="nav-link" activeClassName="active">
                            Create Farmer
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/get/:id" className="nav-link" activeClassName="active">
                            Get Farmer
                        </NavLink>
                    </li>
                    
                </ul>
            </div>
            <div className="main-content">
                {/* Your page content goes here */}
            </div>
        </div>
    );
}

export default AppLayout;
