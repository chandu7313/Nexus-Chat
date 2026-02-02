import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { BiSolidContact } from "react-icons/bi";
import { MdOutlineNotifications } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { FiSettings } from "react-icons/fi";
import { FaPowerOff } from "react-icons/fa6";
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { IoMdMenu } from "react-icons/io";


const dashOptions=[
    { optionName:"CHAT", icon:<IoChatbubbleEllipses/> },
    { optionName:"CONTACTS", icon:<BiSolidContact/> },
    { optionName:"NOTIFICATIONS", icon:<MdOutlineNotifications/> },
    { optionName:"CALENDER", icon:<SlCalender/> },
    { optionName:"SETTINGS", icon:<FiSettings/> },
    { optionName:"LOGOUT", icon:<FaPowerOff/> }
]


const Dashboard = () => {

    const {authUser} = useContext(AuthContext)
    const [selectedOption,setSelectedOption] = useState(dashOptions[0].optionName)
    const navigate = useNavigate()
    console.log(authUser)

    const {logout, onlineUsers} = useContext(AuthContext)

  return (
    <div className=" flex flex-col bg-white text-gray-500 w-full h-full relative max-md:hidden">
        <div className='flex justify-between items-center p-3'>
        <img src={assets.nexusLogo} alt="logo" className='max-w-8' />
            <div className="relative py-2 group">
                <IoMdMenu/>
                <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
                    <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
                    <hr className="my-2 border-t border-gray-500" />
                    <p onClick={()=> logout()} className='cursor-pointer text-sm'>Logout</p>
                </div>
            </div>
        </div>
        <div className='flex flex-col justify-center items-center mt-5'>
        
            <img src={authUser.profilePic} alt="" className='w-16 aspect-[1/1] rounded-full cursor-pointer mb-2'/>
            <h3>{authUser.fullName}</h3>
        </div>
        <div className='flex flex-col gap-7 items-center w-full mt-12 flex-1'>
            {
                dashOptions.map((option,index)=>(
                    index != 5 && 
                    <div key={index} 
                        onClick={()=>setSelectedOption(option.optionName)}
                        className={`py-2 px-7 flex gap-4 justify-start items-center cursor-pointer w-full  box-border ${selectedOption === option.optionName ? "text-[#00AAFF] border-l-4 border-l-[#00AAFF]":"border-l-4 border-l-transparent"}`}>
                        {option.icon}
                        <h2 className='text-xs font-bold'>{option.optionName}</h2>
                    </div>
                ))
            }
        </div>
        <div className='flex gap-4 justify-start items-center cursor-pointer w-full p-7'>
            {dashOptions[5].icon}
            <h3 className='text-xs font-bold'  onClick={()=> logout()}>{dashOptions[5].optionName}</h3>
        </div>
    </div>
  )
}

export default Dashboard
