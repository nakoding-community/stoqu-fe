import React from 'react';
import QRCode from 'qrcode.react';

const QRGenerator = ({ documentId, valueString }) => {
  return <QRCode id={documentId} value={valueString} size={128} bgColor="#ffffff" fgColor="#000000" level="H" />;
};

export default QRGenerator;
