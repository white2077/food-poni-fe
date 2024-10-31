import { Action } from "redux";
import { ProductRows } from "@/components/organisms/ProductRows";
import MenuFilter from "../molecules/MenuFilter";

interface ProductFilterRowProps {
  action: Action;
}

export function ProductRowsFilter({ action }: ProductFilterRowProps) {
  return (
    <ProductRows action={action} hasBorder={true}>
      <MenuFilter />
    </ProductRows>
  );
}
