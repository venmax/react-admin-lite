import React from "react";
import { AppContext, AppContextAction } from "@shared/context/appContext";

const SamplePage: React.FC = () => {
  const { state, dispatch } = React.useContext(AppContext);
  const render = () => {
    return <div>sample page</div>;
  };
  return render();
};

export default SamplePage;
