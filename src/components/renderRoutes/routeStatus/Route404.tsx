import { Alert } from 'antd';
import React, { memo } from 'react';

const Route404: React.FC = () => {
  const render = () => {
    return (
      <div>
        <h1>404 无法找到该页面</h1>
      <Alert message="无效的访问地址，请返回重试" type="error" />
      </div>);
  };
  return render();
};

export default memo(Route404);