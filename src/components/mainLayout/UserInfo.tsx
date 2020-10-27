import React, { useEffect } from "react";
import { Menu, Dropdown, Modal, message } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { AppContext } from "@shared/context/appContext";
import { post } from "@utils/request";
import { useHistory } from "react-router-dom";

const UserInfo: React.FC = (props) => {
  const { state, dispatch } = React.useContext(AppContext);
  const history = useHistory();

  useEffect(() => {
    if (state.userInfo) {
      if (JSON.stringify(state.userInfo) === "{}") {
        // reloadUserInfo();
      }
    }
  }, [state]);

  const userLogout = () => {
    post("/user/logout", {
    }, true).then((data: any) => {
      if (data.code === 1) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
      message.error(data.message);
      }
    }).catch((data) => {
      message.error(data.message);
    });
  };
  const handleLogout = () => {
    
    Modal.confirm({
      maskClosable: true,
      title: '确认',
      content: '确认退出？',
      onOk: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            userLogout();
            resolve();
          }, 800);
        }).catch(() => console.log('Oops errors!'));
      },
    });
  };

  const getMenu = () => (
    <Menu>
      <Menu.Item onClick={handleLogout}>
        <span className={"menuItem"}>退出登录</span>
      </Menu.Item>
    </Menu>
  );

  const render = () => {

    return (
      <div className={"userInfo"}>
        <Dropdown
        trigger={['click']}
          overlay={getMenu()}
          className={"userDropdown"}
          placement="bottomRight"
        >
          <div className={"userDropdown"}>
            <li className="userIcon">
              <UserOutlined></UserOutlined>
            </li>
            <span className={"userName"}>
              {state.userInfo ? state.userInfo.userName : "user"}
            </span>
            <DownOutlined />
          </div>
        </Dropdown>
      </div>
    );
  };
  return render();
};

export default UserInfo;
