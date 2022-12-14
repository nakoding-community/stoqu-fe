import React from 'react';
import { Document, Image, Page, Text, View } from '@react-pdf/renderer';

const PDFResult = ({ valueStrings, pdfImageIds }) => {
  return (
    <Document>
      <Page size="A4" style={{ paddingTop: '15px' }}>
        <View>
          {pdfImageIds?.length > 0 && (
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                width: '100%',
                flexWrap: 'wrap',
              }}
            >
              {pdfImageIds?.map((dataURL, index) => {
                return (
                  <View
                    key={index}
                    style={{ margin: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    wrap={false}
                  >
                    <Image allowDangerousPaths src={dataURL} style={{ width: '60px', height: '60px' }} />
                    <Text style={{ fontSize: '12px', marginTop: '8px' }}>{valueStrings[index]}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default PDFResult;
