import React from 'react';
import { Menu } from 'antd';
import { UploadOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from './LeftMenu.module.scss';

const Sidebar = ({ collapsed }) => {
  const menuItems = [
    {
      key: '1',
      icon: <UploadOutlined />,
      label: <Link to="/">Upload</Link>,
    },
    {
      key: '2',
      icon: <TeamOutlined />,
      label: <Link to="/namelist">Wedding Namelist</Link>,
    },
  ];

  return (
    <div className={styles.leftMenu}>
      <Menu
        className={styles.leftMenuMenu}
        mode="inline"
        theme="light"
        defaultSelectedKeys={['1']}
        items={menuItems}
      />
    </div>
  );
};

export default Sidebar;
