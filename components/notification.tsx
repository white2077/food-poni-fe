import React, {useEffect} from "react";
import {Avatar, Badge, Dropdown, MenuProps} from 'antd';
import {BellOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import {CurrentUser} from "../stores/user.reducer";
import SockJS from 'sockjs-client';
import {Client} from "@stomp/stompjs";

const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                1st menu item
            </a>
        ),
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                2nd menu item
            </a>
        ),
    },
    {
        key: '3',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                3rd menu item
            </a>
        ),
    },
];

let sock: any = null;

const Notification = () => {

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    useEffect(() => {
        if (!sock) {
            console.log("Connect to socket successfully...");
            sock = new SockJS("http://localhost:8080" + "/notification-register?client-id=" + currentUser.id);

            const client = new Client({
                webSocketFactory: () => sock,
                onConnect: () => {
                    client.subscribe('/topic/global-notifications', (message: any) => {
                        console.log('Received message:', JSON.parse(message.body));
                    });
                    client.subscribe('/user/topic/client-notifications', (message: any) => {
                        console.log('Received message:', JSON.parse(message.body));
                    });
                },
                onStompError: (frame) => {
                    console.log("Error connecting to Websocket server", frame)
                }
            });
            client.activate();
        }
    }, []);

    return (
        <>
            <Dropdown menu={{ items }} placement="bottomRight">
                <Badge count={0}>
                    <Avatar shape="square" icon={<BellOutlined />} size='large'/>
                </Badge>
            </Dropdown>
        </>
    );

};

export default Notification;