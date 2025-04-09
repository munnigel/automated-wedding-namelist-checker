import React, { useEffect, useState, useCallback } from 'react';
import { Input, Typography, Button, message } from 'antd';
import axios from 'axios';
import debounce from 'lodash.debounce';
import styles from './MobileCheckinPage.module.scss';

const { Title, Text } = Typography;

const MobileCheckinPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [mobile, setMobile] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [matchedGuest, setMatchedGuest] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/guests')
      .then((res) => setGuestList(res.data))
      .catch(() => messageApi.error('Unable to fetch guest list'));
  }, []);

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
      messageApi.success('Marked as present!');
    } catch {
      messageApi.error('Check-in failed');
    }
  };

  return (
    <>
      {contextHolder}
      <div className={styles.checkinWrapper}>
        <Title level={4}>Wedding Check-In</Title>

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

      </div>
    </>
  );
};

export default MobileCheckinPage;
