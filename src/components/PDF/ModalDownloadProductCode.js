/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import { DialogActions, Stack, TextField } from '@mui/material';
import { pdf } from '@react-pdf/renderer';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { saveAs } from 'file-saver';
import Modal from '../modal/Modal';
import PDFResult from './PDFResult';
import QRGenerator from '../QRCode/QRGenerator';

// eslint-disable-next-line react/prop-types
function ModalDownloadProductCode({ open, onClose, detailData }) {
  return (
    <Modal title="Download Kode Produk" open={open} onClose={onClose} maxWidth="sm">
      <ModalContent detailData={detailData} open={open} onClose={onClose} />
    </Modal>
  );
}

function ModalContent({ detailData, open, onClose }) {
  const [amount, setAmount] = useState(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);

  const [valueStrings, setValueStrings] = useState(null);

  const onClick = async () => {
    const tempValueStrings = [];

    for (let i = 0; i < amount; i++) {
      tempValueStrings.push(detailData?.productCode);
    }

    setValueStrings(tempValueStrings);
  };

  const openDocument = async () => {
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
    onClose();
    setIsLoadingDocument(false);
  };

  useEffect(() => {
    if (valueStrings?.length > 0) {
      openDocument();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueStrings]);

  useEffect(() => {
    if (!open) setValueStrings(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      {!isLoadingDocument &&
        valueStrings?.length > 0 &&
        valueStrings?.map((valueString, index) => (
          <div key={index} style={{ display: 'none' }}>
            <QRGenerator documentId={valueString} valueString={valueString} />
          </div>
        ))}
      <Stack spacing={3} sx={{ p: 3 }}>
        <TextField
          value={amount}
          type="number"
          id="name"
          label="Masukkan jumlah QR Code yang ingin didownload"
          variant="outlined"
          onChange={(e) => setAmount(e.target.value)}
          error={amount > 100}
          helperText={amount > 100 ? 'Maximum 100' : undefined}
        />
      </Stack>
      <DialogActions>
        <LoadingButton
          type="submit"
          variant="contained"
          disabled={!amount || isLoadingDocument || amount > 100}
          onClick={onClick}
        >
          {isLoadingDocument ? 'Loading document..' : 'Download'}
        </LoadingButton>
      </DialogActions>
    </>
  );
}

export default ModalDownloadProductCode;
