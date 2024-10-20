import { Button, Card, Collapse, Modal, Popconfirm, Radio } from "antd";
import { useEffect, useState } from "react";
import ShippingAddressInfo from "@/components/organisms/shippingAddressInfo.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store.ts";
import {
  deleteAddressAction,
  fetchAddressesAction,
  updateShowAddForm,
} from "@/redux/modules/address.ts";
import CardHome from "@/components/atoms/cardHome.tsx";
import { updateShippingAddressAction } from "@/redux/modules/order.ts";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { updateCurrentUserAddressAction } from "@/redux/modules/auth";

export default function ShippingAddress() {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { page } = useSelector((state: RootState) => state.address);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { form } = useSelector((state: RootState) => state.order);
  const { isShowAddForm } = useSelector((state: RootState) => state.address);

  useEffect(() => {
    dispatch(
      fetchAddressesAction({
        queryParams: {
          page: 0,
          pageSize: 10,
          status: true,
        },
      })
    );
  }, [dispatch]);

  return (
    <Card style={{ marginBottom: "16px" }}>
      <div>
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
        <Modal
          title="Địa chỉ của bạn"
          centered
          open={modalOpen}
          onOk={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
          footer={null}
        >
          <Button onClick={() => dispatch(updateShowAddForm())}>
            {isShowAddForm ? "Quay lại" : "Thêm địa chỉ"}
          </Button>
          {isShowAddForm && <ShippingAddressInfo />}
          {!isShowAddForm && (
            <Radio.Group
              className="w-full"
              defaultValue={currentUser?.addressId}
              onChange={(e) =>
                dispatch(updateShippingAddressAction({ sid: e.target.value }))
              }
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
                        <Radio id={`radio-${it.id}`} value={it.id}>
                          <div className="truncate">
                            <span className="font-bold">{it.fullName}</span> |{" "}
                            {it.phoneNumber}{" "}
                            {currentUser?.addressId === it.id ? (
                              <span className="text-green-700">
                                <CheckCircleOutlined />{" "}
                                <span className="text-sm">
                                  Địa chỉ mặc định
                                </span>
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
                          <DeleteOutlined
                            hidden={currentUser?.addressId === it.id}
                          />
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
      </div>
      <div>
        {form.shippingAddress && (
          <>
            <div className="text-ellipsis">
              <span style={{ fontWeight: "bold" }}>
                {form.shippingAddress.fullName}
              </span>{" "}
              | {form.shippingAddress.phoneNumber}
            </div>
            <div>
              <CardHome content="Nhà" />
              {form.shippingAddress.address}
            </div>
          </>
        )}
        {/*{!shippingAddress && (*/}
        {/*    <div style={{color: 'red'}}>Vui lòng chọn thông tin vận chuyển</div>*/}
        {/*)}*/}
      </div>
    </Card>
  );
}
