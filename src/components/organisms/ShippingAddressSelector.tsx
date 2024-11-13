import CardHome from "@/components/atoms/CardHome";
import ShippingAddressInfo from "@/components/organisms/ShippingAddressInfo";
import { deleteAddressAction } from "@/redux/modules/address.ts";
import { updateCurrentUserAddressAction } from "@/redux/modules/auth";
import { RootState } from "@/redux/store.ts";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Collapse, Modal, Popconfirm, Radio, Spin } from "antd";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const ShippingAddressSelector = ({
  value,
  onOk,
}: {
  value: string;
  onOk: (value: string) => void;
}) => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { page, isDeleteLoading } = useSelector(
    (state: RootState) => state.address
  );
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [addressIdSelected, setAddressIdSelected] = useState<string>(value);
  const [isShowAddForm, setIsShowAddForm] = useState<boolean>(false);

  const addressDisplay = useMemo(
    () => page.content.find((it) => it.id === value),
    [value, page.content]
  );

  return (
    <Card>
      <div className="flex justify-between items-center">
        <div className="text-[17px] text-gray-400">Giao tới</div>
        <Button
          id="button-change-address"
          type="link"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Thay đổi
        </Button>
      </div>
      {addressDisplay && (
        <>
          <div className="text-ellipsis">
            <span style={{ fontWeight: "bold" }}>
              {addressDisplay.fullName}
            </span>{" "}
            | {addressDisplay.phoneNumber}
          </div>
          <div>
            <CardHome content="Nhà" />
            {addressDisplay.address}
          </div>
        </>
      )}
      <Modal
        title="Địa chỉ của bạn"
        centered
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={
          isShowAddForm ? null : (
            <>
              <Button type="default" onClick={() => setModalOpen(false)}>
                Hủy
              </Button>
              <Button
                disabled={addressIdSelected === value}
                type="primary"
                onClick={() => {
                  if (addressIdSelected) {
                    onOk(addressIdSelected);
                    setModalOpen(false);
                  }
                }}
              >
                Chọn
              </Button>
            </>
          )
        }
      >
        <Button onClick={() => setIsShowAddForm(!isShowAddForm)}>
          {isShowAddForm ? "Quay lại" : "Thêm địa chỉ"}
        </Button>
        {isShowAddForm && <ShippingAddressInfo />}
        {!isShowAddForm && (
          <Radio.Group
            className="w-full"
            defaultValue={value}
            onChange={(e) => setAddressIdSelected(e.target.value)}
          >
            <Collapse
              className="my-[16px]"
              accordion
              expandIconPosition="end"
              collapsible="icon"
              expandIcon={() => <span>Sửa</span>}
              items={page.content.map((it) => {
                return {
                  key: it.id,
                  label: (
                    <div className="flex justify-between items-center">
                      <Radio value={it.id}>
                        <div className="truncate">
                          <span className="font-bold">{it.fullName}</span> |{" "}
                          {it.phoneNumber}{" "}
                          {currentUser && currentUser.addressId === it.id ? (
                            <span className="text-green-700">
                              <CheckCircleOutlined />{" "}
                              <span className="text-sm">Địa chỉ mặc định</span>
                            </span>
                          ) : (
                            <span
                              className="px-1 rounded-lg cursor-pointer text-blue-700 hover:underline"
                              onClick={() =>
                                dispatch(
                                  updateCurrentUserAddressAction({
                                    aid: it.id,
                                  })
                                )
                              }
                            >
                              Thiết lập mặc định
                            </span>
                          )}
                        </div>
                        <div>{it.address}</div>
                      </Radio>
                      <Popconfirm
                        className="absolute right-12 top-4"
                        title="Bạn có chắc chắn muốn xóa không?"
                        onConfirm={() =>
                          dispatch(deleteAddressAction({ aid: it.id }))
                        }
                        okText="Đồng ý"
                        cancelText="Hủy"
                        okButtonProps={{ loading: it.isDeleteLoading }}
                      >
                        {isDeleteLoading ? (
                          <Spin />
                        ) : (
                          <DeleteOutlined
                            hidden={
                              currentUser
                                ? currentUser.addressId === it.id
                                : false
                            }
                          />
                        )}
                      </Popconfirm>
                    </div>
                  ),
                  children: <ShippingAddressInfo address={it} />,
                };
              })}
            />
          </Radio.Group>
        )}
      </Modal>
    </Card>
  );
};
