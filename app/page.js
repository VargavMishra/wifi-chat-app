"use client"

import { useState, useEffect } from "react"
import { io } from "socket.io-client"

const socket = io("http://192.168.1.112:3001") // Replace with your server's IP and port

export default function Home() {

const [name,setName]=useState("")
const [joined,setJoined]=useState(false)
const [users,setUsers]=useState([])
const [message,setMessage]=useState("")
const [chat,setChat]=useState([])

useEffect(()=>{

socket.on("users",(data)=>{
setUsers(Object.values(data))
})

socket.on("receiveMessage",(msg)=>{
setChat(prev=>[...prev,msg])
})

},[])

const joinChat=()=>{
socket.emit("join",name)
setJoined(true)
}

const sendMessage=()=>{
socket.emit("sendMessage",message)
setMessage("")
}

if(!joined){
return(
<div className="flex flex-col items-center justify-center h-screen gap-4">

<h1 className="text-3xl font-bold">WiFi Chat</h1>

<input
className="border p-2"
placeholder="Enter username"
onChange={(e)=>setName(e.target.value)}
/>

<button
className="bg-blue-500 text-white px-4 py-2"
onClick={joinChat}
>
Join Chat
</button>

</div>
)
}

return(
<div className="p-6">

<h1 className="text-2xl font-bold mb-4">WiFi Chat</h1>

<h2 className="font-semibold">Online Users</h2>

<ul className="mb-4">
{users.map((u,i)=>(
<li key={i}>{u}</li>
))}
</ul>

<div className="border h-64 overflow-y-scroll p-3 mb-3">
{chat.map((c,i)=>(
<p key={i}>
<b>{c.user}:</b> {c.text}
</p>
))}
</div>

<div className="flex gap-2">

<input
className="border p-2 flex-1"
value={message}
onChange={(e)=>setMessage(e.target.value)}
/>

<button
className="bg-green-500 text-white px-4"
onClick={sendMessage}
>
Send
</button>

</div>

</div>
)
}