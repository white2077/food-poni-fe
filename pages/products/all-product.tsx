import {Badge, Card, Divider, Flex, List, Radio} from 'antd';
import type {NextPage} from 'next'
import React, {useEffect, useState} from 'react'
import {StarFilled, StarOutlined} from "@ant-design/icons";
import {Product} from "../../model/Product";

export interface IProduct {
    id: string;
    name: string;
    thumbnail: string | null;
    status: boolean;
    minPrice: number;
    maxPrice: number;
}

const Products: NextPage = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [value, setValue] = React.useState<string>('horizontal');

    useEffect(() => {
        getAll();
    }, []);

    const getAll = (): void => {
        fetch('http://localhost:8080/api/v1/products')
            .then(
                response => response.json())
            .then(response => {
                console.log("lay du lieu thanh cong");
                setProducts((response.content as Product[]).map((product): IProduct => {
                    return {
                        id: product.id,
                        name: product.name,
                        thumbnail: product.thumbnail,
                        status: product.status,
                        minPrice: Math.min(...product.productDetails.map((productDetail) => productDetail.price)),
                        maxPrice: Math.max(...product.productDetails.map((productDetail) => productDetail.price))
                    }
                }));
            })
            .catch(response => console.log(response))
    }

    console.log(products);

    return (
        <List grid={{gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 4}}
              dataSource={products}
              renderItem={(product) => (
                  <List.Item>
                      <Card
                          hoverable
                          style={{width: 240}}
                          cover={<img alt="example"
                                      src="https://png.pngtree.com/png-clipart/20221001/ourmid/pngtree-fast-food-big-ham-burger-png-image_6244235.png"/>}
                      >
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                              <Badge count="Khoảng 2km"
                                     color='#F5F5FA'
                                     style={{ color: 'black', marginRight: '8px' }} />
                          </div>
                          <div style={{
                              textAlign: 'left',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontSize: '16px',
                              marginBottom: '5px'
                          }}>
                              {product.name}
                          </div>
                          <Flex gap="middle" vertical style={{marginBottom: '5px'}}>
                              <Flex vertical={value === 'vertical'}>
                                  {Array.from({length: 5}).map((_, i) => (
                                      <div key={i}
                                           style={{backgroundColor: "white"}}>
                                          <StarFilled style={{color: '#FEC32D'}}/>
                                      </div>
                                  ))}
                              </Flex>
                          </Flex>
                          <div style={{textAlign: 'left', fontSize: '20px', fontWeight: 'bold'}}>${product.minPrice} -
                              ${product.maxPrice}</div>
                          <Divider/>
                          <div style={{fontSize: '14px'}}>Dự kiến giao lúc 22:30</div>
                      </Card>
                  </List.Item>
              )}
        />
    );
}

const {Meta} = Card;

export default Products