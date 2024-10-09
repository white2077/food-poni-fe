import {Button, Card, Collapse, List, Modal, Radio} from "antd";
import {useEffect, useState} from "react";
import ShippingAddressInfo from "@/components/organisms/shippingAddressInfo.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/redux/store.ts";
import {fetchAddressesRequest} from "@/redux/modules/address.ts";
import CardHome from "@/components/atoms/cardHome.tsx";
import {updateShippingAddressAction} from "@/redux/modules/order.ts";

export default function ShippingAddress() {

    const dispatch = useDispatch();

    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const [showAddAddress, setShowAddAddress] = useState<boolean>(false);

    const {page} = useSelector((state: RootState) => state.address);

    const {currentUser} = useSelector((state: RootState) => state.auth);

    const {form} = useSelector((state: RootState) => state.order);

    useEffect(() => {
        dispatch(fetchAddressesRequest());
        if (currentUser) {
            dispatch(updateShippingAddressAction(currentUser.addressId));
        }
    }, [dispatch]);

    return (
        <Card style={{marginBottom: "16px"}}>
            <div>
                <div className="flex justify-between items-center">
                    <div className="text-[17px] text-gray-400">Giao tới</div>
                    <Button id="button-change-address" type="link"
                            onClick={() => {
                                setModalOpen(true);
                            }}>Thay đổi</Button>
                </div>
                <Modal
                    title="Địa chỉ của bạn"
                    centered
                    open={modalOpen}
                    onOk={() => setModalOpen(false)}
                    onCancel={() => setModalOpen(false)}
                    footer={null}
                >
                    <Button
                        onClick={() => setShowAddAddress(!showAddAddress)}>{showAddAddress ? "Quay lại" : "Thêm địa chỉ"}</Button>
                    {showAddAddress && <ShippingAddressInfo/>}
                    {!showAddAddress && (
                        <Radio.Group className="w-full"
                                     defaultValue={currentUser?.addressId}
                                     onChange={(e) => dispatch(updateShippingAddressAction(e.target.value))}>
                            <List
                                dataSource={page.content}
                                renderItem={(item) => (
                                    <Collapse
                                        className="my-[16px]"
                                        expandIconPosition={"end"}
                                        collapsible={"icon"}
                                        items={[{
                                            key: item.id,
                                            label: <Radio id={`radio-${item.id}`} value={item.id}>
                                                <div><span
                                                    style={{fontWeight: 'bold'}}>{item.fullName}</span> | {item.phoneNumber}
                                                </div>
                                                <div>{item.address}</div>
                                            </Radio>,
                                            // children: <AddressCheckoutUpdate address={item} />
                                        }]}
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
                        <div><span
                            style={{fontWeight: 'bold'}}>{form.shippingAddress.fullName}</span> | {form.shippingAddress.phoneNumber}
                        </div>
                        <div><CardHome content="Nhà"/>{form.shippingAddress.address}</div>
                    </>)
                }
                {/*{!shippingAddress && (*/}
                {/*    <div style={{color: 'red'}}>Vui lòng chọn thông tin vận chuyển</div>*/}
                {/*)}*/}
            </div>
        </Card>
    )
}