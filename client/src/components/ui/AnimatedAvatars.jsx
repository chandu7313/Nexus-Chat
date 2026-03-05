import React from 'react';
import assets from '../../assets/assets';

// DUMMY AVATARS FOR VISUALIZATION
const avatars = [
  "https://i.pravatar.cc/150?u=1",
  "https://i.pravatar.cc/150?u=2",
  "https://i.pravatar.cc/150?u=3",
  "https://i.pravatar.cc/150?u=4",
  "https://i.pravatar.cc/150?u=5",
  "https://i.pravatar.cc/150?u=6",
  "https://i.pravatar.cc/150?u=7",
  "https://i.pravatar.cc/150?u=8",
  "https://i.pravatar.cc/150?u=9",
  "https://i.pravatar.cc/150?u=10",
  "https://i.pravatar.cc/150?u=11",
  "https://i.pravatar.cc/150?u=12",
];

const AnimatedAvatars = () => {
  return (
    <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center overflow-hidden">
      
      {/* Center Logo */}
      <div className="absolute z-50 flex items-center justify-center">
        <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center shadow-2xl border-4 border-gray-800 z-10 relative">
          <img src={assets.nexusLogo} alt="Nexus" className="w-16 h-16 drop-shadow-xl z-20" />
        </div>
        {/* Glow behind logo */}
        <div className="absolute inset-0 bg-blue-500/20 blur-[50px] rounded-full scale-150"></div>
      </div>

      {/* INNER ROTATING RING */}
      <div className="absolute w-[280px] h-[280px] border border-dashed border-gray-700/50 rounded-full animate-spin-slow">
        {/* Avatar 1 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Counter-rotation to keep avatar upright */}
          <div className="animate-reverse-spin-slow">
            <img src={avatars[0]} className="w-12 h-12 rounded-full border-2 border-gray-800 shadow-xl object-cover" alt="avatar" />
          </div>
        </div>
        
        {/* Avatar 2 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div className="animate-reverse-spin-slow">
            <img src={avatars[1]} className="w-12 h-12 rounded-full border-2 border-gray-800 shadow-xl object-cover" alt="avatar" />
          </div>
        </div>

        {/* Avatar 3 */}
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-reverse-spin-slow">
            <img src={avatars[2]} className="w-12 h-12 rounded-full border-2 border-gray-800 shadow-xl object-cover" alt="avatar" />
          </div>
        </div>

        {/* Avatar 4 */}
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
          <div className="animate-reverse-spin-slow">
            <img src={avatars[3]} className="w-12 h-12 rounded-full border-2 border-gray-800 shadow-xl object-cover" alt="avatar" />
          </div>
        </div>
      </div>

      {/* OUTER ROTATING RING (Counter-rotating for parallax) */}
      <div className="absolute w-[460px] h-[460px] border border-dashed border-gray-800/60 rounded-full animate-reverse-spin-slow" style={{ animationDuration: '35s' }}>
        
        {/* Avatars on outer ring (positioned at 45 degree angles roughly for visual spread) */}
        
        {/* Top Right */}
        <div className="absolute top-[15%] right-[15%] translate-x-1/2 -translate-y-1/2">
          {/* Since parent is reverse spinning, this must spin normally to stay upright, with matching duration */}
          <div className="animate-spin-slow" style={{ animationDuration: '35s' }}>
            <img src={avatars[4]} className="w-14 h-14 rounded-full border-2 border-gray-800 shadow-xl object-cover opacity-80" alt="avatar" />
          </div>
        </div>

        {/* Bottom Right */}
        <div className="absolute bottom-[15%] right-[15%] translate-x-1/2 translate-y-1/2">
          <div className="animate-spin-slow" style={{ animationDuration: '35s' }}>
            <img src={avatars[5]} className="w-14 h-14 rounded-full border-2 border-gray-800 shadow-xl object-cover opacity-80" alt="avatar" />
          </div>
        </div>

        {/* Bottom Left */}
        <div className="absolute bottom-[15%] left-[15%] -translate-x-1/2 translate-y-1/2">
          <div className="animate-spin-slow" style={{ animationDuration: '35s' }}>
            <img src={avatars[6]} className="w-14 h-14 rounded-full border-2 border-gray-800 shadow-xl object-cover opacity-80" alt="avatar" />
          </div>
        </div>

        {/* Top Left */}
        <div className="absolute top-[15%] left-[15%] -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow" style={{ animationDuration: '35s' }}>
            <img src={avatars[7]} className="w-14 h-14 rounded-full border-2 border-gray-800 shadow-xl object-cover opacity-80" alt="avatar" />
          </div>
        </div>

        {/* Top Center-ish Outer */}
        <div className="absolute top-0 left-[30%] -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow" style={{ animationDuration: '35s' }}>
            <img src={avatars[8]} className="w-10 h-10 rounded-full border-2 border-gray-800 shadow-xl object-cover opacity-60" alt="avatar" />
          </div>
        </div>

        {/* Bottom Center-ish Outer */}
        <div className="absolute bottom-0 right-[30%] translate-x-1/2 translate-y-1/2">
          <div className="animate-spin-slow" style={{ animationDuration: '35s' }}>
            <img src={avatars[9]} className="w-10 h-10 rounded-full border-2 border-gray-800 shadow-xl object-cover opacity-60" alt="avatar" />
          </div>
        </div>

      </div>

      {/* Decorative Blur Backgrounds to tie it together */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]"></div>
    </div>
  );
};

export default AnimatedAvatars;
