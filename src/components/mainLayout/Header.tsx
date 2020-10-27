import React from 'react';
import { AppContext } from '@shared/context/appContext';
import UserInfo from './UserInfo';
import { Layout } from 'antd';

const { Header } = Layout;

const HeaderContainer: React.FC = (props) => {
  const { state, dispatch } = React.useContext(AppContext);
  const render = () => {
    return (<Header className={'header'}>
      <div className={'rightPart'}>
      <UserInfo/>
      </div>
    </Header>)
  }
  return render();
};

export default HeaderContainer;