import Navbar from "../components/Navbar";
import "../styles/home.css"
import image from "../images/women.jpg"
import { Link } from "react-router-dom";

function Home(){
    return(
        <>
            <Navbar/>
            <div className="body-content">
                <div className="container">
                    <div className="titlecontent">
                        <h1 className="title">Create a realistic visual Demo
                        <img className="titlephoto" src={image} alt="women_photo" />
                        <span className="AI">using AI</span>
                        </h1>
                    </div>
                    <ul className="disc">
                        <li>Get AI generated images from text straight from your</li>
                        <li>browser very easily</li>
                        <li>30 Days free trail &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; No credit card required</li>
                        <button className="getstart"><Link to="signup" className="linksignup">Get started</Link></button>
                    </ul>
                    
                </div>
            </div>
        </>
    )
}

export default Home;