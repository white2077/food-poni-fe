import {
  Badge,
  Button,
  Card,
  Collapse,
  List,
  Modal,
  Popconfirm,
  Radio,
} from "antd";
import { useEffect, useState } from "react";
import ShippingAddressInfo from "@/components/organisms/shippingAddressInfo.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store.ts";
import {
  deleteAddressAction,
  fetchAddressesAction, updateShowAddForm,
} from "@/redux/modules/address.ts";
import CardHome from "@/components/atoms/cardHome.tsx";
import { updateShippingAddressAction } from "@/redux/modules/order.ts";
import { DeleteOutlined } from "@ant-design/icons";

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
      }),
    );
    if (currentUser) {
      dispatch(updateShippingAddressAction(currentUser.addressId));
    }
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
                dispatch(updateShippingAddressAction(e.target.value))
              }
            >
              <List
                dataSource={page.content}
                renderItem={(item) => (
                  <Collapse
                    className="my-[16px]"
                    expandIconPosition={"end"}
                    collapsible={"icon"}
                    items={[
                      {
                        key: item.id,
                        label: (
                          <div className="flex justify-between items-center">
                            <Radio id={`radio-${item.id}`} value={item.id}>
                              <div>
                                <span className="font-bold">
                                  {item.fullName}
                                </span>{" "}
                                | {item.phoneNumber}{" "}
                                {currentUser?.addressId === item.id ? (
                                  <Badge
                                    color="blue"
                                    count={"Địa chỉ mặc định"}
                                  />
                                ) : (
                                  ""
                                )}
                              </div>
                              <div>{item.address}</div>
                            </Radio>
                            <Popconfirm
                              title="Bạn có chắc chắn muốn xóa không?"
                              onConfirm={() =>
                                dispatch(deleteAddressAction({ aid: item.id }))
                              }
                              okText="Đồng ý"
                              cancelText="Hủy"
                              okButtonProps={{ loading: item.isDeleteLoading }}
                            >
                              <DeleteOutlined
                                hidden={currentUser?.addressId === item.id}
                              />
                            </Popconfirm>
                          </div>
                        ),
                        // children: <AddressCheckoutUpdate address={item} />
                      },
                    ]}
                  />
                )}
              />
            </Radio.Group>
          )}
        </Modal>
      </div>
      <div>
        {form && (
          <>
            <div>
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
