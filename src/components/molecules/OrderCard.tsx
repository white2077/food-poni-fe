import { Order } from "@/type/types";
import { currencyFormat } from "@/utils/common.ts";
import {
  EnvironmentOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Card, Skeleton } from "antd";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const statusText: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  APPROVED: "Chờ lấy hàng",
  CANCELLED: "Đã hủy",
  REJECTED: "Bị từ chối",
  COMPLETED: "Hoàn thành",
  POST_PAID: "Ghi nợ",
};

const statusColors: Record<string, string> = {
  PENDING: "orange",
  APPROVED: "blue",
  CANCELLED: "red",
  REJECTED: "red",
  COMPLETED: "green",
  POST_PAID: "gray",
};

const OrderCard = ({
  order,
  index,
  isFetchLoading,
  orderGroup,
}: {
  order: Order;
  index: number;
  isFetchLoading: boolean;
  orderGroup: boolean;
}) => {
  return (
    <div>
      <Link
        to={
          order.status === "POST_PAID"
            ? `/ghi-no/${order.id}`
            : orderGroup
              ? `/don-hang-nhom/${order.id}`
              : `/don-hang/${order.id}`
        }
      >
        <Badge.Ribbon
          text={
            !isFetchLoading ? (
              statusText[order.status]
            ) : (
              <Skeleton.Button active size="small" className="!w-28" />
            )
          }
          color={!isFetchLoading ? statusColors[order.status] : "#f0f0f0"}
          className={`font-sans ${!isFetchLoading ? "" : "!p-0"}`}
        >
          <Card
            className="font-sans min-h-60 !border-orange-200"
            hoverable={true}
            loading={isFetchLoading}
            title={
              !isFetchLoading ? (
                <div className="flex gap-2 items-center">
                  <span>{`${index}. Đơn hàng #${order.id?.substring(0, 7).toUpperCase()} `}</span>
                  <span className="text-primary font-bold">/</span>
                  <span>
                    {format(
                      new Date(order.createdDate ?? ""),
                      "dd-MM-yyyy - HH:mm"
                    )}
                  </span>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <Skeleton.Button active size="small" className="!w-32" />
                  <span className="text-primary font-bold">/</span>
                  <Skeleton.Button active size="small" className="!w-32" />
                  <span className="text-primary font-bold">/</span>
                </div>
              )
            }
          >
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Thông tin đơn hàng:
            </h2>
            <ul className="max-w-md space-y-1 text-gray-500 list-inside">
              <li>
                <UserOutlined /> Khách hàng: {order.shippingAddress.fullName}
              </li>
              <li>
                <EnvironmentOutlined /> Địa chỉ: {order.shippingAddress.address}
              </li>
              <li>
                <ShoppingOutlined /> Số lượng: {order.orderItems.length} Sản
                phẩm
              </li>
            </ul>
            {/*{order.orderItems.map((item) => (*/}
            {/*    <Col span={24} key={item.id}>*/}
            {/*      <div className="overflow-hidden rounded-lg p-2 hover:bg-gray-100 hover:border-orange-300 border-2 font-sans">*/}
            {/*        <Row gutter={[16, 16]}>*/}
            {/*          <Col*/}
            {/*              span={5}*/}
            {/*              className="flex justify-center items-center"*/}
            {/*          >*/}
            {/*            <div>*/}
            {/*              <div className="!relative flex">*/}
            {/*                <Image*/}
            {/*                    height="100px"*/}
            {/*                    preview={false}*/}
            {/*                    src={*/}
            {/*                      item?.productDetail?.product?.thumbnail*/}
            {/*                          ? server +*/}
            {/*                          item.productDetail.product.thumbnail*/}
            {/*                          : ""*/}
            {/*                    }*/}
            {/*                    className="object-cover rounded-lg border-2 border-orange-300"*/}
            {/*                />*/}
            {/*                <p className="absolute text-xs border-orange-300 border-2 bottom-0 right-0 text-orange-600 bg-gray-100 nunito px-1 rounded-br-lg rounded-tl-lg">*/}
            {/*                  X{item.quantity}*/}
            {/*                </p>*/}
            {/*              </div>*/}
            {/*            </div>*/}
            {/*          </Col>*/}
            {/*          <Col span={19} className="justify-between">*/}
            {/*            <div className="flex justify-between  nunito">*/}
            {/*              <div>*/}
            {/*                <div className="text-orange-600 text-base">*/}
            {/*                  {item.productDetail?.product?.name}*/}
            {/*                  {item.productDetail?.name*/}
            {/*                      ? ` - ${item.productDetail?.name}`*/}
            {/*                      : ""}*/}
            {/*                </div>*/}
            {/*                {item.type && (*/}
            {/*                    <div className="text-[10px]">*/}
            {/*                      Loại:{" "}*/}
            {/*                      <span className="bg-primary text-white rounded-lg mr-1 px-1">*/}
            {/*                    {item.type}*/}
            {/*                  </span>*/}
            {/*                    </div>*/}
            {/*                )}*/}
            {/*                {item.toppings && item.toppings.length > 0 && (*/}
            {/*                    <div className="text-[10px]">*/}
            {/*                      <div>Topping:</div>*/}
            {/*                      {item.toppings.map((tp, index) => {*/}
            {/*                        return (*/}
            {/*                            <div*/}
            {/*                                key={index}*/}
            {/*                                className="inline-block bg-primary text-white rounded-lg mr-1 px-1 mb-1"*/}
            {/*                            >{`${tp.name}: ${tp.price}₫`}</div>*/}
            {/*                        );*/}
            {/*                      })}*/}
            {/*                    </div>*/}
            {/*                )}*/}
            {/*              </div>*/}
            {/*              <div>{currencyFormat(item.price)}</div>*/}
            {/*            </div>*/}
            {/*            <div className="flex gap-2 font-sans"></div>*/}
            {/*            {order.status === "COMPLETED" &&*/}
            {/*            Object.keys(item.rate ?? {}).length === 0 ? (*/}
            {/*                <div className="flex gap-2 font-sans">*/}
            {/*                  <FormOutlined />*/}
            {/*                  <Text*/}
            {/*                      type="success"*/}
            {/*                      className="text-green-400 font-sans"*/}
            {/*                  >*/}
            {/*                    Đánh giá ngay để nhận ưu đãi*/}
            {/*                  </Text>*/}
            {/*                </div>*/}
            {/*            ) : (*/}
            {/*                Object.keys(item.rate ?? {}).length !== 0 && (*/}
            {/*                    <div className="flex gap-2 items-center">*/}
            {/*                      <FormOutlined />*/}
            {/*                      <div className="text-red-500 font-sans">*/}
            {/*                        Bạn đã đánh giá*/}
            {/*                      </div>*/}
            {/*                    </div>*/}
            {/*                )*/}
            {/*            )}*/}
            {/*          </Col>*/}
            {/*        </Row>*/}
            {/*      </div>*/}
            {/*    </Col>*/}
            {/*))}*/}

            <div className="flex justify-between">
              <div className="flex justify-end mt-4 text-xl gap-2 font-sans">
                <div className="text-gray-400">Tổng tiền:</div>
                <div className="nunito text-green-600">
                  {currencyFormat(order.totalAmount)}
                </div>
              </div>
            </div>
          </Card>
        </Badge.Ribbon>
      </Link>
    </div>
  );
};

export default OrderCard;
