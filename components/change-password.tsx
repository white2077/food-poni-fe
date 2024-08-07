import {useState} from 'react';
import {AutoComplete, Button, Form, Input, notification} from 'antd';
import axios, {AxiosError, AxiosResponse} from "axios";
import {AddressRequestDTO} from "../models/address/AddressRequest";
import {SearchResult} from "../stores/search-position.reducer";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {AddressAPIResponse} from "../models/address/AddressAPIResponse";
import {ErrorApiResponse} from "../models/ErrorApiResponse";
import {NextRouter, useRouter} from "next/router";
import {getCookie} from "cookies-next";
import {REFRESH_TOKEN} from "../utils/server";
import {ChangePasswordRequestDTO} from "../models/user/UserRequest";

const ChangePassword = () => {

    const router: NextRouter = useRouter();

    const refreshToken = getCookie(REFRESH_TOKEN);

    const [pending, setPending] = useState<boolean>(false);

    const onFinish = (values: any): void => {
        setPending(true);

        const changePasswordRequestDTO: ChangePasswordRequestDTO = {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword
        };

        if (refreshToken) {
            apiWithToken(refreshToken).patch("/users/change-password", changePasswordRequestDTO, {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                }
            })
                .then(function () {
                    setPending(false);
                    router.push('/account-information');
                    notification.open({
                        type: 'success',
                        message: 'Đổi mật khẩu',
                        description: "Đổi mật khẩu thành công!",
                    });
                })
                .catch(function (res: AxiosError<ErrorApiResponse>) {
                    setPending(false);
                    notification.open({
                        type: 'error',
                        message: 'Đổi mật khẩu',
                        description: res.message,
                    });
                });
        }
    };

    return (
       <div className="w-full bg-white flex justify-center rounded-lg">
           <Form

               name="normal_change-password"
               className="change-password-form my-[16px] p-2 w-[50%] border-[1px] rounded-lg"
               onFinish={onFinish}
           >
               <div>Mật khẩu hiện tại</div>
               <Form.Item
                   name="oldPassword"
                   rules={[
                       {
                           required: true,
                           message: 'Vui lòng nhập mật khẩu hiện tại của bạn!',
                       }
                   ]}
                   hasFeedback
               >
                   <Input.Password/>
               </Form.Item>

               <div>Mật khẩu mới</div>
               <Form.Item
                   name="newPassword"
                   rules={[
                       {
                           required: true,
                           message: 'Vui lòng nhập mật khẩu mới!',
                       },
                   ]}
                   hasFeedback
               >
                   <Input.Password/>
               </Form.Item>

               <div>Nhập lại mật khẩu mới</div>
               <Form.Item
                   name="confirm"
                   dependencies={['newPassword']}
                   hasFeedback
                   rules={[
                       {
                           required: true,
                           message: 'Vui lòng nhập lại mật khẩu mới!',
                       },
                       ({getFieldValue}) => ({
                           validator(_, value) {
                               if (!value || getFieldValue('newPassword') === value) {
                                   return Promise.resolve();
                               }
                               return Promise.reject(new Error('Mật khẩu chưa trùng khớp!'));
                           },
                       }),
                   ]}
               >
                   <Input.Password/>
               </Form.Item>
               <Form.Item>
                   <Button type="primary" htmlType="submit" className="add-address-form-button" loading={pending}
                           disabled={pending} block>
                       Lưu thay đổi
                   </Button>
               </Form.Item>
           </Form>
       </div>
    );

};

export default ChangePassword;