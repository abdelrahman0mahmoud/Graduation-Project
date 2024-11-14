import "../styles/signin.css"
import "../styles/homeuser.css"
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useRecoilState } from "recoil";
import imagestate from "../recoil/imagestate";
import textstate from "../recoil/textstate";

function Homeuser(){
    const [check ,setcheck]=useState([]);
    const [image,setImage]=useRecoilState(imagestate)
    const [text,settext]=useRecoilState(textstate)
    const back=(()=>{
        window.location="/"
    })
    useEffect(()=>{
        fetch("http://localhost:9000/users")
        .then((res)=>res.json())
        .then((data)=>setcheck(data))
    },[])
    return(
        
        <>
            <div className="homeview">
                <Sidebar/>
                <div className="homecontent">
                    <FaArrowLeft className="iconback iconbkk" onClick={(()=>back())}/>
                    <div className="gencontent">
                        <div className="gentitle">
                            <h2 className="gentitle">Generate your AI</h2>
                            <div className="userinfo">
                            {check.map((ch) => {
                                if (ch.check === true) {
                                    return (
                                        <div className="usercontent" key={ch.username}>
                                            <h4 className="nameuser">{ch.username}</h4>
                                            <p className="emailuser">{ch.email}</p>
                                        </div>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                            </div>
                        </div>
                        <div className="history">
                            {
                                (image?
                                    <div className="history-content">
                                        <div className="img-con">
                                            <img src={image} alt=""/>
                                        </div>
                                        <div className="history-body">
                                            <p className="history-cap">{text}</p>
                                        </div>
                                    </div>
                                :null)
                            }
                        </div>
                    </div>
                </div>  
            </div>
        </>
    )
}
export default Homeuser;