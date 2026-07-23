import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoClose, 
  IoEllipsisVertical, 
  IoChatbubbleEllipsesOutline, 
  IoCallOutline, 
  IoVideocamOutline, 
  IoSearchOutline,
  IoVolumeMuteOutline,
  IoMusicalNotesOutline,
  IoImageOutline,
  IoTimeOutline,
  IoLockClosedOutline,
  IoShieldCheckmarkOutline,
  IoBanOutline,
  IoWarningOutline,
  IoChevronForward
} from 'react-icons/io5';
import assets from '../assets/assets';

const ContactInfoPane = ({ user, msgImages, onClose }) => {
  if (!user) return null;

  const dummyPhone = "+1 (555) 019-8372";
  const mediaFiles = msgImages?.slice(0, 3) || [assets.avatar_icon, assets.avatar_icon, assets.avatar_icon]; // fallback placeholders

  return (
    <motion.div 
      initial={{ x: 500, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 500, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-[500px] h-full flex flex-col bg-surface border-l border-outline-variant/30 flex-shrink-0 z-50 overflow-hidden shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-surface-container-lowest border-b border-outline-variant/30 sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface">
          <IoClose size={22} />
        </button>
        <h2 className="text-[16px] font-semibold text-primary-container">Contact Info</h2>
        <button className="p-2 -mr-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface">
          <IoEllipsisVertical size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        
        {/* Profile Section */}
        <div className="flex flex-col items-center pt-2 pb-4">
          <div className="relative mb-4">
            <img 
              src={user.profilePic || assets.avatar_icon} 
              alt={user.fullName} 
              className="w-24 h-24 rounded-full object-cover border-4 border-surface-container-lowest shadow-sm"
            />
          </div>
          <h1 className="text-[22px] font-bold text-on-surface leading-[28px]">{user.fullName}</h1>
          <p className="text-[14px] text-on-surface-variant mt-1">{dummyPhone}</p>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-4 mt-6">
            <ActionBtn icon={<IoChatbubbleEllipsesOutline size={20} />} label="Message" />
            <ActionBtn icon={<IoCallOutline size={20} />} label="Audio" />
            <ActionBtn icon={<IoVideocamOutline size={20} />} label="Video" />
            <ActionBtn icon={<IoSearchOutline size={20} />} label="Search" />
          </div>
        </div>

        {/* 2-Column Masonry Layout */}
        <div className="flex gap-4 items-start">
          
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-4">
            
            {/* About Card */}
            <div className="bg-surface-container-lowest rounded-[12px] p-4 border border-outline-variant/30 shadow-sm">
              <h3 className="text-[14px] font-medium text-primary-container mb-3">About</h3>
              <p className="text-[14px] text-on-surface leading-[20px] mb-4">
                Busy, but always available for a good cup of coffee. ☕
              </p>
              <p className="text-[14px] text-on-surface-variant">Available</p>
            </div>

            {/* Media Card */}
            <div className="bg-surface-container-lowest rounded-[12px] p-4 border border-outline-variant/30 shadow-sm">
              <div className="flex items-center justify-between mb-3 cursor-pointer group">
                <h3 className="text-[14px] font-medium text-primary-container group-hover:underline">Media, links, and docs</h3>
                <div className="flex items-center gap-1 text-[12px] text-on-surface-variant">
                  <span>{msgImages?.length || 12}</span>
                  <IoChevronForward />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {mediaFiles.map((url, i) => (
                  <div key={i} className="aspect-square rounded-[8px] overflow-hidden bg-surface-container">
                    <img src={url} className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" alt="media" />
                  </div>
                ))}
              </div>
            </div>

            {/* Groups Card */}
            <div className="bg-surface-container-lowest rounded-[12px] p-4 border border-outline-variant/30 shadow-sm">
              <h3 className="text-[14px] font-medium text-primary-container mb-3">Groups in common</h3>
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7ec5b8] text-white flex items-center justify-center text-[12px] font-bold">DP</div>
                  <div>
                    <h4 className="text-[14px] font-medium text-on-surface">Design Pioneers</h4>
                    <p className="text-[12px] text-on-surface-variant">Alex, Sarah, Mike, you</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#49c4ff] text-white flex items-center justify-center text-[12px] font-bold">WH</div>
                  <div>
                    <h4 className="text-[14px] font-medium text-on-surface">Weekend Hike</h4>
                    <p className="text-[12px] text-on-surface-variant">Alex, you</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-4">
            
            {/* Settings Card */}
            <div className="bg-surface-container-lowest rounded-[12px] p-2 border border-outline-variant/30 shadow-sm flex flex-col">
              <ListItem icon={<IoVolumeMuteOutline size={20} />} title="Mute notifications" right={<Toggle />} />
              <ListItem icon={<IoMusicalNotesOutline size={20} />} title="Custom tones" right={<span className="text-[14px] text-on-surface-variant">Default</span>} border />
              <ListItem icon={<IoImageOutline size={20} />} title="Wallpaper" right={<IoChevronForward className="text-on-surface-variant"/>} border />
              <ListItem icon={<IoTimeOutline size={20} />} title="Disappearing messages" right={<span className="text-[14px] text-on-surface-variant">Off</span>} border />
            </div>

            {/* Security Card */}
            <div className="bg-surface-container-lowest rounded-[12px] p-2 border border-outline-variant/30 shadow-sm flex flex-col">
              <div className="flex gap-4 p-3 items-start">
                <IoLockClosedOutline size={20} className="text-on-surface mt-0.5" />
                <div>
                  <h4 className="text-[14px] text-on-surface">Encryption</h4>
                  <p className="text-[12px] text-on-surface-variant mt-1 leading-snug">Messages and calls are end-to-end encrypted.</p>
                </div>
              </div>
              <ListItem icon={<IoShieldCheckmarkOutline size={20} />} title="Contact details" right={<IoChevronForward className="text-on-surface-variant"/>} border />
            </div>

            {/* Danger Card */}
            <div className="bg-surface-container-lowest rounded-[12px] p-2 border border-error-container shadow-sm flex flex-col">
              <div className="flex items-center gap-4 p-3 cursor-pointer hover:bg-error-container/20 rounded-[8px] transition-colors">
                <IoBanOutline size={20} className="text-error" />
                <h4 className="text-[14px] font-medium text-error">Block {user.fullName}</h4>
              </div>
              <div className="w-full h-[1px] bg-error-container/50 my-1" />
              <div className="flex items-center gap-4 p-3 cursor-pointer hover:bg-error-container/20 rounded-[8px] transition-colors">
                <IoWarningOutline size={20} className="text-error" />
                <h4 className="text-[14px] font-medium text-error">Report contact</h4>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper Components
const ActionBtn = ({ icon, label }) => (
  <button className="flex flex-col items-center justify-center gap-2 w-16 h-[72px] bg-primary/5 hover:bg-primary/10 rounded-[16px] transition-colors text-primary-container">
    {icon}
    <span className="text-[12px] font-medium">{label}</span>
  </button>
);

const ListItem = ({ icon, title, right, border }) => (
  <>
    {border && <div className="w-full h-[1px] bg-outline-variant/20 my-1" />}
    <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-surface-container-low rounded-[8px] transition-colors">
      <div className="flex items-center gap-4 text-on-surface">
        {icon}
        <span className="text-[14px]">{title}</span>
      </div>
      {right && <div>{right}</div>}
    </div>
  </>
);

const Toggle = () => (
  <div className="w-9 h-5 bg-surface-container-high rounded-full flex items-center p-0.5 cursor-pointer hover:brightness-95 transition-all">
    <div className="w-4 h-4 bg-surface-container-lowest rounded-full shadow-sm" />
  </div>
);

export default ContactInfoPane;
