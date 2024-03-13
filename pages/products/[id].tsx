import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {useEffect, useState} from "react";
import {Button, Flex} from "antd";
import {useRouter} from "next/router";

const ProductDetail: NextPage = () => {
    const router = useRouter();
    const {id} = router.query;

    return (
        <div>
            Detail {id}
        </div>
    );
}

export default ProductDetail
