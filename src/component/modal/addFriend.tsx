import { Modal, Input, Select } from "antd";
import { memo, useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hookReudx";

export default memo(function AddFriend({
  handleFriendOK,
  handleFrienCancel,
  optionCheck,
}: any) {
  const getSuggest = useAppSelector((state) => state.chatRoom.suggestRoom);

  const [value, setValue] = useState<string[] | undefined>();

  useEffect(() => {
    setValue(optionCheck.value);
  }, [optionCheck.value]);

  return (
    <Modal
      title="Mời bạn"
      open={optionCheck.checkFriend}
      onOk={() => handleFriendOK({ getSuggest, value })}
      onCancel={handleFrienCancel}
    >
      <div>
        <label htmlFor="nameZoom">Mời bạn:</label>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Bạn bè"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        >
          {getSuggest?.map((sugget) => {
            return (
              <Select.Option
                key={sugget.id}
                value={sugget.id}
                label={sugget.name}
              >
                {sugget.name}
              </Select.Option>
            );
          })}
        </Select>
      </div>
    </Modal>
  );
});
