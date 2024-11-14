import React, { useEffect, useRef, useState } from "react"; 
import Sidebar from "../components/Sidebar";
import "../styles/newchat.css"
import { FaArrowLeft } from "react-icons/fa";
import { BsFillSendFill } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import load from "../images/output-onlinegiftools.gif"
import { useRecoilState } from "recoil";
import imagestate from "../recoil/imagestate";
import textstate from "../recoil/textstate";

function Newchat(){
    const [image,setImage]=useRecoilState(imagestate)
    const [text,settext]=useRecoilState(textstate)
    const [loading, setLoading] = useState([]);
    let inputRef=useRef(null);
    useEffect(() => {
        inputRef.current.focus();
        }, []);
        const imageGeneration=async()=>{
            if(inputRef.current.value===""){
                return 0;
            }
            setLoading(load);
            if(true){
                    setImage("")
                    settext(inputRef.current.value)
                    const response =await fetch(
                        "https://api.openai.com/v1/images/generations",
                        {
                            method:"POST",
                            headers:{
                                "Content-Type":"application/json",
                                Authorization:
                                "Bearer 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",
                                "User-Agent":"Chrome",
                            },
                            body:JSON.stringify({
                                prompt:`${inputRef.current.value}`,
                                n:1,
                                size:"512x512",
                            }),
                        }
                    );
                    if(response.status===400){
                        setLoading("")
                        alert("bad word")
                    }
                    else{
                        let data=await response.json();
                        setImage(data.data[0].url);
                        if(data.data[0].url !== ''){
                            setLoading("")
                        }
                    }
                }
            }
        const [check ,setcheck]=useState([]);
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
            <div className="newchat-home">
                <Sidebar/>
                <div className="newchat-content">
                    <div className="newchat-header">
                        <FaArrowLeft className="iconback iconbkk" onClick={(()=>back())}/>
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
                    <hr className="hr"/>
                    <div className="newchatbody">
                        <div className='img-loading'>
                            <div className="filters-container">
                                <div className="filter-item">
                                    <FaDownload />
                                </div>
                            </div>
                            {loading && <div><img className="loading" src={loading} alt=""/></div>}
                            <img src={image} alt=""/>
                        </div>
                    </div>
                    <div className='search-box' >
                            <input type="text" className='search-input' ref={inputRef} placeholder='Enter Your text ...' />
                            <BsFillSendFill className="iconsend" onClick={()=>{imageGeneration()}}/>
                    </div>
                </div>
                
            </div>
            
        </>
    )
}

export default Newchat;