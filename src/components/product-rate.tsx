import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { Col, Divider, Image, notification, Rate, Row } from "antd";
import { setShowModalRate } from "../stores/rate.reducer";
import { Page } from "../models/Page";
import { api } from "../utils/axiosConfig.ts";
import { RateAPIResponse } from "../models/rate/RateAPIResponse";

const ProductRate = ({ productId }: { productId: string }) => {
  const dispatch = useDispatch();

  const [rates, setRates] = useState<RateAPIResponse[]>([]);

  const getRates = () => {
    api
      .get("/products/rate/" + productId)
      .then(function (res: AxiosResponse<Page<RateAPIResponse[]>>) {
        console.log(res.data.content);
        setRates(res.data.content);
      })
      .catch(function (res) {
        notification.open({
          type: "error",
          message: "Đánh giá",
          description: res.message,
        });
      });
  };

  useEffect(() => {
    getRates();
  }, []);

  const handleModalClose = () => {
    dispatch(setShowModalRate(false));
  };

  return (
    <Row className="py-[20px] px-[30px] w-full">
      {rates &&
        rates.map((rate, index) => (
          <div key={index} style={{ width: "100%" }}>
            <Row gutter={[16, 16]} align="top">
              <Col span={1}>
                <Image
                  src={rate.avatar}
                  className="w-[40px] h-[40px] rounded-full object-cover"
                />
              </Col>
              <Col span={23}>
                <Row>
                  <span>{rate.username}</span>
                </Row>
                <Row>
                  <Rate disabled defaultValue={rate.rate} />
                </Row>
                <Row className="py-[15px]">
                  <span>{rate.message}</span>
                </Row>
                <Row>
                  {rate.images && rate.images.length > 0 && (
                    <Row gutter={[16, 16]}>
                      {rate.images.map((url, imageIndex) => (
                        <Col key={imageIndex}>
                          <Image
                            src={url}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        </Col>
                      ))}
                    </Row>
                  )}
                </Row>
              </Col>
            </Row>
            <Divider />
          </div>
        ))}
    </Row>
  );
};

export default ProductRate;
