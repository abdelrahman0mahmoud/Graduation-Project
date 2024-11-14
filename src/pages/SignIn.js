// import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../images/logo-removebg-preview.png"
import image from "../images/WhatsApp Image 2024-03-03 at 15.15.17_61742b5f.jpg"
import "../styles/signin.css"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


function SignIn(){
    const[userinfo,setuserinfo]=useState([]);
    const[emaill,setemaill]=useState('')
    const[passs,setpasss]=useState('')
    
    useEffect(()=>{
        fetch("http://localhost:9000/users")
        .then((res)=>res.json())
        .then((data)=>setuserinfo(data))
    },[])

    const checktr=((userinfo)=>{
        fetch(`http://localhost:9000/users/${userinfo.id}`,{
            method:"PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                id:userinfo.id,
                username:userinfo.username,
                email:userinfo.email,
                password:userinfo.password,
                check:true,
            }),
        }).then((res)=>res.json()).then((data)=>console.log(data));
    })

    const login=((e)=>{
        e.preventDefault();
        let check=false;
        for(let i=0;i<userinfo.length;i++){
            if(userinfo[i].email === emaill && userinfo[i].password === passs){
                check=true;
                checktr(userinfo[i]);
                break;
            }
        }
        if(check===true){
            setTimeout(() => {
                window.location="newchat"
            }, 1000);
        }
        return check;
    })  
    const back=(()=>{
        window.location="/"
    })
    return(
        <>
            <div className="whalepage" onSubmit={login}>
                <div className="form">
                    <div className="image imgg">
                        <img className="imgwomen women" src={image} alt=""/>
                    </div>
                    <div className="formbady fromsingin">
                        <FaArrowLeft className="iconback iconbk" onClick={(()=>back())}/>
                        <div className="titlecontent">
                            <img className="logoimage" src={logo} alt="logo_photo"/>
                            <h1 className="titleform">Black wizard</h1>
                        </div>
                        <p className="started get">Lets get <span className="creative">creative!</span></p>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="Email" className="form-label labell labelEmail le">Email</label>
                                <input type="text" placeholder="Enter your email" className="form-control input" id="Email" onChange={((e)=>setemaill(e.target.value))}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label labell labelPassword lp">Password</label>
                                <input type="password" placeholder="Enter your password" className="form-control input pas" id="password" onChange={((e)=>setpasss(e.target.value))}/>
                            </div>  
                            <div className="linkforrem">
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input check" id="exampleCheck1" />
                                <label className="form-check-label llabel" htmlFor="exampleCheck1">Remember me</label>
                            </div>
                            <Link className="forget">Forget Password ?</Link>
                            </div>
                            <button type="submit" className="btnsubmit btnn">Sign in</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignIn;