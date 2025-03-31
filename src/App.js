import React, { useState } from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TopMenu from './components/TopMenu/TopMenu';
import LeftMenu from './components/LeftMenu/LeftMenu';
import MainPage from './pages/Main/MainPage'
import NamelistPage from './pages/NameList/NameList'

import styles from './App.module.scss';

const { Sider, Header, Content } = Layout;

const username = 'John Doe';

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Router>
      <Layout className={styles.layoutPage}>
        <Sider className={styles.layoutPageSider} trigger={null} collapsible collapsed={collapsed}>
          <LeftMenu collapsed={collapsed} />
        </Sider>
        <Layout>
          <Header className={styles.layoutPageHeader}>
            <TopMenu collapsed={collapsed} toggleCollapsed={toggleCollapsed} username={username} />
          </Header>
          <Content className={styles.layoutPageContent}>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/namelist" element={<NamelistPage />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
