// src/pages/ExcelUploadPage.jsx
import React, { useState } from 'react';
import { Layout, Steps, Divider, Space, message, Form, Input, Button } from 'antd';
import ExcelUploader from '../components/ExcelUploader';
import HandsontablePreview from '../components/HandsontablePreview';
import ColumnSelector from '../components/ColumnSelector';

const { Content } = Layout;

const ExcelUploadPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sheetData, setSheetData] = useState([]);

  const handleExcelParsed = (data) => {
    setSheetData(data);
    setCurrentStep(1);
  };

  return (
    <Layout style={{ padding: '24px' }}>
      <Content>
        <Steps current={currentStep} size="small" items={[
          { title: 'Upload Excel' },
          { title: 'View and Select Columns' },
          { title: 'Done' },
        ]} />

        <Divider />

        {currentStep === 0 && <ExcelUploader onParsed={handleExcelParsed} />}
        {currentStep >= 1 && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <HandsontablePreview data={sheetData} />
            <ColumnSelector onNext={() => setCurrentStep(2)} />
          </Space>
        )}
      </Content>
    </Layout>
  );
};

export default ExcelUploadPage;
