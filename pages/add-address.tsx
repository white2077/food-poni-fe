import {IPaymentInfo} from "../store/order.reducer";
import {DefaultLayout} from "../components/layout";
import AddressAdd from "../components/address-add";

const isPayment: IPaymentInfo = {

    method: "CASH",

    status: "PAYING"
}

const isPending: boolean = false;

const AddAddress = () => {
    return (
        <DefaultLayout>
            <AddressAdd></AddressAdd>
        </DefaultLayout>
    )
}

export default AddAddress