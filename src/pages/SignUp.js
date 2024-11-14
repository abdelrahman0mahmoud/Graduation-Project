import { Link } from "react-router-dom";
import"../styles/signup.css"
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import logo from "../images/logo-removebg-preview.png"
import image from "../images/WhatsApp Image 2024-03-03 at 15.15.17_61742b5f.jpg"



function SignUp(){

    const[name,setname]=useState('')
    const[email,setemail]=useState('')
    const[pass,setpass]=useState('')
    
    const formsubmit=((e)=>{
        e.preventDefault();
        fetch('http://localhost:9000/users',{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                username:name,
                email:email,
                password:pass,
                check:false,
            }),
        }).then((res)=>res.json()).then((data)=>console.log(data));
        window.location='SignIn'
    })
        
    const back=(()=>{
        window.location="/"
    })
    return(
        <>
            <div className="whalepage" onSubmit={formsubmit}>
                <div className="form">
                    <div className="formbady">
                        <FaArrowLeft className="iconback" onClick={(()=>back())}/>
                        <div className="titlecontent">
                            <img className="logoimage" src={logo} alt="logo_photo"/>
                            <h1 className="titleform">Black wizard</h1>
                        </div>
                        <p className="started">Get started</p>
                        <p className="ready">Already have an account ? <Link className="signin" to="../signin">Sign in</Link></p>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="Name" className="form-label labell labelname">Name</label>
                                <input type="text" placeholder="Enter your name" className="form-control input" id="Name" onChange={((e)=>setname(e.target.value))}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Email" className="form-label labell labelEmail">Email</label>
                                <input type="text" placeholder="Enter your email" className="form-control input" id="Email" onChange={((e)=>setemail(e.target.value))}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label labell labelPassword">Password</label>
                                <input type="password" placeholder="Enter your password" className="form-control input" id="password" onChange={((e)=>setpass(e.target.value))}/>
                            </div>
                            <button type="submit" className="btnsubmit">Sign up</button>
                        </form>
                    </div>
                    <div className="image">
                        <img className="imgwomen" src={image} alt=""/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUp;