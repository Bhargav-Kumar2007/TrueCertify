import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Verify from './pages/Verify';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Home 
                onGetStarted={() => setActiveTab('admin')} 
                onVerify={() => setActiveTab('verify')} 
              />
            </motion.div>
          )}
          
          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Admin />
            </motion.div>
          )}
          
          {activeTab === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Verify />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-50">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-accent/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
