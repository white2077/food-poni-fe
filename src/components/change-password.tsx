import {useState} from 'react';
import {Button, Form, Input, notification} from 'antd';
import {AxiosError} from "axios";
import {accessToken, apiWithToken} from "../utils/axiosConfig.ts";
import {NextRouter, useRouter} from "next/router";
import {getCookie} from "cookies-next";
import {REFRESH_TOKEN} from "../utils/server";
import {ChangePasswordRequestDTO} from "../models/user/UserRequest";
import {ErrorAPIResponse} from "../models/ErrorAPIResponse";

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
                    router.push('/account-information').then(() => {
                        setPending(false);
                    });
                    notification.open({
                        type: 'success',
                        message: 'Đổi mật khẩu',
                        description: "Đổi mật khẩu thành công!",
                    });
                })
                .catch(function (res: AxiosError<ErrorAPIResponse>) {
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
        <div className="bg-white rounded-lg flex items-center justify-center mx-32">
            <Form
                name="normal_change-password"
                className="change-password-form my-1 p-2 border-[1px] rounded-lg w-72"
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