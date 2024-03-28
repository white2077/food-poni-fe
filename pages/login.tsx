import type {NextPage} from 'next'
import {Avatar, Button, Card, Checkbox, Form, Input, notification, Space} from 'antd';
import {DefaultLayout} from "../components/layout";
import {GithubOutlined, GoogleOutlined, LockOutlined, UserOutlined} from "@ant-design/icons";
import {useState} from "react";
import axiosConfig from "../utils/axios-config";
import {CurrentUser, IUserRemember, UserRequestLogin} from "../model/User";
import {IToken} from "../model/Auth";
import {jwtDecode} from "jwt-decode";
import {deleteCookie, setCookie} from "cookies-next";
import {REFRESH_TOKEN, REMEMBER_ME} from "../utils/server";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {setCurrentUser} from "../store/user.reducer";

const isPending: boolean = false;

const Login: NextPage = () => {

    const [pending, setPending] = useState<boolean>(isPending);

    const router = useRouter();

    const dispatch = useDispatch();

    const onFinish = (values: any) => {
        setPending(true);
        let user: UserRequestLogin = values.username.includes("@")
            ? {username: null, email: values.username, password: values.password}
            : {username: values.username, email: null, password: values.password}

        axiosConfig.post("/auth/login", user)
            .then(function (res: any) {
                setPending(false);

                const {accessToken, refreshToken} = res.data as IToken;
                const payload = jwtDecode(accessToken) as CurrentUser;
                payload.accessToken = accessToken;
                dispatch(setCurrentUser(payload));

                // set refresh token
                setCookie(REFRESH_TOKEN, refreshToken, {
                    expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
                });

                //set user remembered and delete
                if (values.remember) {
                    const userRemember: IUserRemember = {
                        username: user.username ? user.username! : user.email!,
                        password: user.password,
                        avatar: "currentUser.avatar"
                    }
                    setCookie(REMEMBER_ME, btoa(JSON.stringify(userRemember)), {
                        expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
                    });
                } else deleteCookie(REMEMBER_ME);

                // redirect to home page
                notification.open({
                    message: 'Login message',
                    description: 'Login successfully!',
                });
                router.push('/');
            })
            .catch(function (res) {
                setPending(false);
                notification.open({
                    message: 'Login message',
                    description: res.message,
                });
            })
    };

    return (
        <DefaultLayout>
            <Card style={{width: "500px", margin: "auto"}}>
                <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                    <div>
                        <Avatar size={64} icon={<UserOutlined/>}/>
                        <h2>Welcome back!...</h2>
                        <span>Sign in to your account to continue</span>
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
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{required: true, message: 'Please input your Password!'}]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <a className="login-form-forgot" href="">
                                Forgot password
                            </a>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" loading={pending}
                                    block>
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                    <div>
                        <div style={{float: 'left'}}>
                            <Space>
                                Other login method
                                <GithubOutlined/>
                                <GoogleOutlined/>
                            </Space>
                        </div>
                        <a style={{float: 'right'}} href="">Register now</a>
                    </div>
                </Space>
            </Card>
        </DefaultLayout>
    );
}

export default Login
