import { RootState } from "@/redux/store.ts";
import { Modal } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ManagementLayout } from "../templates/ManagementLayout";

export const AccountInformationPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [showAddAddress, setShowAddAddress] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  if (!currentUser) {
    return null;
  }

  const handleAddAddressClick = (): void => {
    setShowAddAddress(!showAddAddress);
  };

  return (
    <ManagementLayout>
      {showAddAddress ? (
        <div className="w-[600px] mx-auto">
          <div className="flex items-center">
            <button
              onClick={handleAddAddressClick}
              className="text-xl font-sans text-gray-400 hover:text-gray-500"
            >
              Thông tin cá nhân
            </button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.91107 3.41107C6.23651 3.08563 6.76414 3.08563 7.08958 3.41107L12.0896 8.41107C12.415 8.73651 12.415 9.26415 12.0896 9.58958L7.08958 14.5896C6.76414 14.915 6.23651 14.915 5.91107 14.5896C5.58563 14.2641 5.58563 13.7365 5.91107 13.4111L10.3218 9.00033L5.91107 4.58958C5.58563 4.26414 5.58563 3.73651 5.91107 3.41107Z"
                fill="#f36f24"
              ></path>
            </svg>
            {/* <SelectedItemLabel label={"Đổi mật khẩu"} /> */}
          </div>
          {/*<ChangePassword />*/}
        </div>
      ) : (
        <div>
          <Modal
            title="Cập nhật ảnh đại diện"
            open={openUpdate}
            onOk={() => setOpenUpdate(false)}
            onCancel={() => setOpenUpdate(false)}
            width={500}
            height={500}
            footer={null}
          >
            {/*<ChangeAvatar />*/}
          </Modal>
        </div>
      )}
    </ManagementLayout>
  );
};
