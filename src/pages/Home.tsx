import React from 'react';
import { motion } from 'motion/react';
import { Shield, CheckCircle, Lock, Globe, ArrowRight } from 'lucide-react';

export default function Home({ onGetStarted, onVerify }: { onGetStarted: () => void, onVerify: () => void }) {
  return (
    <div className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-accent/20 rounded-full blur-[120px] -z-10 animate-pulse" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-poppins font-extrabold mb-6 tracking-tighter"
          >
            Verify Certificates <br />
            <span className="bg-gradient-to-r from-indigo-primary via-purple-accent to-cyan-secondary bg-clip-text text-transparent">
              Instantly with Blockchain
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-sans"
          >
            The zero-trust, tamper-proof digital fingerprint for academic and professional credentials. 
            Secure, immutable, and globally verifiable.
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-indigo-primary hover:bg-indigo-600 rounded-full font-semibold flex items-center gap-2 transition-all glow-indigo group"
            >
              Issue Certificate <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onVerify}
              className="px-8 py-4 glass hover:bg-white/10 rounded-full font-semibold transition-all"
            >
              Verify a Candidate
            </button>
          </motion.div>
        </div>

        {/* How it Works */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-primary/20 via-cyan-secondary/50 to-emerald-success/20 -translate-y-1/2 -z-10" />
          
          {[
            { icon: Shield, title: "Upload", desc: "Secure PDF upload with instant encryption." },
            { icon: Lock, title: "Hash", desc: "SHA-256 fingerprint generated locally." },
            { icon: Globe, title: "Blockchain", desc: "Immutable ledger storage on Polygon." },
            { icon: CheckCircle, title: "Verify", desc: "Instant global verification for recruiters." },
          ].map((step, i) => (
            <motion.div 
              key={i}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-2xl text-center relative group hover:border-cyan-secondary/50 transition-colors"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <step.icon className="w-8 h-8 text-cyan-secondary" />
              </div>
              <h3 className="text-xl font-poppins font-bold mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
        {/* Footer Attribution */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 text-center flex flex-col items-center gap-6"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-secondary/50 to-transparent" />
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-secondary font-bold opacity-70">Architected & Engineered By</p>
            <div className="flex items-center gap-4">
              <span className="text-lg font-poppins font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Agnibha Kundu</span>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-secondary shadow-[0_0_8px_#06B6D4]" />
              <span className="text-lg font-poppins font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Bhargav Kumar</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-mono">© 2026 TrueCertify • Secure Blockchain Infrastructure</p>
        </motion.div>
      </div>
    </div>
  );
}
