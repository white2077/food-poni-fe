import {Action} from "redux";
import MenuFilter from "@/components/menuFilter.tsx";
import {ProductRows} from "@/components/organisms/productRows.tsx";

interface ProductFilterRowProps {
    action: Action;
}

export function ProductRowsFilter({action}: ProductFilterRowProps) {
    return (
        <ProductRows action={action} hasBorder={true}>
            <MenuFilter/>
        </ProductRows>
    );
}