import { Alert } from "antd";
import React, { Component } from "react";

interface PropsInterface {
  children: any
}

interface IStateInterface {
  hasError: boolean;
  error?: Error | null;
}

class ErrorBoundary extends Component<PropsInterface, IStateInterface> {
  state = { hasError: false };

  componentDidCatch(error: Error | null): void {
    this.setState({ hasError: true, error });
  }

  render(): JSX.Element {
    if (this.state.hasError) {
      return <Alert message="访问遇到一些问题，请返回或刷新" type="error" />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;