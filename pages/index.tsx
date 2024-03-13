import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useEffect, useState} from "react";
import {Button, Flex} from "antd";

export interface IPost {
    id: number;
    title: string;
    content: string;
    image: string;
    date: string;
}

const Home: NextPage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getAll();
    }, []);

    const getAll = () => {
        console.log("123");
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(
                response => response.json())
            .then(response => {
                console.log("lay du lieu thanh cong");
                setPosts(response);
            })
            .catch(response => console.log(response))
    }

    return (
        <div className={styles.container}>
            {posts && posts.map((post: any) => {
                return (
                    <div className={styles.post} key={post.id}>
                        <Head>
                            <title>{post.title}</title>
                            <link rel="icon" href="/favicon.ico" />
                        </Head>
                        <h1 className={styles.title}>{post.title}</h1>
                    </div>
                );
            })}
            <Flex gap="small" wrap="wrap">
                <Button type="primary">Primary Button</Button>
                <Button>Default Button</Button>
                <Button type="dashed">Dashed Button</Button>
                <Button type="text">Text Button</Button>
                <Button type="link">Link Button</Button>
            </Flex>
        </div>
    );
}

export default Home
