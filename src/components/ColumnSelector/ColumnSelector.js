import React from 'react';
import { Form, Input, Button, Space } from 'antd';

const ColumnSelector = ({ onSelectColumns }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const { nameCol, mobileCol } = values;
    onSelectColumns({ nameCol, mobileCol });
  };

  return (
    <Form layout="inline" form={form} onFinish={onFinish} style={{ marginTop: 16 }}>
      <Form.Item
        label="Name Column"
        name="nameCol"
        rules={[{ required: true, message: 'Enter column letter' }]}
      >
        <Input placeholder="e.g. A" />
      </Form.Item>
      <Form.Item
        label="Mobile Column"
        name="mobileCol"
        rules={[{ required: true, message: 'Enter column letter' }]}
      >
        <Input placeholder="e.g. B" />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">Confirm</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ColumnSelector;
