import type {NextApiRequest, NextApiResponse, NextPage} from 'next'
import {Avatar, Button, Card, Checkbox, Form, Input, notification, Space} from 'antd';
import {GithubOutlined, GoogleOutlined, LockOutlined, UserOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {deleteCookie, getCookie, setCookie} from "cookies-next";
import {REFRESH_TOKEN, REMEMBER_ME, server} from "../utils/server";
import {NextRouter, useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {AuthRequest} from "../models/auth/AuthRequest";
import {AuthAPIResponse} from "../models/auth/AuthAPIResponse";
import {AxiosError, AxiosResponse} from "axios";
import jwtDecode from "jwt-decode";
import {CurrentUser, setCurrentUser} from "../stores/user.reducer";
import {ErrorApiResponse} from "../models/ErrorApiResponse";
import {api} from "../utils/axios-config";
import {clientId, redirectUri, responseType, scopes} from "../utils/oauth2";

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
    },[]);

    const onFinish = (values: any): void => {
        setPending(true);
        let user: AuthRequest = values.username.includes("@")
            ? {username: null, email: values.username, password: values.password}
            : {username: values.username, email: null, password: values.password}

        api.post("/auth/login", user)
            .then(function (res: AxiosResponse<AuthAPIResponse>): void {
                const refreshToken: string = res.data.refreshToken ?? "";

                const payload: CurrentUser = jwtDecode(refreshToken);
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
            .catch(function (res: AxiosError<ErrorApiResponse>): void {
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
        <div className='bg-[url("/login-bg.png")] bg-cover bg-center bg-no-repeat h-screen'>
            <Card className="w-[500px] m-auto" loading={isLoading}>
                <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                    <div>
                        <Avatar size={64} icon={<UserOutlined/>}/>
                        <h2>Chào mừng trở lại!...</h2>
                        <span>Đăng nhập tài khoản của bạn để tiếp tục</span>
                    </div>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{required: true, message: 'Please input your Username or Email!'}]}
                            initialValue={username}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{required: true, message: 'Please input your Password!'}]}
                            initialValue={password}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Lưu thông tin đăng nhập</Checkbox>
                            </Form.Item>

                            <a className="login-form-forgot" href="">
                                Quên mật khẩu
                            </a>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" loading={pending} disabled={pending || isLoadingGoogle}
                                    block>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                    <div>
                        <div style={{float: 'left'}}>
                            <Space>
                                Đăng nhập bằng
                                <GithubOutlined/>
                                <GoogleOutlined onClick={() => handleGoogleLogin()} disabled={isLoadingGoogle} />
                            </Space>
                        </div>
                        <a className='float-right' onClick={() => router.push('/signup')}>Đăng ký ngay</a>
                    </div>
                </Space>
            </Card>
        </div>

    );

};

export default Login;
