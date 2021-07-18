import {Circle} from "better-react-spinkit"
export default function Loading() {
    return (
        <center style={{display:"grid",placeItems:"center",height:"100vh"}} >
            <div >
                <img src="/call.png" height={200} style={{marginBottom:10}} />
                <Circle color="#2292D0" size={80}/>
                </div>
        </center>
    )
}
