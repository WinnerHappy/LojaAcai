'use client';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useEffect } from 'react';

const BarcodeScanner = ({ onScanResult, onScanError }) => {
  useEffect(() => {
    let html5QrCode;

    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          html5QrCode = new Html5Qrcode('reader', {
            // Habilita os formatos que queremos suportar
            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.EAN_13, // Códigos de barras de produtos (livros, etc.)
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
            ],
          });

          // Inicia a câmera
          html5QrCode.start(
            { facingMode: 'environment' }, // Tenta usar a câmera traseira em celulares
            {
              fps: 10,
              qrbox: { width: 250, height: 150 }, // Caixa retangular, melhor para códigos de barras
            },
            (decodedText, decodedResult) => {
              // Sucesso na leitura
              onScanResult(decodedText);
            },
            (errorMessage) => {
              // Erro na leitura (ignorado na maioria das vezes)
              if (onScanError) {
                onScanError(errorMessage);
              }
            }
          ).catch((err) => {
            console.error("Não foi possível iniciar o scanner", err);
            if (onScanError) onScanError("Não foi possível iniciar a câmera.");
          });
        }
      } catch (err) {
        console.error("Erro ao obter câmeras", err);
        if (onScanError) onScanError("Nenhuma câmera encontrada.");
      }
    };

    startScanner();

    // Função de limpeza para parar a câmera quando o componente é desmontado
    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => {
          console.error("Falha ao parar o scanner.", err);
        });
      }
    };
  }, [onScanResult, onScanError]);

  return <div id="reader" style={{ width: '100%', maxWidth: '500px', margin: '1rem auto' }}></div>;
};

export default BarcodeScanner;