import { Link } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { IoMdPricetag } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import { MdFeaturedPlayList } from "react-icons/md";
import { FaRegSquarePlus } from "react-icons/fa6";
import logo from "../images/logo-removebg-preview.png"
function Sidebar(){

    return(
        <>
            <div className="sidebar">
                    <div className="titlecontent logocont">
                        <img className="logoimage" src={logo} alt="logo_photo"/>
                        <h1 className="titleform">Black wizard</h1>
                    </div>
                    <div className="linksbar">
                        <ul className="ul">
                            <li><Link to="../homeuser" className="text-decoration-none"><IoMdHome className="iccon"/><span className="spann">Home</span></Link></li>
                            <li><Link to="/" className="text-decoration-none"><IoMdPricetag className="iccon"/><span className="spann">Pricing</span></Link></li>
                            <li><Link to='/' className="text-decoration-none"><FaInfoCircle className="iccon"/><span className="spann">About</span></Link></li>
                            <li><Link to="/" className="text-decoration-none"><MdFeaturedPlayList className="iccon"/><span className="spann">Features</span></Link></li>
                            <li><Link to="../newchat" className="text-decoration-none"><FaRegSquarePlus className="iccon"/><span className="spann">New chat</span></Link></li>
                        </ul>
                    </div>
            </div>
        </>
    )
}

export default Sidebar;