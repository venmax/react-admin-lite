import { AppContext, AppContextAction, IUserInfo } from "@shared/context/appContext";
import { post } from "@utils/request";
import { Layout, Form, Input, Button, Checkbox, message } from "antd";
import React, { useContext, useEffect } from "react";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import './style.less';
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const { Header, Footer, Content } = Layout;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface IFormProps {
  username: string,
  password: string
}

const LoginPage: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const login = (info: IFormProps) => {
    post("/user/login", {
      userName: info.username,
      password: info.password
    }).then((data: IUserInfo | any) => {
      if (data.code === 1) {
      const userInfo = data.data as IUserInfo;
      userInfo.roles = ['admin'];
      dispatch({type: AppContextAction.login, payload: {...userInfo}});
      } else {
        message.error(data.message);
      }
    }).catch(() => {/* */});
  };

  useEffect(() => {
    setTimeout(() => {
      // 
    }, 5000);
  }, []);

  const onFinish = (values: IFormProps) => {
    console.log('Success:', values);
    login(values);
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity<IFormProps>) => {
    console.log('Failed:', errorInfo);
  };

  const renderFormContent = () => {
    return (<Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <div className={'form-title'}>Admin Login</div>
      <Form.Item
        label=""
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="用户名" prefix={<UserOutlined className="site-form-item-icon" />} />
      </Form.Item>

      <Form.Item
        label=""
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password placeholder="密码" prefix={<LockOutlined className="site-form-item-icon" />} />
      </Form.Item>
      {/* 
      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>记住我</Checkbox>
      </Form.Item> */}

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button" block>
          立即登录
        </Button>
      </Form.Item>
    </Form>);
  };
  const render = () => {
    return (
      <Layout className={'login-page'}>
        <Content className={'login-content'}>{renderFormContent()}</Content>
        <Footer className={'login-footer'}>
          <div>footer</div>
        </Footer>
      </Layout>);
  };
  return render();
};

export default LoginPage;
