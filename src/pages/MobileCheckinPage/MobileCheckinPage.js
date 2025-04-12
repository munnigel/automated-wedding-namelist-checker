import React, { useEffect, useState, useCallback } from 'react';
import { Input, Typography, Button, message } from 'antd';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MobileCheckinPage.module.scss';
import AnimatedSignature from '../../components/AnimatedSignature/AnimatedSignature';

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
      <div className={styles.pageWrapper}>
      <div className={styles.checkinWrapper}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title level={4} style={{ color: '#000', marginBottom: 10 }}>
          Wedding Guest Check-In
        </Title>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.3 }}
      >
        <Input
          placeholder="Enter your mobile number"
          value={mobile}
          onChange={handleChange}
          className={styles.checkinInput}
          size="large"
          maxLength={20}
        />
      </motion.div>

        <AnimatePresence>
          {!confirmed && matchedGuest && (
            <motion.div
              className={styles.matchInfo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Text>Your name: <b>{matchedGuest.name}</b></Text>
              <Button type="primary" onClick={handleConfirm} block style={{ marginTop: 12 }}>
                Confirm
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {confirmed && matchedGuest && (
            <motion.div
              className={styles.resultBox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <Text className={styles.success}>✅ You are checked in!</Text>
              <Title level={3}>Your ID: {matchedGuest.id}</Title>
              <Text type="secondary">Table #: <b>{matchedGuest.tableNumber}</b></Text>
            </motion.div>
          )}
        </AnimatePresence>
       
      </div>
      <AnimatedSignature />
      </div>
    </>
  );
};

export default MobileCheckinPage;
