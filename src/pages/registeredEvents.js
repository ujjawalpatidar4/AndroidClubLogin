import { collection } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { Authcontext } from "../contextProvider"
import { db } from "../firebaseconfig"
import { where,query } from "firebase/firestore"
import { getDocs } from "firebase/firestore"
import Stream from "./EventStream"
import { Link } from "react-router-dom"

function RegisteredEvents(){
    const {currentUser} = useContext(Authcontext)
    const [userDetails,setDetails] = useState([])
    const [eventDetails,setEvDt] = useState({})
    const [vis,setVis] = useState("hidden")
    const [Evid,setId] = useState("")
    const userRef = collection(db,"users")
    const eventRef  = collection(db,"events")
    // const eventRef = collection (db,"events")
    const UserEvents = async()=>{
        const q= query(userRef,where('email','==',currentUser.email))
        const temp = []
        const querySnapShot = await getDocs(q)
        try{
            querySnapShot.forEach((doc)=>{
                temp.push(doc.data())
            })
            setDetails(temp[0].allRegisteredEvents)
        }catch(err){
            console.log(err)
        }
    }
    useEffect(()=>{
        console.log(eventDetails.YouTubeVidId)
    },[eventDetails])
    const HandleBack=()=>{
        setVis("hidden")
        setEvDt({})
    }
    const HandleClick = async (Event) =>{
        setVis("visible")
        const q= query(eventRef,where('notificationGroup','==',Event.notificationGroup))
        const temp = []
        const querySnapShot = await getDocs(q)
        try{
            querySnapShot.forEach((doc)=>{
                temp.push(doc.data())
            })
            setEvDt(temp[0])
        }catch(err){
            console.log(err)
        }
    }
    useEffect(()=>{
        UserEvents()
    },[])
    return(
        <div className="Home">
            <Navbar/>
            <div className="RgEvents">
                {
                    userDetails.map((Event,i)=>(
                        <div className="Event"  onClick={()=>{HandleClick(Event)}} style={{backgroundImage:`url(${Event.bannerURL})`}}>
                            <div className="moreInfo">
                                <div className="EventName">{Event.name}</div>
                                <p className="mode" style={{fontSize:'150%'}}><b>Location:  </b>{Event.location}</p>
                                <p className="description">{Event.description}</p>
                                <p className="time"><b>Time:  </b>{Event.time}</p>
                                <p className="Price"><b>Price:  ₹</b>{Event.price}</p>
                            </div>
                            {
                                Event.YouTubeVidId && 
                                <button className="RegisterBtn">Register</button>
                            }
                        </div>
                    ))
                }
                {/* <Stream YtID='qVUv8PCRHCc' vis={`${vis}`}/> */}
            </div>
            <div className="PopUpWindow" onClick={()=>HandleBack()} style={{visibility:`${vis}`}}>
                <div className="LivePopUp">
                    <div className="StreamPage">
                        <iframe id="ytplayer" type="text/html" 
                        src={`https://www.youtube.com/embed/${eventDetails.YouTubeVidId}?autoplay=1&origin=http://example.com`}
                        frameborder="0" allowfullscreen="allowfullscreen"></iframe>
                        <iframe className="comments" width="185" height="315" src={`https://www.youtube.com/live_chat?v=${eventDetails.YouTubeVidId}&embed_domain=localhost:3001/LiveStream" frameborder="0`}></iframe>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RegisteredEvents