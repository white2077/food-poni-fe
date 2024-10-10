import { Navigate, Route, Routes } from "react-router-dom";
import ProductCategoryWrapper from "@/components/templates/productCategoryWrapper.tsx";
import { ReactNode } from "react";
import ProductCategory from "@/components/molecules/productCategory.tsx";
import { server } from "@/utils/server.ts";
import SidebarLayout from "@/components/sidebarLayout.tsx";

const sidebarContents: ReactNode[] = [
  <ProductCategory />,
  <img
    key={1}
    className="rounded-md w-full"
    src={server + "/upload/vertical-banner.png"}
    alt={""}
  />,
];

export default function productCategoryPage() {
  return (
    <Routes>
      <Route element={<SidebarLayout sidebarContents={sidebarContents} />}>
        <Route path=":pathVariable" element={<ProductCategoryWrapper />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
