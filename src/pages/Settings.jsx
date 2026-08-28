import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import jsQR from 'jsqr';
import { initFirebase } from '../firebase';
import { MonitorSmartphone, KeySquare, ScanLine, CheckCircle2 } from 'lucide-react';

const Settings = ({ onLinkSuccess }) => {
  const [projectId, setProjectId] = useState('');
  const [appId, setAppId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [isMobile, setIsMobile] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const isScanningRef = useRef(false); // ref so tick() always sees the live value
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Load existing config
    const savedConfig = localStorage.getItem('firebase_config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setProjectId(config.projectId || '');
        setAppId(config.appId || '');
        setApiKey(config.apiKey || '');
      } catch (e) {
        console.error(e);
      }
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleManualSave = (e) => {
    e.preventDefault();
    if (!projectId || !appId || !apiKey) {
      setError('Please fill in all fields');
      setSuccess('');
      return;
    }
    
    try {
      initFirebase(projectId, appId, apiKey);
      onLinkSuccess();
      setError('');
      setSuccess('Settings saved and Firebase linked!');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  const startScanning = async () => {
    isScanningRef.current = true;
    setIsScanning(true);
    setError('');
    setSuccess('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true);
        videoRef.current.play();
        requestAnimationFrame(tick);
      }
    } catch (err) {
      setError("Failed to access camera: " + err.message);
      isScanningRef.current = false;
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    isScanningRef.current = false;
    setIsScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const tick = () => {
    if (!videoRef.current || !isScanningRef.current) return;
    
    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      
      if (code) {
        try {
          const data = JSON.parse(code.data);
          if (data.projectId && data.appId && data.apiKey) {
            setProjectId(data.projectId);
            setAppId(data.appId);
            setApiKey(data.apiKey);
            initFirebase(data.projectId, data.appId, data.apiKey);
            onLinkSuccess();
            stopScanning();
            setSuccess("QR Code scanned successfully! Firebase linked.");
            return;
          } else {
            setError("Invalid QR code format");
          }
        } catch (e) {
          setError("Failed to parse QR code data");
        }
      }
    }
    
    if (isScanningRef.current) {
      requestAnimationFrame(tick);
    }
  };

  const hasConfig = projectId && appId && apiKey;
  const qrData = hasConfig ? JSON.stringify({ projectId, appId, apiKey }) : null;

  return (
    <div className="py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your Dolphin Companion App</p>
      </header>

      {error && (
        <div className="bg-red-500/20 text-red-300 p-4 rounded-lg text-sm border border-red-500/50">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 text-green-300 p-4 rounded-lg text-sm border border-green-500/50 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* QR Linking Section */}
      <section className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-lg font-semibold flex items-center">
            <MonitorSmartphone className="w-5 h-5 mr-2 text-indigo-400" />
            Device Pairing
          </h2>
        </div>
        <div className="p-6">
          {isMobile ? (
            // Mobile View: Show QR Code
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-center mb-2">
                <p className="text-slate-300 mb-1">Scan this code from your desktop browser to link devices.</p>
              </div>
              
              {qrData ? (
                <div className="bg-white p-4 rounded-xl shadow-lg">
                  <QRCodeSVG value={qrData} size={200} level="M" includeMargin={true} />
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-slate-600 rounded-xl text-center">
                  <p className="text-slate-400">Configure credentials below first to generate a pairing code.</p>
                </div>
              )}
            </div>
          ) : (
            // Desktop View: Scanner
            <div className="flex flex-col items-center justify-center space-y-4">
              {!isScanning ? (
                <button
                  onClick={startScanning}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <ScanLine className="w-5 h-5" />
                  <span>Scan QR Code from Phone</span>
                </button>
              ) : (
                <div className="w-full max-w-md">
                  <div className="relative rounded-lg overflow-hidden bg-black aspect-square">
                    <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 border-2 border-indigo-500/50 rounded-lg pointer-events-none z-10 m-4"></div>
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <button
                    onClick={stopScanning}
                    className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel Scanning
                  </button>
                </div>
              )}
              <p className="text-sm text-slate-400 text-center">
                Open Dolphin Web on your phone, go to Settings, and scan the QR code to auto-fill credentials.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Manual Config Section */}
      <section className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-lg font-semibold flex items-center">
            <KeySquare className="w-5 h-5 mr-2 text-indigo-400" />
            Firebase Credentials
          </h2>
        </div>
        <form onSubmit={handleManualSave} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Project ID</label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder="e.g. study-tracker-12345"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">App ID</label>
            <input
              type="text"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder="1:1234567890:web:abcdef"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Web API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder="AIzaSy..."
            />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Save & Link
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Note: These public credentials match your google-services.json and are safe to store locally. Actual data access is secured by Firestore rules.
          </p>
        </form>
      </section>
    </div>
  );
};

export default Settings;
