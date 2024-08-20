import type {NextApiRequest, NextApiResponse, NextPage} from 'next'
import {Button, Card, Checkbox, Form, Input, notification, Space} from 'antd';
import React, {useEffect, useState} from "react";
import {deleteCookie, getCookie, setCookie} from "cookies-next";
import {REFRESH_TOKEN, REMEMBER_ME, server} from "../utils/server";
import {NextRouter, useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {AuthRequest} from "../models/auth/AuthRequest";
import {AuthAPIResponse} from "../models/auth/AuthAPIResponse";
import {AxiosError, AxiosResponse} from "axios";
import jwtDecode from "jwt-decode";
import {CurrentUser, setCurrentUser} from "../stores/user.reducer";
import {api} from "../utils/axios-config";
import {clientId, redirectUri, responseType, scopes} from "../utils/oauth2";
import {ErrorAPIResponse} from "../models/ErrorAPIResponse";

export interface IUserRemember {
    username: string;
    password: string;
    avatar: string;
}

export const getServerSideProps = async ({req, res}: { req: NextApiRequest, res: NextApiResponse }) => {
    const refreshToken = getCookie(REFRESH_TOKEN, {req, res});

    if (refreshToken) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

const Login: NextPage = () => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);

    const [isLoadingGoogle, setLoadingGoogle] = useState(false);

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    const [pending, setPending] = useState<boolean>(false);

    useEffect(() => {
        // Kiểm tra nếu cookie REMEMBER_ME tồn tại
        const rememberMeCookie = getCookie(REMEMBER_ME);
        if (rememberMeCookie) {
            // Giải mã thông tin từ cookie REMEMBER_ME
            const userRemember = JSON.parse(atob(rememberMeCookie));
            // Đặt giá trị của username bằng userRemember.username
            setUsername(userRemember.username || '');
            setPassword(userRemember.password || '');
        }
        // Đã cập nhật username, đặt loading thành false
        setIsLoading(false);
    }, []);

    const onFinish = (values: any): void => {
        setPending(true);
        let user: AuthRequest = values.username.includes("@")
            ? {username: null, email: values.username, password: values.password}
            : {username: values.username, email: null, password: values.password}

        api.post("/auth/login", user)
            .then(function (res: AxiosResponse<AuthAPIResponse>): void {
                const payload: CurrentUser = jwtDecode(res.data.refreshToken);

                dispatch(setCurrentUser(payload));

                setCookie(REFRESH_TOKEN, res.data.refreshToken, {
                    maxAge: 60 * 60 * 24 * 30,
                    path: "/"
                });

                deleteCookie(REMEMBER_ME);
                //set user remembered and delete
                if (values.remember) {
                    const userRemember: IUserRemember = {
                        username: user.username ? user.username! : user.email!,
                        password: user.password,
                        avatar: "currentUser.avatar"
                    }
                    setCookie(REMEMBER_ME, btoa(JSON.stringify(userRemember)), {
                        maxAge: 60 * 60 * 24 * 30,
                        path: "/"
                    });
                } else deleteCookie(REMEMBER_ME);

                router.push('/').then(() => {
                    setPending(false);
                });

            })
            .catch(function (res: AxiosError<ErrorAPIResponse>): void {
                notification.open({
                    type: 'error',
                    message: 'Đăng nhập',
                    description: res.message,
                });
                setPending(false);
            })
    };

    function handleGoogleLogin() {
        let h: number = 600
        let w: number = 500
        let left: number = (screen.width / 2) - (w / 2);
        let top: number = (screen.height / 2) - (h / 2);
        setLoadingGoogle(true);
        const googleLoginWindow: Window | null = window.open(
            "https://accounts.google.com/o/oauth2/v2/auth?&client_id=" + clientId
            + "&redirect_uri=" + redirectUri + "&response_type=" + responseType + "&scope=" + scopes.join("+"),
            "Google Login",
            "width=" + w + ",height=" + h + ",top=" + top + ", left=" + left
        );

        const getMessage = (event: MessageEvent<string>) => {
            if (server.startsWith(event.origin)) {
                if (event.data) {
                    setCookie("refreshToken", event.data, {
                        maxAge: 60 * 60 * 24 * 30,
                        path: "/"
                    });
                    router.push("/");
                }
                window.removeEventListener("message", getMessage);
                setLoadingGoogle(false);
            }
        };
        window.addEventListener("message", getMessage);
    }

    return (
        <div className='font-medium bg-[url("/logo-bg.jpeg")] bg-cover bg-center bg-no-repeat h-screen flex justify-center  items-center'>
            <Card className="w-[350px] m-auto" loading={isLoading}>
                <Space direction="vertical" size="small" style={{display: 'flex'}}>
                    <div className="mb-4 flex flex-col gap-2">
                        <div className="flex justify-center font-medium text-xl gap-1">Đăng nhập<span
                            className="text-orange-500 font-['Impact','fantasy'] flex"> <img src="/Logo.png"
                                                                                             className="w-6 h-6"/>FoodPoni</span>
                        </div>
                        <div className="flex justify-center gap-1 font-medium text-gray-500">
                            Cần một tài khoản?
                            <a className='float-right' onClick={() => router.push('/signup')}>Đăng ký ngay</a>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 text-gray-400">
                        <button className="btn btn-light btn-sm justify-center gap-1" onClick={handleGoogleLogin}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                                 fill="none">
                                <path
                                    d="M24 12.27C24 11.48 23.9284 10.73 23.8058 9.99998H12.2605V14.51H18.871C18.5747 15.99 17.7062 17.24 16.4189 18.09V21.09H20.3627C22.6717 19 24 15.92 24 12.27Z"
                                    fill="#4285F4"/>
                                <path
                                    d="M12.2606 24C15.571 24 18.3398 22.92 20.3628 21.09L16.419 18.09C15.3156 18.81 13.9158 19.25 12.2606 19.25C9.06269 19.25 6.35515 17.14 5.38453 14.29H1.31812V17.38C3.33089 21.3 7.46882 24 12.2606 24Z"
                                    fill="#34A853"/>
                                <path
                                    d="M5.38442 14.2901C5.12899 13.5701 4.99617 12.8001 4.99617 12.0001C4.99617 11.2001 5.13921 10.4301 5.38442 9.71009V6.62009H1.31801C0.480203 8.24009 0 10.0601 0 12.0001C0 13.9401 0.480203 15.7601 1.31801 17.3801L5.38442 14.2901Z"
                                    fill="#FBBC05"/>
                                <path
                                    d="M12.2606 4.74998C14.0691 4.74998 15.6834 5.35999 16.9605 6.54999L20.4548 3.12999C18.3398 1.18999 15.571 -1.52588e-05 12.2606 -1.52588e-05C7.46882 -1.52588e-05 3.33089 2.69999 1.31812 6.61999L5.38453 9.70999C6.35515 6.85999 9.06269 4.74998 12.2606 4.74998Z"
                                    fill="#EA4335"/>
                            </svg>
                            <span className="text-[#4b5675]">Google</span>
                        </button>
                        <a className="btn btn-light btn-sm justify-center" href="#">
                            <img alt="" src="/Facebook.png" className="w-5 h-5"/>
                            <span className="text-[#4b5675]">Facebook</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="border-t border-gray-200 w-full">
                      </span>
                        <span className="text-sm font-medium text-gray-400 uppercase">Hoặc</span>
                        <span className="border-t border-gray-200 w-full"></span>
                    </div>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                    >
                        <div className="flex flex-col gap-1 font-medium">Email hoặc username</div>
                        <Form.Item
                            name="username"
                            rules={[{required: true, message: 'Vui lòng nhập username hoặc email của bạn!'}]}
                            initialValue={username}
                        >
                            <Input className="!py-2 font-medium" placeholder="Email hoặc username"/>
                        </Form.Item>
                        <div className="flex font-medium  justify-between">Mật khẩu
                            <a className="login-form-forgot" href="">
                                Quên mật khẩu?
                            </a></div>
                        <Form.Item
                            name="password"
                            rules={[{required: true, message: 'Vui lòng nhập mật khẩu của bạn!'}]}
                            initialValue={password}
                        >
                            <Input.Password className="!py-2 font-medium" placeholder="Mật khẩu"/>
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Lưu thông tin đăng nhập</Checkbox>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="!py-5" loading={pending}
                                    disabled={pending || isLoadingGoogle}
                                    block>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </Space>
            </Card>
        </div>
    );
};

export default Login;
