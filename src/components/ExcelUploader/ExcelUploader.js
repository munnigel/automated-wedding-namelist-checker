import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';

const { Dragger } = Upload;

const ExcelUploader = ({ onDataParsed }) => {
  const props = {
    name: 'file',
    multiple: false,
    customRequest({ file, onSuccess }) {
      onDataParsed(file); // pass file up
      onSuccess("ok");
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag Excel file to this area to upload</p>
      <p className="ant-upload-hint">Supports .xlsx or .xls files only.</p>
    </Dragger>
  );
};

export default ExcelUploader;
