import { Row, Spin } from "antd";

type Props = {
  loading?: boolean;
};

const Loading = ({ loading = true }: Props) => {
  return (
    <>
      {loading ? (
        <Row
          justify={"center"}
          align={"middle"}
          style={{
            height: "80vh",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Spin />
        </Row>
      ) : (
        <></>
      )}
    </>
  );
};

export default Loading;
