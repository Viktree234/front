import React, { useState } from 'react';
import './App.css';
import QRious from 'qrious';
import Loader from './components/Loader';
import PhoneInput from './components/PhoneInput';
import QrDisplay from './components/QrDisplay';
import SessionDisplay from './components/SessionDisplay';

export default function App() {
  const [view, setView] = useState('initial'); // 'initial' | 'pairing' | 'paired'
  const [qrData, setQrData] = useState(null);
  const [pairCode, setPairCode] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [phone, setPhone] = useState('');

  const startSession = async (method) => {
    setView('pairing');
    setLoading(true);
    setStatus(method === 'qr' ? 'Generating QR Code...' : 'Requesting Pair Code...');

    const body = method === 'qr' ? { method } : { method, phone };
    const res = await fetch('/start-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (data.qr) setQrData(data.qr);
    if (data.code) setPairCode(data.code);
    if (data.session) {
      setSession(data.session);
      setView('paired');
    }
  };

  const reset = () => {
    setQrData(null);
    setPairCode(null);
    setSession(null);
    setPhone('');
    setStatus('');
    setView('initial');
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>NEXORA Session Generator</h2>
        <p>Connect to WhatsApp to generate a reusable session ID.</p>
      </div>

      {view === 'initial' && (
        <div>
          <div className="button-group">
            <button onClick={() => startSession('qr')}>Generate with QR Code</button>
            <button onClick={() => setView('code')}>Generate with Pairing Code</button>
          </div>
        </div>
      )}

      {view === 'code' && (
        <PhoneInput phone={phone} setPhone={setPhone} onSubmit={() => startSession('code')} />
      )}

      {view === 'pairing' && (
        <>
          {loading && <Loader />}
          {qrData && <QrDisplay qr={qrData} />}
          {pairCode && <div id="code-container">{pairCode}</div>}
          <p id="status-text">{status}</p>
          <button className="btn-secondary" onClick={reset}>Back</button>
        </>
      )}

      {view === 'paired' && (
        <SessionDisplay session={session} onReset={reset} />
      )}
    </div>
  );
}
