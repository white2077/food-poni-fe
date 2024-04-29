import {UserResponseDTO} from "../user/UserResponseAPI";
import {OrderItemResponseDTO} from "../order_item/OrderItemResponseAPI";

export interface FileUploadsResponseDTO {

    id: string;

    name: string;

    extension: string;

    contentType: string;

    size: number;

    url: string;

}