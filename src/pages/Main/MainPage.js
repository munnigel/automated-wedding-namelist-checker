import React, { useState } from 'react';
import { Steps, Divider, Layout, Typography } from 'antd';
import ExcelUploader from '../../components/ExcelUploader/ExcelUploader';
import HandsonTable from '../../components/HandsontablePreview/HandsonTable';
import ColumnSelector from '../../components/ColumnSelector/ColumnSelector';

import * as XLSX from 'xlsx';
import {
  parseSheetToJSON,
  extractMergeConfig,
} from '../../utils/HandsonTableUtils.js';
import { generateGuestPayload } from '../../utils/HandsonTableUtils';

const { Content } = Layout;
const { Title } = Typography;

const MainPage = () => {
  const [step, setStep] = useState(0);
  const [excelData, setExcelData] = useState([]);
  const [mergeConfig, setMergeConfig] = useState([]);
  const [selectedCols, setSelectedCols] = useState(null);
  const [finalGuestList, setFinalGuestList] = useState([]);

  const handleExcelParsed = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = parseSheetToJSON(worksheet);
      const mergeData = extractMergeConfig(worksheet, jsonData);

      setExcelData(jsonData);
      setMergeConfig(mergeData);
      setStep(1);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleColumnsSelected = (cols) => {
    setSelectedCols(cols);
    setStep(2);
  
    const guestList = generateGuestPayload(excelData, cols.nameCol, cols.mobileCol);
    setFinalGuestList(guestList);
  
    console.log('Final guest list:', guestList);
  };

  

  return (
    <Layout style={{ padding: '24px' }}>
      <Title level={3}>Wedding Guest List Uploader</Title>
      <Steps
        current={step}
        items={[
          { title: 'Upload Excel' },
          { title: 'Preview & Select Columns' },
          { title: 'Done' },
        ]}
      />
      <Divider />

      {step === 0 && <ExcelUploader onDataParsed={handleExcelParsed} />}
      {step >= 1 && (
        <>
          <HandsonTable data={excelData} mergeSettings={mergeConfig} />
          <ColumnSelector onSelectColumns={handleColumnsSelected} />
        </>
      )}
      {step === 2 && selectedCols && (
        <div style={{ marginTop: 20 }}>
          ✅ Name column: <b>{selectedCols.nameCol}</b> | Mobile column: <b>{selectedCols.mobileCol}</b>
        </div>
      )}
    </Layout>
  );
};

export default MainPage;
