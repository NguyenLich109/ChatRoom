import Header from "../header";
import { Alert, Space } from "antd";

export default function Friends() {
  return (
    <>
      <div className="container-mess">
        <Header />
        <Alert
          style={{ margin: "15px 12px" }}
          message="Chức năng này chưa làm"
          type="info"
          showIcon
        />
      </div>
    </>
  );
}
