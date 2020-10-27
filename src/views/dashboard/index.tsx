import React, { useEffect, useState } from "react";
import {get, post, put, del} from '@utils/request';
import { AppContext, AppContextAction } from "@shared/context/appContext";

const Dashboard: React.FC = () => {
  const { state, dispatch } = React.useContext(AppContext);

  const getUserInfo = () => {
    get('/baseInfo', '').then((data) => {
      console.log(data);
    });
  };

  useEffect(() => {
    // getUserInfo();
  }, []);
  const render = () => {
  return <div>欢迎光临 {state.userInfo?.realName}, {state.userInfo?.mobile}</div>;
  };
  return render();
};

export default Dashboard;
