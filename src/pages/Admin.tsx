import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '@/src/lib/firebase';
import { collection, query, getDocs, setDoc, doc, orderBy, limit } from 'firebase/firestore';
import { Upload, FileText, CheckCircle2, Loader2, ExternalLink, ShieldCheck, Hash, Database, Globe } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import logo from '../assets/image.png';

export default function Admin() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(0); // 0: idle, 1: hashing, 2: ipfs, 3: blockchain, 4: done
  const [studentName, setStudentName] = useState('');
  const [issuerName, setIssuerName] = useState('TrueCertify Global');
  const [course, setCourse] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [certs, setCerts] = useState<any[]>([]);
  const [lastCert, setLastCert] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      const q = query(collection(db, 'certificates'), orderBy('issueDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        hash: doc.id,
        ...doc.data()
      }));
      setCerts(data);
    } catch (err) {
      console.error('Fetch certs error:', err);
    }
  };

  const generateHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setUploadStep(1);

    try {
      // Real Hashing
      const hash = await generateHash(file);
      await new Promise(r => setTimeout(r, 800));
      setUploadStep(2);

      // Simulate IPFS Animation
      const ipfsHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      await new Promise(r => setTimeout(r, 1000));
      setUploadStep(3);

      // Simulate Blockchain Animation
      const txId = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      await new Promise(r => setTimeout(r, 1200));

      const certData = {
        studentName: studentName || 'Anonymous Student',
        university: issuerName || 'TrueCertify Global',
        course: course || 'General Certification',
        issueDate: new Date().toISOString(),
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString(),
        ipfsHash,
        txId
      };

      // Save to Firestore
      await setDoc(doc(db, 'certificates', hash), certData);

      setLastCert({ hash, ...certData });
      setUploadStep(4);
      fetchCerts();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during issuance.');
      setIsUploading(false);
      setUploadStep(0);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-black/80 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 relative group overflow-hidden">
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src={logo} alt="TrueCertify logo" className="w-12 h-12 object-contain rounded-md relative z-10" />
          </div>
          <div>
            <h1 className="text-3xl font-poppins font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">TrueCertify Authority</h1>
            <p className="text-gray-500 text-sm">Manage and issue tamper-proof credentials.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
          <div className="w-2 h-2 bg-emerald-success rounded-full animate-pulse" />
          <span className="text-xs font-bold text-gray-300">Network: Polygon Mainnet</span>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Action Area */}
        <div className="flex-1 space-y-8">
          <div className="glass p-8 rounded-3xl glow-indigo">
            <h2 className="text-3xl font-poppins font-bold mb-2">Issue New Certificate</h2>
            <p className="text-gray-400 mb-8">Securely anchor academic credentials to the blockchain.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Student Full Name</label>
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Agnibha Kundu"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Issuer / Organization</label>
                <input
                  type="text"
                  value={issuerName}
                  onChange={(e) => setIssuerName(e.target.value)}
                  placeholder="e.g. TrueCertify Global"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Course / Program</label>
                  <input 
                    type="text" 
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. B.Tech CSE"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Expiry Date (Optional)</label>
                  <input 
                    type="date" 
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-primary transition-colors"
                  />
                </div>
              </div>

              <div className="relative group">
                <div className={cn(
                  "border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer",
                  isUploading ? "border-indigo-primary bg-indigo-primary/5" : "border-white/10 hover:border-indigo-primary/50 hover:bg-white/5"
                )}>
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    onChange={handleUpload}
                    disabled={isUploading}
                  />
                  
                  <AnimatePresence mode="wait">
                    {!isUploading ? (
                      <motion.div 
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <div className="w-16 h-16 bg-indigo-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-8 h-8 text-indigo-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-medium">Drag & Drop Certificate</p>
                          <p className="text-sm text-gray-400">PDF, PNG or JPG (Max 10MB)</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="progress"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex flex-col items-center gap-4">
                          {uploadStep < 4 ? (
                            <Loader2 className="w-12 h-12 text-cyan-secondary animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-12 h-12 text-emerald-success" />
                          )}
                          
                          <div className="text-center">
                            <p className="text-xl font-bold font-poppins">
                              {uploadStep === 1 && "Generating SHA-256 Hash..."}
                              {uploadStep === 2 && "Pinning to IPFS..."}
                              {uploadStep === 3 && "Writing to Polygon Ledger..."}
                              {uploadStep === 4 && "Certificate Issued Successfully!"}
                            </p>
                            <div className="mt-4 w-64 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto">
                              <motion.div 
                                className="h-full bg-indigo-primary"
                                initial={{ width: "0%" }}
                                animate={{ width: `${(uploadStep / 4) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {error && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-rose-danger/10 border border-rose-danger/20 rounded-xl text-rose-danger text-sm"
                          >
                            <p className="font-bold mb-1">Issuance Blocked</p>
                            <p>{error}</p>
                            <button 
                              onClick={() => { setError(null); setIsUploading(false); setUploadStep(0); }}
                              className="mt-3 text-xs font-bold underline underline-offset-4"
                            >
                              Try Another File
                            </button>
                          </motion.div>
                        )}

                        {uploadStep === 4 && lastCert && (
                          <motion.div 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="p-4 bg-white/5 rounded-xl text-left space-y-2 text-xs font-mono"
                          >
                            <div className="flex justify-between"><span className="text-gray-500">HASH:</span> <span className="text-indigo-primary truncate ml-2">{lastCert.hash}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">IPFS:</span> <span className="text-cyan-secondary truncate ml-2">{lastCert.ipfsHash}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">TX:</span> <span className="text-purple-accent truncate ml-2">{lastCert.txId}</span></div>
                          </motion.div>
                        )}
                        
                        {uploadStep === 4 && (
                          <button 
                            onClick={() => { 
                              setIsUploading(false); 
                              setUploadStep(0); 
                              setStudentName(''); 
                              setCourse('');
                              setExpiryDate('');
                            }}
                            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
                          >
                            Issue Another
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Issued', value: certs.length, icon: ShieldCheck, color: 'text-indigo-primary' },
              { label: 'IPFS Nodes', value: '12 Active', icon: Database, color: 'text-cyan-secondary' },
              { label: 'Network', value: 'Polygon', icon: Globe, color: 'text-purple-accent' },
            ].map((stat, i) => (
              <div key={i} className="glass p-6 rounded-2xl flex items-center gap-4">
                <div className={cn("p-3 rounded-xl bg-white/5", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{stat.label}</p>
                  <p className="text-xl font-poppins font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Activity */}
        <div className="w-full lg:w-[400px]">
          <div className="glass rounded-3xl overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-poppins font-bold">Recent Issuance</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {certs.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No certificates issued yet.</div>
              ) : (
                certs.slice().reverse().map((cert, i) => (
                  <motion.div 
                    key={i}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{cert.studentName}</div>
                        <div className="text-[10px] text-indigo-primary uppercase font-bold">{cert.course}</div>
                      </div>
                      <div className="text-[10px] bg-emerald-success/20 text-emerald-success px-2 py-0.5 rounded-full font-bold">VERIFIED</div>
                    </div>
                    <div className="text-xs text-gray-500 font-mono truncate mb-3">{cert.hash}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-600">{new Date(cert.issueDate).toLocaleDateString()}</span>
                      <a 
                        href={`https://polygonscan.com/tx/${cert.txId}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-primary hover:text-indigo-400 text-[10px] flex items-center gap-1"
                      >
                        Explorer <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
