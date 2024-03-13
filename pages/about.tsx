import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {useEffect, useState} from "react";
import {Button, Flex} from "antd";

export interface IPost {
    id: number;
    title: string;
    content: string;
    image: string;
    date: string;
}

const About: NextPage = () => {

    return (
        <div>
            About
            <a href="/">Home</a>
        </div>
    );
}

export default About
