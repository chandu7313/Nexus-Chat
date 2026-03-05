import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import Button from '../components/ui/Button'
import { IoMail, IoLockClosed, IoPersonCircle, IoDocument } from "react-icons/io5"
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedAvatars from '../components/ui/AnimatedAvatars'

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const { login } = useContext(AuthContext)

  const onSubmitHandler = (event) => {
    event.preventDefault()

    if (currState === 'Sign up' && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }

    login(currState === "Sign up" ? 'signup' : 'login', { fullName, email, password, bio })
  }

  return (
    <div className='min-h-screen flex bg-gray-50'>
      
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className='hidden lg:flex flex-col justify-center items-center w-1/2 bg-gray-900 text-white p-12 relative overflow-hidden'>
        
        {/* Animated Background Visualization */}
        <AnimatedAvatars />

        <div className="absolute bottom-12 flex flex-col items-center text-center z-10 max-w-md">
          <h1 className='text-4xl font-bold tracking-tight mb-3'>
            NEXUS
          </h1>
          <p className='text-sm text-gray-400 leading-relaxed font-medium'>
            The next generation of <span className="text-white font-semibold">real-time</span> collaboration. Seamless, secure, and stunning.
          </p>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12'>
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
        >
          {/* Header */}
          <div className='flex justify-between items-start mb-8'>
            <div>
              <h2 className='text-3xl font-bold text-gray-800 mb-1.5'>
                {currState === "Sign up" ? (isDataSubmitted ? "Almost there" : "Join us") : "Welcome back"}
              </h2>
              <p className='text-[10px] font-bold text-blue-500 uppercase tracking-widest'>
                {currState === "Sign up" ? "Create your legacy" : "Continue your journey"}
              </p>
            </div>
            
            {isDataSubmitted && (
              <button
                type="button"
                onClick={() => setIsDataSubmitted(false)}
                className='p-2 rounded-xl bg-gray-50 text-gray-500 hover:text-blue-500 hover:bg-gray-100 transition-colors'
              >
                <img src={assets.arrow_icon} alt="back" className='w-4' />
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
            <AnimatePresence mode='wait'>
              {currState === "Sign up" && !isDataSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='flex flex-col gap-1.5'
                >
                  <label className='text-[10px] font-bold tracking-widest uppercase text-gray-500 ml-1'>
                    Full Identity
                  </label>
                  <div className='relative flex items-center'>
                    <IoPersonCircle size={20} className="absolute left-4 text-gray-400" />
                    <input 
                      onChange={(e) => setFullName(e.target.value)} 
                      value={fullName}
                      type="text" 
                      className='w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:font-normal placeholder:text-gray-400'
                      placeholder="Your amazing name" 
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isDataSubmitted && (
              <>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-[10px] font-bold tracking-widest uppercase text-gray-500 ml-1'>
                    Email Gateway
                  </label>
                  <div className='relative flex items-center'>
                    <IoMail size={18} className="absolute left-4 text-gray-400" />
                    <input 
                      onChange={(e) => setEmail(e.target.value)} 
                      value={email}
                      type="email" 
                      className='w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:font-normal placeholder:text-gray-400'
                      placeholder='name@nexus.com' 
                      required 
                    />
                  </div>
                </div>
                
                <div className='flex flex-col gap-1.5'>
                  <label className='text-[10px] font-bold tracking-widest uppercase text-gray-500 ml-1'>
                    Secure Key
                  </label>
                  <div className='relative flex items-center'>
                    <IoLockClosed size={18} className="absolute left-4 text-gray-400" />
                    <input 
                      onChange={(e) => setPassword(e.target.value)} 
                      value={password}
                      type="password" 
                      className='w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:font-normal placeholder:text-gray-400'
                      placeholder='••••••••' 
                      required 
                    />
                  </div>
                </div>
              </>
            )}

            {currState === "Sign up" && isDataSubmitted && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='flex flex-col gap-1.5'
              >
                <label className='text-[10px] font-bold tracking-widest uppercase text-gray-500 ml-1'>
                  Your Digital Signature (Bio)
                </label>
                <div className='relative flex'>
                  <IoDocument size={18} className="absolute left-4 top-3.5 text-gray-400" />
                  <textarea 
                    onChange={(e) => setBio(e.target.value)} 
                    value={bio}
                    rows={3} 
                    className='w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none font-medium placeholder:font-normal placeholder:text-gray-400'
                    placeholder='What defines you?' 
                    required
                  />
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="mt-4">
              <button 
                type='submit' 
                className='w-full bg-blue-500 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-600 transition-colors uppercase text-sm tracking-widest shadow-sm'
              >
                {currState === "Sign up" ? (isDataSubmitted ? "Finalize Profile" : "Get Started") : "Launch Nexus"}
              </button>
            </div>

            {/* Terms */}
            {!isDataSubmitted && (
              <div className='flex items-start gap-3 text-xs mt-2 select-none group'>
                <div className="relative flex items-center mt-0.5">
                  <input type="checkbox" id="terms" required className='peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:bg-blue-500 checked:border-blue-500 outline-none focus:ring-2 focus:ring-blue-500/20' />
                  <svg className="pointer-events-none absolute h-3 w-3 fill-white opacity-0 transition-opacity peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <label htmlFor="terms" className='cursor-pointer text-gray-500 group-hover:text-gray-700 transition-colors leading-relaxed'>
                  I acknowledge and agree to the <span className="text-blue-500 font-semibold hover:underline underline-offset-4">Protocols</span>.
                </label>
              </div>
            )}

            {/* Footer toggle log in / sign up */}
            <div className='mt-8 pt-6 border-t border-gray-100 text-center'>
              <p className='text-sm text-gray-500'>
                {currState === "Sign up" ? "Already a member?" : "New explorer?"}{' '}
                <span 
                  onClick={() => { setCurrState(currState === "Sign up" ? "Login" : "Sign up"); setIsDataSubmitted(false) }} 
                  className='text-blue-500 font-semibold cursor-pointer hover:text-blue-600 transition-colors ml-1'
                >
                  {currState === "Sign up" ? "Login" : "Join Nexus"}
                </span>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
