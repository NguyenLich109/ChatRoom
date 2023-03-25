import { memo } from "react";
import { Modal, Input } from "antd";
export default memo(function RemoveZoom({
  handleRemoveZoomOK,
  handleRemoveZoomCancel,
  checkRemoveZoom,
}: any) {
  return (
    <Modal
      title="Rời phòng"
      open={checkRemoveZoom}
      onOk={handleRemoveZoomOK}
      onCancel={handleRemoveZoomCancel}
    >
      Bạn có muốn rời nhóm hay không
    </Modal>
  );
});
