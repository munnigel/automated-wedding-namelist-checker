import React, { useState } from 'react';
import { Steps, Divider, Layout, Button, message, Result, Space } from 'antd';
import ExcelUploader from '../../components/ExcelUploader/ExcelUploader';
import HandsonTable from '../../components/HandsontablePreview/HandsonTable';
import ColumnSelector from '../../components/ColumnSelector/ColumnSelector';

import axios from 'axios';
import * as XLSX from 'xlsx';
import {
  parseSheetToJSON,
  extractMergeConfig,
  generateGuestPayload
} from '../../utils/HandsonTableUtils';


const MainPage = () => {
  const [step, setStep] = useState(0);
  const [excelData, setExcelData] = useState([]);
  const [mergeConfig, setMergeConfig] = useState([]);
  const [selectedCols, setSelectedCols] = useState(null);
  const [finalGuestList, setFinalGuestList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameColLetter, setNameColLetter] = useState('');
  const [mobileColLetter, setMobileColLetter] = useState('');
  const [tableNumberColLetter, setTableNumberColLetter] = useState('');


  const [messageApi, contextHolder] = message.useMessage();


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

  const handleColumnsSelected = async (cols) => {
    setSelectedCols(cols);
  
    const guestList = generateGuestPayload(
      excelData,
      cols.nameCol,
      cols.mobileCol,
      cols.tableNumberCol
    );
  
    setFinalGuestList(guestList);
  
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/guests', guestList);
      messageApi.success('Guest list successfully saved to database!');
      setStep(2);
    } catch (error) {
      console.error('Error saving to DB:', error);
      messageApi.error('Failed to save guest list to database.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
    {contextHolder}
    <Layout style={{ padding: '24px' }}>
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
      {step === 1 && (
        <>
          <HandsonTable
            data={excelData}
            mergeSettings={mergeConfig}
            highlightCols={{
              nameCol: nameColLetter,
              mobileCol: mobileColLetter,
              tableNumberCol: tableNumberColLetter,
            }}
          />

          <ColumnSelector
            nameColLetter={nameColLetter}
            mobileColLetter={mobileColLetter}
            tableNumberColLetter={tableNumberColLetter}
            setNameColLetter={setNameColLetter}
            setMobileColLetter={setMobileColLetter}
            setTableNumberColLetter={setTableNumberColLetter}
            onSelectColumns={handleColumnsSelected}
          />


        </>
      )}
   {step === 2 && selectedCols && (
      <Result
        status="success"
        title="Guest List Uploaded Successfully"
        subTitle={
          <>
            Your document has been successfully uploaded.<br />
            You can now proceed to the attendance or QR check-in page.
          </>
        }
        extra={[
          <Button type="primary" key="attendance" href="/namelist">
            Go to Attendance Page
          </Button>,
          <Button key="checkin" href="/checkin">
            Go to QR Check-in Page
          </Button>,
        ]}
      />
    )}
    </Layout>
    </>
  );
};

export default MainPage;
