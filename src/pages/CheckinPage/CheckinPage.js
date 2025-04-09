import React, { useEffect, useState, useCallback } from 'react';
import { Input, Typography, Button, message, QRCode, Space } from 'antd';
import axios from 'axios';
import debounce from 'lodash.debounce';
import styles from './CheckinPage.module.scss';

const { Title, Text } = Typography;

const CheckinPage = () => {
  const [mobile, setMobile] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [matchedGuest, setMatchedGuest] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  // Fetch guest list on load
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/guests')
      .then((res) => setGuestList(res.data))
      .catch(() => message.error('Unable to fetch guest list'));
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((number) => {
      const match = guestList.find((g) => g.mobile === number);
      setMatchedGuest(match || null);
      setConfirmed(false);
    }, 300),
    [guestList]
  );

  const handleChange = (e) => {
    const value = e.target.value.trim();
    setMobile(value);
    debouncedSearch(value);
  };

  const handleConfirm = async () => {
    if (!matchedGuest) return;
  
    try {
      const res = await axios.patch(`http://localhost:5000/api/guests/${matchedGuest.id}/present`);
      setMatchedGuest(res.data);
      setConfirmed(true);
      messageApi.success('Marked as present');
    } catch (err) {
      console.error('Confirm error:', err);
      messageApi.error('Failed to mark attendance');
    }
  };
  

  return (
    <>
    {contextHolder}
    <div className={styles.checkinContainer}>
      <Title level={4}>Wedding Guest Check-in</Title>

      <Input
        placeholder="Enter your mobile number"
        value={mobile}
        onChange={handleChange}
        className={styles.checkinInput}
        size="large"
        maxLength={20}
      />

      {matchedGuest && !confirmed && (
        <div className={styles.matchInfo}>
          <Text>Your name: <b>{matchedGuest.name}</b></Text>
          <Button type="primary" onClick={handleConfirm} block style={{ marginTop: 12 }}>
            Confirm
          </Button>
        </div>
      )}

      {confirmed && matchedGuest && (
        <div className={styles.resultBox}>
          <Text>✅ You are checked in!</Text>
          <Title level={3}>Your ID: {matchedGuest.id}</Title>
          <Text type="secondary">Table #: <b>{matchedGuest.tableNumber}</b></Text>
        </div>
      )}

      <div className={styles.qrBox}>
        <Text type="secondary">Scan this to access check-in</Text>
        <QRCode value="http://localhost:3000/checkin" size={120} />
      </div>
    </div>
    </>
  );
};

export default CheckinPage;
