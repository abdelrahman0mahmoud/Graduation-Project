import { Link } from "react-router-dom";
import "../styles/Navbar.css"
import logo from "../images/logo-removebg-preview.png"

function Navbar(){
    return(
        <>
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container">
                    <div>
                        <img className="logotitle" src={logo} alt="logo_photo"/>
                        <Link className="navbar-brand logo" to={"/"}>Black Wizard</Link>
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto me-auto mb-2 mb-lg-0 links">
                        <li className="nav-item">
                        <Link className="nav-link" aria-current="page" to={"/"}>Home</Link>
                        </li>
                        <li className="nav-item">
                        <Link className="nav-link" to={"/about"}>About</Link>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="#/">Pricing</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="#/">Features</a>
                        </li>
                    </ul>
                    <div className="buttons">
                        <Link className="button login text-decoration-none" to="/signin">Login</Link>
                        <Link className="button Sign" to="/signup">Sign up</Link>
                    </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
export default Navbar;