import React, { useEffect, useState } from 'react';
import {
  NotificationOutlined,
  DatabaseOutlined,
  HomeOutlined,
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  SunOutlined,
  TeamOutlined,
  FundOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Button, Layout, Menu, theme } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { Avatar } from 'antd';
import Main from '../views/main';
import Trend from '../views/trend';
import Enery from '../views/energy';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('MAIN', '1', <HomeOutlined />),
  getItem('ENERGY CKECK', '2', <SunOutlined />),
  getItem('TREND', '3', <FundOutlined />),
  getItem('DATA', '4', <DatabaseOutlined />),
  getItem('ALARM', '5', <NotificationOutlined />),
];



const DefaultLayout: React.FC = (props) => {
  
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, boxShadow },
  } = theme.useToken();


  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  }

  const [selectedKey, setSelectedKey] = useState('1');
  // Handle menu click
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key);
  };

   // Render content based on selected menu
  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <Main/>;
      case '2':
        return <Enery/>;
      case '3':
        return <Trend/>;
      case '4':
        return <div></div>;
      default:
        return <div></div>;
    }
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu onClick={handleMenuClick} theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
            <div className="flex items-center px-6 justify-between">
                <label className="text-3xl" >Uninterruptible Power Supply System</label>
                <div className="flex items-center justify-between">
                    <Avatar icon={<UserOutlined />} />
                    <h3 style={{paddingRight: 24, paddingLeft: 6}}>{props.user ? props.user.fullname : ''} </h3>
                    <Button type="primary"  onClick={handleLogout}>Logout</Button>
                </div>
            </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div
            style={{
              marginTop: 12,
              padding: 12,
              height: 800,
              background: colorBgContainer,
            }}
          >
            {renderContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          UPS ©{new Date().getFullYear()} Created by Tung
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;