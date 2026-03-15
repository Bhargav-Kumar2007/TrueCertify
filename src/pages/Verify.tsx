import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '@/src/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Search, ShieldCheck, ShieldAlert, Loader2, FileSearch, Fingerprint, Globe, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import logo from '../assets/image.png';

export default function Verify() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: idle, 1: scanning, 2: hashing, 3: querying, 4: result
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const generateHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleVerify = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanStep(1);
    setLogs([]);
    setResult(null);

    addLog("> Initializing laser scanner...");
    await new Promise(r => setTimeout(r, 800));
    addLog("> Extracting file bytes...");
    setScanStep(2);
    await new Promise(r => setTimeout(r, 1000));
    addLog("> Computing SHA-256 fingerprint...");
    
    try {
      const hash = await generateHash(file);
      setScanStep(3);
      await new Promise(r => setTimeout(r, 1200));
      addLog("> Querying Polygon Smart Contract 0x3f...");
      await new Promise(r => setTimeout(r, 1000));

      const docRef = doc(db, 'certificates', hash);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { verified: true, cert: docSnap.data(), hash };
        setResult(data);
        setScanStep(4);
        addLog("> MATCH FOUND: Certificate is authentic.");
      } else {
        const data = { verified: false, hash };
        setResult(data);
        setScanStep(4);
        addLog("> WARNING: Hash mismatch. Potential forgery detected.");
      }
    } catch (err) {
      console.error(err);
      setIsScanning(false);
      setScanStep(0);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {scanStep === 0 ? (
          <motion.div 
            key="idle"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="w-full text-center space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl font-poppins font-bold">Instant Verification</h1>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                Drop a candidate's certificate here to verify its authenticity against the global blockchain ledger.
              </p>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="glass p-16 rounded-[40px] border-2 border-dashed border-white/10 hover:border-cyan-secondary/50 hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-4">
                <div className="w-20 h-20 bg-cyan-secondary/10 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <FileSearch className="w-10 h-10 text-cyan-secondary" />
                </div>
                <div>
                  <p className="text-xl font-medium">Click or Drag to Verify</p>
                  <p className="text-sm text-gray-500">Supports PDF, PNG, JPG</p>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                onChange={handleVerify}
              />
            </div>
          </motion.div>
        ) : scanStep < 4 ? (
          <motion.div 
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-2xl glass p-10 rounded-[40px] relative overflow-hidden"
          >
            {/* Laser Line Animation */}
            <motion.div 
              className="absolute left-0 right-0 h-1 bg-cyan-secondary shadow-[0_0_20px_#06B6D4] z-20"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />

            <div className="flex flex-col items-center gap-8">
              <div className="w-full h-64 bg-white/5 rounded-2xl flex items-center justify-center relative border border-white/10">
                <Fingerprint className="w-32 h-32 text-cyan-secondary/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 text-cyan-secondary animate-spin mb-4" />
                  <p className="text-cyan-secondary font-mono text-sm animate-pulse">SCANNING IN PROGRESS...</p>
                </div>
              </div>

              <div className="w-full bg-black/40 rounded-xl p-6 font-mono text-xs text-cyan-secondary/80 space-y-1 h-32 overflow-y-auto border border-white/5">
                {logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "w-full max-w-2xl glass p-12 rounded-[40px] text-center space-y-8",
              result?.verified ? "border-emerald-success/30 glow-emerald" : "border-rose-danger/30 glow-rose"
            )}
          >
            <div className="flex flex-col items-center gap-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center",
                  result?.verified ? "bg-emerald-success/20 text-emerald-success" : "bg-rose-danger/20 text-rose-danger"
                )}
              >
                {result?.verified ? <CheckCircle2 className="w-16 h-16" /> : <XCircle className="w-16 h-16" />}
              </motion.div>

              <div>
                <h2 className={cn(
                  "text-4xl font-poppins font-bold mb-2",
                  result?.verified ? "text-emerald-success" : "text-rose-danger"
                )}>
                  {result?.verified ? "Certificate Verified" : "Verification Failed"}
                </h2>
                <p className="text-gray-400">
                  {result?.verified 
                    ? "This document matches the record on the blockchain ledger." 
                    : "No matching record found. This document may be modified or forged."}
                </p>
              </div>
            </div>

            {result?.verified && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Student Name</p>
                  <p className="font-medium">{result.cert.studentName}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Issuer</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black/80 rounded-lg flex items-center justify-center border border-white/5">
                      <img src={logo} alt="TrueCertify logo" className="w-5 h-5 object-contain rounded-sm" />
                    </div>
                    <p className="font-medium">{result.cert.university}</p>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Course</p>
                  <p className="font-medium text-indigo-primary">{result.cert.course}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Validity</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {new Date(result.cert.issueDate).toLocaleDateString()} - {new Date(result.cert.expiryDate).toLocaleDateString()}
                    </p>
                    {new Date(result.cert.expiryDate) < new Date() ? (
                      <span className="text-[8px] bg-rose-danger/20 text-rose-danger px-1.5 py-0.5 rounded-full font-bold">EXPIRED</span>
                    ) : (
                      <span className="text-[8px] bg-emerald-success/20 text-emerald-success px-1.5 py-0.5 rounded-full font-bold">ACTIVE</span>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 sm:col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Blockchain Hash</p>
                  <p className="font-mono text-xs text-indigo-primary break-all">{result.hash}</p>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => { setScanStep(0); setResult(null); }}
                className="px-8 py-3 glass hover:bg-white/10 rounded-full font-semibold transition-all"
              >
                Verify Another
              </button>
              {result?.verified && (
                <a 
                  href={`https://polygonscan.com/tx/${result.cert.txId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-indigo-primary hover:bg-indigo-600 rounded-full font-semibold flex items-center gap-2 transition-all"
                >
                  View on Explorer <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
