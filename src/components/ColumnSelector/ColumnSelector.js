import React, { useState } from 'react';
import { Form, Input, Button, Space } from 'antd';

const COLUMN_CONFIGS = [
  {
    key: 'nameCol',
    label: 'Name Column',
    color: '#d7f1e1',
    borderColor: 'green',
    textColor: 'green',
  },
  {
    key: 'mobileCol',
    label: 'Mobile Column',
    color: '#d0ebff',
    borderColor: '#1890ff',
    textColor: '#1890ff',
  },
  {
    key: 'tableNumberCol',
    label: 'Table # Column',
    color: '#fff1b8',
    borderColor: '#faad14',
    textColor: '#faad14',
  },
];

const ColumnSelector = ({
  nameColLetter,
  mobileColLetter,
  tableNumberColLetter,
  setNameColLetter,
  setMobileColLetter,
  setTableNumberColLetter,
  onSelectColumns,
}) => {
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [duplicateError, setDuplicateError] = useState(false);

  const validate = (name, mobile, table) => {
    const values = [name, mobile, table].filter(Boolean);
    const unique = new Set(values);
    const isDuplicate = unique.size !== values.length;
    const isMissing = values.length < 3;

    setDuplicateError(isDuplicate);
    setDisableSubmit(isMissing || isDuplicate);
  };

  const handleChange = (key, value) => {
    const upper = value.toUpperCase().slice(0, 1);
    if (key === 'nameCol') setNameColLetter(upper);
    if (key === 'mobileCol') setMobileColLetter(upper);
    if (key === 'tableNumberCol') setTableNumberColLetter(upper);

    const name = key === 'nameCol' ? upper : nameColLetter;
    const mobile = key === 'mobileCol' ? upper : mobileColLetter;
    const table = key === 'tableNumberCol' ? upper : tableNumberColLetter;
    validate(name, mobile, table);
  };

  const onFinish = () => {
    onSelectColumns({
      nameCol: nameColLetter,
      mobileCol: mobileColLetter,
      tableNumberCol: tableNumberColLetter,
    });
  };

  return (
    <Form layout="inline" onFinish={onFinish} style={{ marginTop: 16 }}>
      {COLUMN_CONFIGS.map(({ key, label, color, borderColor, textColor }) => (
        <Form.Item
          key={key}
          label={label}
          validateStatus={duplicateError ? 'error' : ''}
          help={duplicateError ? 'Duplicate entry' : ''}
        >
          <Input
            placeholder="e.g. A"
            maxLength={1}
            value={
              key === 'nameCol'
                ? nameColLetter
                : key === 'mobileCol'
                ? mobileColLetter
                : tableNumberColLetter
            }
            onChange={(e) => handleChange(key, e.target.value)}
            style={{
              backgroundColor: color,
              borderColor: borderColor,
              color: textColor,
              fontWeight: 'bold',
            }}
          />
        </Form.Item>
      ))}
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" disabled={disableSubmit}>
            Confirm
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ColumnSelector;
