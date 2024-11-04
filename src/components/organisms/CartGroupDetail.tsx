import { AvatarInfo } from "@/components/atoms/AvatarInfo";
import { ScrollPane } from "@/components/atoms/ScrollPane";
import { CartBody } from "@/components/molecules/CartBody";
import { CartHeader } from "@/components/molecules/CartHeader";
import {
  CartGroupState,
  createCartGroupRequest,
  createOrderGroupAction,
  deleteCartGroupAction,
  deleteCartGroupSuccess,
  kickUserAction,
  leaveCartGroupAction,
  updateCartGroupSelected,
  updateRoomTimeOutInputting,
  updateWindowSelected,
} from "@/redux/modules/cartGroup.ts";
import { currencyFormat, groupByUser, totalAmount } from "@/utils/common.ts";
import {
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  LeftOutlined,
  LogoutOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  notification,
  Popconfirm,
  Row,
  Tabs,
} from "antd";
import { useDispatch } from "react-redux";
import ShippingAddress from "./ShippingAddress";
import PaymentInfo from "./PaymentInfo";
import TextArea from "antd/es/input/TextArea";
import { TransitionGroup, CSSTransition } from "react-transition-group";

export function CartGroupDetail({
  cartGroupJoined,
  cartGroupSelected,
  creatingCartGroupLoading,
  currentUserId,
  isCreateLoading,
}: {
  cartGroupJoined: CartGroupState["cartGroupJoined"];
  cartGroupSelected: string;
  creatingCartGroupLoading: boolean;
  currentUserId: string;
  isCreateLoading: boolean;
}) {
  const dispatch = useDispatch();

  return (
    <>
      <div className="flex justify-between mb-4">
        <Button
          onClick={() => dispatch(updateWindowSelected({ window: "HOME" }))}
        >
          <LeftOutlined /> Quay lai
        </Button>
        <Popconfirm
          title={
            <Input
              className="w-36"
              type="text"
              prefix={<ClockCircleOutlined />}
              suffix={"phút"}
              placeholder="Thời lượng"
              onChange={(e) =>
                dispatch(updateRoomTimeOutInputting({ value: e.target.value }))
              }
            />
          }
          onConfirm={() => {
            dispatch(createCartGroupRequest());
          }}
        >
          <Button
            loading={creatingCartGroupLoading}
            type="primary"
            size="large"
          >
            <PlusOutlined />
            Tạo đơn nhóm
          </Button>
        </Popconfirm>
      </div>
      <Tabs
        hideAdd
        type="editable-card"
        onChange={(roomId) => dispatch(updateCartGroupSelected({ roomId }))}
        defaultActiveKey={cartGroupSelected}
        items={cartGroupJoined.map((it) => ({
          key: it.roomId,
          label: (
            <AvatarInfo
              fullName={it.user.username}
              avatar={it.user.avatar}
              info={`#${it.roomId}`}
              isVisibleCapital={true}
              timeout={it.timeout}
              roomId={it.roomId}
              deleteCartGroup={() => {
                dispatch(deleteCartGroupSuccess({ roomId: it.roomId }));
                notification.info({
                  message: "Thông báo!",
                  description: `Đơn nhóm ${it.roomId} của ${it.user.username} đã bị hết hạn!`,
                });
              }}
            />
          ),
          children: (
            <Row gutter={16}>
              <Col flex="700">
                <ScrollPane maxHeight="h-[600px]">
                  <TransitionGroup>
                    {groupByUser(it.cartItems).map((ci) => (
                      <CSSTransition
                        key={ci.user.id}
                        timeout={200}
                        classNames="fade"
                      >
                        <div>
                          <Card
                            size="small"
                            title={
                              <div className="flex justify-between items-center">
                                <AvatarInfo
                                  fullName={ci.user.username}
                                  avatar={ci.user.avatar}
                                  info={`${ci.items.length} sản phẩm`}
                                  padding={"py-1"}
                                />
                                {it.user.id === currentUserId &&
                                  ci.user.id !== currentUserId && (
                                    <Popconfirm
                                      title="Bạn có chắc muốn kick người này?"
                                      onConfirm={() => {
                                        dispatch(
                                          kickUserAction({
                                            roomId: it.roomId,
                                            userId: ci.user.id,
                                          })
                                        );
                                      }}
                                      okText="Đồng ý"
                                      cancelText="Hủy"
                                    >
                                      <Button
                                        danger
                                        type="text"
                                        icon={<CloseOutlined />}
                                        loading={
                                          ci.kickingUserFromCartItemLoading
                                        }
                                      >
                                        Kick
                                      </Button>
                                    </Popconfirm>
                                  )}
                              </div>
                            }
                          >
                            <CartHeader enableCartGroup={true} />
                            <CartBody
                              isFetchLoading={false}
                              enableCartGroup={true}
                              carts={ci.items}
                              currentUserId={currentUserId}
                            />
                          </Card>
                          <div>
                            {currencyFormat(totalAmount(ci.items, true))}
                          </div>
                          <Divider />
                        </div>
                      </CSSTransition>
                    ))}
                  </TransitionGroup>
                </ScrollPane>
              </Col>
              <Col flex="300">
                <Card style={{ marginBottom: "16px" }}>
                  <div className="flex justify-between">
                    <div className="text-gray-500">Tạm tính</div>
                    <span style={{ float: "right" }}>
                      {currencyFormat(totalAmount(it.cartItems, true))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-500">Giảm giá</div>
                    <span className="float-right">0 ₫</span>
                  </div>
                  <Divider />
                  <div className="flex justify-between">
                    <div className="text-gray-500">Tổng tiền</div>
                    <div className="grid">
                      <div className="text-2xl text-red-500 text-right float-right">
                        {currencyFormat(totalAmount(it.cartItems, true))}
                      </div>
                      <div className="right-0 text-gray-400">
                        (Đã bao gồm VAT nếu có)
                      </div>
                    </div>
                  </div>
                </Card>
                {it.user.id === currentUserId && (
                  <>
                    <ShippingAddress />
                    <PaymentInfo />
                    <Form
                      name="normal_login"
                      className="login-form"
                      initialValues={{ remember: true }}
                    >
                      <Form.Item name="note">
                        <TextArea placeholder="Ghi chú" allowClear />
                      </Form.Item>
                      <Form.Item>
                        <Popconfirm
                          title="Bạn có chắc chắn muốn đặt hàng không?"
                          onConfirm={() =>
                            dispatch(
                              createOrderGroupAction({
                                roomId: it.roomId,
                                totalAmount: totalAmount(it.cartItems, true),
                              })
                            )
                          }
                          okText="Đồng ý"
                          cancelText="Hủy"
                        >
                          <Button
                            type="primary"
                            htmlType="submit"
                            danger
                            block
                            loading={isCreateLoading}
                            disabled={false}
                          >
                            Thanh toán
                          </Button>
                        </Popconfirm>
                      </Form.Item>
                    </Form>
                  </>
                )}
              </Col>
              <div className="absolute bottom-0 left-0">
                {it.user.id !== currentUserId && (
                  <Popconfirm
                    title="Bạn có chắc chắn muốn thoát đơn nhóm không?"
                    onConfirm={() =>
                      dispatch(
                        leaveCartGroupAction({
                          roomId: it.roomId,
                        })
                      )
                    }
                    okText="Đồng ý"
                    cancelText="Hủy"
                  >
                    <Button className="mr-2" type="default" size="large">
                      <LogoutOutlined />
                      Thoát đơn nhóm
                    </Button>
                  </Popconfirm>
                )}
                {it.user.id === currentUserId && (
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa đơn nhóm không?"
                    onConfirm={() =>
                      dispatch(deleteCartGroupAction({ roomId: it.roomId }))
                    }
                    okText="Đồng ý"
                    cancelText="Hủy"
                  >
                    <Button
                      className="bg-red-600 text-white"
                      type="default"
                      size="large"
                      loading={it.deletingCartGroupLoading}
                    >
                      <DeleteOutlined />
                      Xóa đơn nhóm
                    </Button>
                  </Popconfirm>
                )}
              </div>
            </Row>
          ),
          closable: false,
        }))}
      />
    </>
  );
}
