import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Spin, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const NamelistPage = () => {
  const [guestList, setGuestList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [messageApi, contextHolder] = message.useMessage();

  const fetchGuestList = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/guests');
      console.log('fetched!!')
      setGuestList(res.data);
    } catch (err) {
      console.error('Failed to fetch guests:', err);
      messageApi.error('Failed to load guest list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestList(); // Initial load
  
    const interval = setInterval(() => {
      fetchGuestList();
    }, 5000); // Poll every 5s
  
    return () => clearInterval(interval); // Cleanup
  }, []);
  

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 150,
    },
    {
      title: 'Table #',
      dataIndex: 'tableNumber',
      key: 'tableNumber',
      width: 100,
    },
    {
      title: 'Attendance',
      dataIndex: 'isPresent',
      key: 'isPresent',
      width: 150,
      render: (isPresent) =>
        isPresent ? (
          <Tag color="green">Present</Tag>
        ) : (
          <Tag color="red">Not Present</Tag>
        ),
    },
  ];
  

  return (
    <>
    {contextHolder}
    <div style={{ padding: 24 }}>
      <Title level={3}>Wedding Guest Namelist</Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={guestList}
          rowKey="id"
          bordered
          pagination={false}
        />
      )}
    </div>
    </>
  );
};

export default NamelistPage;
