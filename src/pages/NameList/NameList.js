import React, { useEffect, useRef, useState } from 'react';
import { Table, Tag, Typography, Spin, message, Input, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from 'axios';

const { Title } = Typography;

const NamelistPage = () => {
  const [guestList, setGuestList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [filteredInfo, setFilteredInfo] = useState({});
  const searchInput = useRef(null);

  const [messageApi, contextHolder] = message.useMessage();

  const fetchGuestList = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/guests');
      setGuestList(res.data);
    } catch (err) {
      console.error('Failed to fetch guests:', err);
      messageApi.error('Failed to load guest list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestList();
    const interval = setInterval(fetchGuestList, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setFilteredInfo({ ...filteredInfo, [dataIndex]: selectedKeys });
  };

  const handleReset = (clearFilters, dataIndex) => {
    clearFilters();
    setSearchText('');
    const newFilteredInfo = { ...filteredInfo };
    delete newFilteredInfo[dataIndex];
    setFilteredInfo(newFilteredInfo);
  };

  const clearAllFilters = () => {
    setFilteredInfo({});
    setSearchText('');
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    filteredValue: filteredInfo[dataIndex] || null,
    filterDropdownOpen: undefined, // keep Ant default handling
    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => {
            searchInput.current?.select();
          }, 100); // small delay to ensure it's mounted
        }
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text?.toString() || ''}
        />
      ) : (
        text
      ),
  });
  

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Name', dataIndex: 'name', key: 'name', width: 200, ...getColumnSearchProps('name') },
    { title: 'Mobile', dataIndex: 'mobile', key: 'mobile', width: 150, ...getColumnSearchProps('mobile') },
    { title: 'Table #', dataIndex: 'tableNumber', key: 'tableNumber', width: 100 },
    {
      title: 'Attendance',
      dataIndex: 'isPresent',
      key: 'isPresent',
      width: 150,
      render: (isPresent) =>
        isPresent ? <Tag color="green">Present</Tag> : <Tag color="red">Not Present</Tag>,
    },
  ];

  return (
    <>
      {contextHolder}
      <div style={{ padding: 24 }}>
        <Title level={3}>Wedding Guest Namelist</Title>

        <div style={{ marginBottom: 16 }}>
          <Button icon={<ReloadOutlined />} onClick={clearAllFilters}>
            Reset All Filters
          </Button>
        </div>

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
