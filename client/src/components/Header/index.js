import React from "react";
import { Link } from 'react-router-dom';
import logo from "../../Images/MBDIRECTrojo-negro.png";
function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <a className="navbar-brand text-danger m-auto" href="/"><img className="navbar-brand" src={logo} alt="logo" width="130" height="50" /></a>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/about">About</a>
                    </li>
                    {/* <li className="nav-item">
                        <a className="nav-link" href="/">For Business</a>
                    </li> */}
                    <li className="nav-item">
                    <Link className="nav-link" to="/login" style={{color: "red", verticalAlign:"middle"}}> Login</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
export default Header;