import {Card, Radio, RadioChangeEvent, Space} from "antd";
import {updatePaymentSuccess} from "@/redux/modules/order.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/redux/store.ts";

export default function PaymentInfo() {

    const dispatch = useDispatch();

    const {form} = useSelector((state: RootState) => state.order);

    return (
        <Card className="mb-[16px]">
            <div>
                Thông tin thanh toán
            </div>
            <Radio.Group
                onChange={(e: RadioChangeEvent): void => {
                    dispatch(updatePaymentSuccess(e.target.value));
                }}
                defaultValue={form.payment.method}>
                <Space direction="vertical">
                    <Radio value="CASH">
                        <div className="flex items-center"><img src="/tien-mat.png"
                                                                className="w-9 h-9 mr-2"/><p>Thanh toán
                            tiền mặt</p></div>
                    </Radio>
                    <Radio value="VNPAY">
                        <div className="flex items-center"><img src="/VNP.png"
                                                                className="w-9 h-9 mr-2"/>
                            <div>
                                <p>VNPAY</p>
                                <div className="text-gray-400">Quét Mã QR từ ứng dụng ngân hàng</div>
                            </div>
                        </div>
                    </Radio>
                </Space>
            </Radio.Group>
        </Card>
    );

}