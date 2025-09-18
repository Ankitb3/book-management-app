import { useState } from 'react';
import { AppstoreOutlined, MailOutlined, MenuUnfoldOutlined, MenuFoldOutlined, LoadingOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Badge, Tooltip } from 'antd';
import { Link, useLocation } from 'react-router-dom'; 
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton } from '@clerk/clerk-react';
import BookList from '../pages/BookList';
import ProtectedRoute from './ProtectedRoute';
import TodaysBooks from '../pages/TodaysBooks';
import { AuroraText } from './ui/aurora-text';
import { useBooks } from '../hooks/useBooks';
import { LayoutTextFlip } from './ui/layout-text-flip';

const { Header, Sider, Content } = Layout;



const SidebarMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { books } = useBooks()
  const items = [
    {
      key: 'dashboard',
      label: (
        <span className="flex items-center gap-2">
          Dashboard
          <Tooltip title="total numbers of books added"><Badge count={books?.length} size="small" color='gray' /></Tooltip>
        </span>
      ),
      icon: <MailOutlined />,
      path: '/dashboard',
    },
    {
      key: 'todays-added-books',
      label: 'Todays Added Books',
      icon: <AppstoreOutlined />,
      path: '/todays-added-books',
    },
    {
      key: 'comming-soon',
      label: 'Comming Soon',
      icon: <LoadingOutlined />,
      path: '/comming-soon',
    },
  ];
  const renderComponent = () => {
    switch (location.pathname) {
      case '/dashboard':
        return <ProtectedRoute><BookList /></ProtectedRoute>;
      case '/todays-added-books':
        return <ProtectedRoute><TodaysBooks /></ProtectedRoute>;
         case '/comming-soon':
        return <ProtectedRoute><div className='flex justify-center item-center align-middle mt-20'><LayoutTextFlip  text='Coming Soon More feature Like' words={["ANALYTICS", "Book Reviews", "Import/Export Books", "USER FEATURES"]} /></div></ProtectedRoute>;
      case '/sign-in':
        return <div className='flex justify-center m-2'><SignIn /></div>
      default:
        return <ProtectedRoute><BookList /></ProtectedRoute>;
    }


  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="md"
        onBreakpoint={(broken) => setCollapsed(broken)}
      >
        <div style={{ height: 64, margin: 16 }} >
          {
            collapsed ? "" : <div className='md:block hidden'>          <AuroraText >BOOK MANAGEMENT</AuroraText>
            </div>
          }

        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}>
          {items.map(item => (
            <Menu.Item key={item.path} icon={item.icon}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '18px' }}
          />
          <div className="flex justify-end relative bottom-3">
            <SignedOut>
              <span className="relative bottom-13">
                <Button className="bg-red-900 text-white">
                  <SignInButton />
                </Button>
              </span>
            </SignedOut>
            <SignedIn>
              <span className="relative bottom-13">
                <UserButton />
              </span>
            </SignedIn>
          </div>
        </Header>
        <Content style={{ padding: '0 16px' }}>
          {renderComponent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarMenu;
