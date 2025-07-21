import { useEffect, useRef } from 'react';
import QRious from 'qrious';

export default function QrDisplay({ qr }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && qr) {
      new QRious({
        element: canvasRef.current,
        value: qr,
        size: 300,
      });
    }
  }, [qr]);

  return (
    <div id="qr-container">
      <canvas ref={canvasRef} />
    </div>
  );
}
