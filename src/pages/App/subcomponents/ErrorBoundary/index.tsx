import { ReloadOutlined } from '@ant-design/icons';
import { Button, Image, Space, Typography } from 'antd';
import ErrorImage from 'assets/images/png/503 Error Service Unavailable-rafiki.png';
import { Component, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Space
          direction='vertical'
          style={{
            margin: '50px 0',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image preview={false} width={500} height={500} src={ErrorImage} />
          <Typography.Title
            level={3}
            style={{
              color: '#444 !important',
            }}
          >
            Có lỗi xảy ra, vui lòng thử lại sau.
          </Typography.Title>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              window.location.pathname = '/';
              window.location.reload();
            }}
          >
            Tải lại
          </Button>
        </Space>
      );
    }

    return this.props.children;
  }
}
