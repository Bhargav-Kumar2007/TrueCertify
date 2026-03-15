import React from 'react';
import { motion } from 'motion/react';
import { Shield, LayoutDashboard, Search, Menu, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import logo from '../assets/image.png';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass rounded-full px-6 py-3 flex items-center justify-between shadow-2xl"
      >
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="flex items-center gap-1.5">
            <div className="w-10 h-10 bg-black/80 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
              <img src={logo} alt="TrueCertify logo" className="w-9 h-9 object-contain rounded-md" />
            </div>
            <span className="font-poppins font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">TrueCertify</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[
            { id: 'home', label: 'Home', icon: Shield },
            { id: 'admin', label: 'University', icon: LayoutDashboard },
            { id: 'verify', label: 'Verify', icon: Search },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                activeTab === item.id 
                  ? "bg-white/10 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </nav>
  );
}
