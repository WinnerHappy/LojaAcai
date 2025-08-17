'use client';
import { QrReader } from 'react-qr-reader';

const BarcodeScanner = ({ onScanResult }) => {
  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '1rem auto', border: '2px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            onScanResult(result?.text);
          }
          if (!!error) {
            // console.info(error);
          }
        }}
        constraints={{ facingMode: 'environment' }}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default BarcodeScanner;