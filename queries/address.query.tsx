import axiosConfig from "../utils/axios-config";
import {useQuery} from "react-query";
import {AxiosResponse} from "axios";
import {AddressResponseDTO} from "../models/address/AddressResponseAPI";
import {setCurrentShippingAddress} from "../stores/address.reducer";
// import {useDispatch, useSelector} from "react-redux";
// import {RootState} from "../stores";
// import {CurrentUser} from "../stores/user.reducer";
//
// const dispatch = useDispatch();
//
// const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);
//
// export interface DataQuery<T> {
//     data: T,
//     isPending: boolean,
//     isError: boolean
// }

// export const getAddressById = (addressId: string): DataQuery<AddressResponseDTO> => {
//     const res = useQuery({
//         queryKey: ["getAddressById"],
//         queryFn: () => axiosConfig.get(`/addresses/${addressId}`, {
//             headers: {
//                 Authorization: 'Bearer ' + currentUser.accessToken,
//             }
//         })
//             .then(function (res: AxiosResponse<AddressResponseDTO>): void {
//                 dispatch(setCurrentShippingAddress(res.data));
//             })
//             .catch(function (res): void {
//                 console.log("Shipping address message: ", res.message);
//             })
//     })
// }