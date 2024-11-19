import { AvatarInfo } from "@/components/atoms/AvatarInfo";
import { CodeInput } from "@/components/atoms/CodeInput";
import {
  createCartGroupRequest,
  deleteCartGroupAction,
  deleteCartGroupSuccess,
  joinCartGroupAction,
  updateCartGroupSelectedSuccess,
  updateRoomTimeOutInputtingSuccess,
  updateWindowSelectedSuccess,
} from "@/redux/modules/cartGroup.ts";
import { RootState } from "@/redux/store.ts";
import { getThumbnail, groupCartByUser } from "@/utils/common.ts";
import { DeleteOutlined } from "@ant-design/icons";
import ClockCircleOutlined from "@ant-design/icons/ClockCircleOutlined";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Input,
  notification,
  Popconfirm,
  Spin,
} from "antd";
import { useDispatch, useSelector } from "react-redux";

const useDispatchProp = () => {
  const dispatch = useDispatch();

  const updateRoomTimeOutInputting = (roomTimeOutInputting: string) =>
    dispatch(
      updateRoomTimeOutInputtingSuccess({ value: roomTimeOutInputting })
    );

  const updateWindowSelected = (window: "HOME" | "CART_GROUP") =>
    dispatch(updateWindowSelectedSuccess({ window }));

  return {
    updateRoomTimeOutInputting,
    updateWindowSelected,
  };
};

export function CartGroupHome({ currentUserId }: { currentUserId: string }) {
  const dispatch = useDispatch();
  const {
    creatingCartGroupLoading,
    joiningCartGroupLoading,
    roomCodeInputting,
    cartGroupsJoined: cartGroupsJoined,
  } = useSelector((state: RootState) => state.cartGroup);

  const { updateRoomTimeOutInputting, updateWindowSelected } =
    useDispatchProp();

  return (
    <div className="flex justify-center">
      <div className="mx-auto max-w-md rounded-xl bg-white px-4 py-10 text-center shadow sm:px-8">
        <header className="mb-8">
          <div className="mb-1 text-2xl font-bold">Tham gia đơn nhóm</div>
          <p className="text-[15px] text-slate-500">
            Nhập mã đơn nhóm gồm 6 chữ số
          </p>
        </header>
        <form id="otp-form">
          <CodeInput />
          <div className="mx-auto mt-4 max-w-[260px]">
            <Button
              loading={joiningCartGroupLoading}
              onClick={() =>
                dispatch(joinCartGroupAction({ roomId: roomCodeInputting }))
              }
              type="primary"
              className="inline-flex w-full justify-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 transition-colors duration-150"
            >
              Tham gia
            </Button>
          </div>
        </form>
        <div className="mt-4 text-sm text-slate-500">
          Bạn chưa có đơn nhóm?{" "}
          <Popconfirm
            title={
              <Input
                className="w-36"
                type="text"
                prefix={<ClockCircleOutlined />}
                suffix={"phút"}
                placeholder="Thời lượng"
                onChange={(e) =>
                  dispatch(updateRoomTimeOutInputting(e.target.value))
                }
              />
            }
            onConfirm={() => {
              dispatch(createCartGroupRequest());
            }}
          >
            <a className="font-medium text-indigo-500 hover:text-indigo-600">
              Tạo đơn nhóm
            </a>
            <Spin spinning={creatingCartGroupLoading} />
          </Popconfirm>
        </div>
        <Divider />
        <div className="text-xl mb-4">Đơn nhóm bạn đang tham gia</div>

        {cartGroupsJoined.map((it, index) => {
          return (
            <Card
              extra={
                it.user.id === currentUserId && (
                  <Popconfirm
                    title="Bạn có muốn xóa đơn nhóm không?"
                    onConfirm={() =>
                      dispatch(deleteCartGroupAction({ roomId: it.roomId }))
                    }
                  >
                    {it.deletingCartGroupLoading ? (
                      <Spin spinning={it.deletingCartGroupLoading} />
                    ) : (
                      <DeleteOutlined />
                    )}
                  </Popconfirm>
                )
              }
              key={index}
              className="cursor-pointer"
              size="small"
              title={
                <AvatarInfo
                  fullName={it.user.username}
                  avatar={it.user.avatar}
                  info={`#${it.roomId}`}
                  padding={"py-1"}
                  isVisibleCapital={currentUserId === it.user.id}
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
              }
              actions={[
                <a
                  type="link"
                  onClick={() => {
                    dispatch(
                      updateCartGroupSelectedSuccess({ roomId: it.roomId })
                    );
                    dispatch(updateWindowSelected("CART_GROUP"));
                  }}
                >
                  Xem chi tiết
                </a>,
              ]}
            >
              <Avatar.Group>
                {groupCartByUser(it.cartItems).map((ci, index) => (
                  <Avatar key={index} src={getThumbnail(ci.user.avatar)} />
                ))}
              </Avatar.Group>
              ...
            </Card>
          );
        })}
      </div>
    </div>
  );
}
