import {CrownOutlined, DollarOutlined, EnvironmentOutlined, StarOutlined, TagOutlined} from '@ant-design/icons';
import {Menu} from 'antd';
import {useDispatch} from "react-redux";
import {fetchProductsByCustomerRequest} from "@/redux/modules/product.ts";

export default function MenuFilter() {

    const dispatch = useDispatch();

    return (
        <Menu className="block rounded-lg"
              onSelect={({key}: { key: string }) => {
                  let sortOption = "";
                  switch (key) {
                      case "bestnews":
                          sortOption = "updatedDate,desc";
                          break;
                      case "bestsellers":
                          sortOption = "sales,desc";
                          break;
                      case "toprates":
                          sortOption = "rate,desc";
                          break;
                      default:
                          return;
                  }
                  dispatch(fetchProductsByCustomerRequest(sortOption));
              }}
              defaultSelectedKeys={["bestsellers"]}
              mode='horizontal'
              items={[
                  {
                      label: 'Bán chạy nhất',
                      key: 'bestsellers',
                      icon: <CrownOutlined/>,
                  },
                  {
                      label: 'Gần bạn',
                      key: 'nearby',
                      icon: <EnvironmentOutlined/>,
                  },
                  {
                      label: 'Khuyến mãi',
                      key: 'promotion',
                      icon: <DollarOutlined/>,
                  },
                  {
                      label: 'Mới nhất',
                      key: 'bestnews',
                      icon: <TagOutlined/>,
                  },
                  {
                      label: 'Đánh giá hàng đầu',
                      key: 'toprates',
                      icon: <StarOutlined/>,
                  }
              ]}/>
    );
}
