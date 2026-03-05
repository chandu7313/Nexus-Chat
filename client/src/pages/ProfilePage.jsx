import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { IoCamera, IoMail, IoPerson, IoArrowBack, IoCheckmarkCircle } from 'react-icons/io5'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const ProfilePage = () => {
    const { authUser, isUpdatingProfile, updateProfile } = useContext(AuthContext)
    const [selectedImg, setSelectedImg] = useState(null)
    const [name, setName] = useState(authUser.fullName)
    const [isLoading, setIsLoading] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const navigate = useNavigate()

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = async () => {
            const base64Image = reader.result
            setSelectedImg(base64Image)
            await updateProfile({ profilePic: base64Image })
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        await updateProfile({ fullName: name })
        setIsLoading(false)
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 3000)
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            {/* Header / Back */}
            <div className="w-full max-w-xl flex items-center mb-8 px-2">
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors font-medium"
                >
                    <IoArrowBack size={20} />
                    <span>Back to Chat</span>
                </button>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl saas-card overflow-hidden bg-white"
            >
                <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                </div>

                <form onSubmit={handleSave} className="px-8 pb-10 -mt-12 relative z-10">
                    {/* Avatar Selection */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="relative group p-1.5 bg-white rounded-full shadow-md border border-divider">
                            <img 
                                src={selectedImg || authUser.profilePic || assets.avatar_icon} 
                                alt="profile" 
                                className="w-28 h-28 rounded-full object-cover border-4 border-white"
                            />
                            <label 
                                htmlFor="avatar-upload"
                                className={`absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-full shadow-lg cursor-pointer hover:bg-primary-hover transition-all active:scale-95 ${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''}`}
                            >
                                <IoCamera size={18} />
                                <input 
                                    type="file" 
                                    id="avatar-upload" 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleImageUpload}
                                    disabled={isUpdatingProfile}
                                />
                            </label>
                        </div>
                        <div className="mt-4 text-center">
                            <h2 className="text-xl font-bold text-text-primary">{authUser.fullName}</h2>
                            <p className="text-sm text-text-secondary">Personal Profile</p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 px-1">Full Name</label>
                            <div className="relative">
                                <IoPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-divider rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 px-1">Email Address</label>
                            <div className="relative opacity-70">
                                <IoMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input 
                                    type="email" 
                                    value={authUser.email}
                                    disabled
                                    className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-divider rounded-xl text-sm font-medium cursor-not-allowed"
                                />
                            </div>
                            <p className="text-[10px] text-text-muted mt-1.5 px-1 italic">Email cannot be changed for security reasons.</p>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <button 
                                type="submit" 
                                disabled={isLoading || isUpdatingProfile}
                                className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-sm shadow-md hover:bg-primary-hover transition-all flex items-center justify-center gap-2 group"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Update Profile
                                    </>
                                )}
                            </button>
                            
                            {isSaved && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center justify-center gap-2 text-success text-sm font-bold"
                                >
                                    <IoCheckmarkCircle size={20} />
                                    <span>Changes saved successfully!</span>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </form>
            </motion.div>
            
            <p className="mt-8 text-xs text-text-muted opacity-50 font-medium">NexusID: {authUser._id}</p>
        </div>
    )
}

export default ProfilePage
