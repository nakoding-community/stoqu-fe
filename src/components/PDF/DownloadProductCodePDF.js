import { Button } from '@mui/material';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Iconify from '../Iconify';
import QRGenerator from '../QRCode/QRGenerator';
import PDFResult from './PDFResult';

const DownloadProductCodePDF = ({ valueStrings, isLoading, onClick, setIsDownloading, useButton = true }) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);

  const openPDFDocument = async () => {
    setIsLoadingDocument(true);
    const pdfImageIds = valueStrings?.map((id) => {
      return document.getElementById(id).toDataURL();
    });

    const doc = <PDFResult pdfImageIds={pdfImageIds} valueStrings={valueStrings} />;
    const asPdf = pdf();
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();
    saveAs(blob, 'document.pdf');

    toast.success('Berhasil mendownload PDF');
    setIsDownloading(false);
    setIsLoadingDocument(false);
    setIsReady(false);
  };

  const getButtonText = () => {
    if (isLoading) {
      return 'Sedang mengambil data..';
    }

    if (isLoadingDocument) {
      return 'Loading document..';
    }

    return 'Download QR';
  };

  useEffect(() => {
    if (isReady) {
      openPDFDocument();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  useEffect(() => {
    if (valueStrings?.length > 0) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [valueStrings]);

  return (
    <>
      {!isLoading &&
        valueStrings?.length > 0 &&
        valueStrings?.map((valueString, index) => (
          <div key={index} style={{ display: 'none' }}>
            <QRGenerator documentId={valueString} valueString={valueString} />
          </div>
        ))}

      {useButton && (
        <Button
          variant="outlined"
          startIcon={<Iconify icon="ion:qr-code" />}
          onClick={() => !isLoading && !isLoadingDocument && onClick()}
        >
          {getButtonText()}
        </Button>
      )}
    </>
  );
};

export default DownloadProductCodePDF;
