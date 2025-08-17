'use client';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

const BarcodeScanner = ({ onScanResult }) => {

  useEffect(() => {
    // Cria uma nova instância do scanner
    const scanner = new Html5QrcodeScanner(
      'reader', // O ID do elemento div onde o scanner será renderizado
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5, // Quadros por segundo para escanear
        rememberLastUsedCamera: true, // Lembra a última câmera usada
      },
      false // verbose, pode ser true para mais logs
    );

    // Função que será chamada quando um QR code for lido com sucesso
    const handleSuccess = (decodedText, decodedResult) => {
      scanner.clear(); // Para o scanner após uma leitura bem-sucedida
      onScanResult(decodedText);
    };

    // Função para lidar com erros (opcional)
    const handleError = (error) => {
      // Você pode ignorar a maioria dos erros, pois eles acontecem constantemente até um código ser encontrado
      // console.warn(error);
    };

    // Inicia a renderização do scanner
    scanner.render(handleSuccess, handleError);

    // Função de limpeza: será chamada quando o componente for desmontado
    // É MUITO IMPORTANTE para parar a câmera e evitar vazamentos de memória
    return () => {
      scanner.clear().catch(error => {
        console.error("Falha ao limpar o Html5QrcodeScanner.", error);
      });
    };
  }, [onScanResult]); // O array de dependências vazio garante que o useEffect rode apenas uma vez

  // O div que a biblioteca usará para montar o leitor de QR code
  return (
    <div id="reader" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>
  );
};

export default BarcodeScanner;