import React from 'react';
import { Link } from 'react-router-dom';

const SiteDetail: React.FC = props => {
  const render = () => {
    return (
      <Link
        to={'/'}
        className={'siteDetail'}
        replace
        title="admin title"
      >
        Admin Site
      </Link>
    );
  }
  return render();
};

export default SiteDetail;
