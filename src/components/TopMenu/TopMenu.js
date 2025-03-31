import React from 'react';
import { Button, Avatar } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import styles from './TopMenu.module.scss';
// import getInitials from '../../utils'

const HeaderBar = ({ collapsed, toggleCollapsed, username }) => {
  // const initials = getInitials(username);
const initials = 'DB'

  return (
    <div className={styles.topmenuBar}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleCollapsed}
        className={styles.topmenuButton}
      />
      <Avatar className={styles.topmenuAvatar}>{initials}</Avatar>
    </div>
  );
};

export default HeaderBar;
