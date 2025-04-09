import React from 'react';
import { Menu } from 'antd';
import { UploadOutlined, UnorderedListOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import styles from './LeftMenu.module.scss';

const Sidebar = ({ collapsed }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <UploadOutlined />,
      label: <Link to="/">Upload</Link>,
    },
    {
      key: '/namelist',
      icon: <UnorderedListOutlined />,
      label: <Link to="/namelist">Namelist</Link>,
    },
    {
      key: '/checkin-dev',
      icon: <QrcodeOutlined />,
      label: <Link to="/checkin-dev">Check-in (Dev)</Link>,
    },
  ];

  return (
    <div className={styles.leftMenu}>
      <Menu
        className={styles.leftMenuMenu}
        mode="inline"
        theme="light"
        selectedKeys={[location.pathname]} // this line keeps selection in sync
        items={menuItems}
      />
    </div>
  );
};

export default Sidebar;
