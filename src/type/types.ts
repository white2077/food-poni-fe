export interface Address {
    readonly id: string;
    readonly fullName: string;
    readonly phoneNumber: string;
    readonly address: string;
    readonly lon: number;
    readonly lat: number;
}

export type AuthResponse = {
    readonly accessToken: string | null;
    readonly refreshToken: string;
}

export type AuthRequest = {
    readonly username: string | null;
    readonly email?: string | null;
    readonly password: string;
}

export type Cart = {
    readonly id: string;
    readonly user: User;
    readonly quantity: number;
    readonly productName: string;
    readonly productDetail: ProductDetail;
    readonly checked: boolean;
}

export type CurrentUser = {
    readonly id: string;
    readonly sub: string | null | undefined;
    readonly role: string;
    readonly avatar: string | null | undefined;
    readonly addressId: string | null | undefined;
    readonly username: string;
    readonly email: string | null | undefined;
}

export type Error = {
    readonly message: string;
    readonly code: number;
    readonly details: string[];
}

export type FileUpload = {
    readonly id: string;
    readonly name: string;
    readonly extension: string;
    readonly contentType: string;
    readonly size: number;
    readonly url: string;
    readonly dimension: string;
}

export type Order = {
    readonly id: string;
    readonly totalAmount: number;
    readonly user: User;
    readonly orderItems: Order[];
    readonly shippingAddress: ShippingAddress;
    readonly status: string;
    readonly note: string;
    readonly payment: PaymentInfo;
    readonly createdDate: Date;
    readonly shippingFee: number;
    readonly retailer: User;
}

export type OrderItem = {
    readonly id: string;
    readonly quantity: number;
    readonly price: number;
    readonly productDetail: ProductDetail;
    readonly note: string;
    readonly rate: Rate;
}

export type Notification = {
    readonly id: string;
    readonly toUser: User;
    readonly fromUser: User;
    readonly type: string;
    readonly message: string;
    readonly read: boolean;
    readonly createdDate: Date;
}

export type Page<T> = {
    readonly content: T;
    readonly totalElements: number;
    readonly totalPages: number;
    readonly size: number;
    readonly number: number;
    readonly first: boolean;
    readonly last: boolean;
    readonly numberOfElements: number;
    readonly empty: boolean;
}

export type PaymentInfo = {
    readonly method: string;
    readonly status: string;
}

export type Product = {
    readonly id: string;
    readonly name: string;
    readonly slug: string;
    readonly shortDescription: string;
    readonly thumbnail: string;
    readonly status: boolean;
    readonly sales: number;
    readonly rate: number;
    readonly rateCount: number;
    readonly minPrice: number;
    readonly maxPrice: number;
    readonly createdDate: Date;
    readonly updatedDate: Date;
}

export type ProductCategory = {
    readonly id: string;
    readonly name: string;
    readonly slug: string;
    readonly description: string;
    readonly thumbnail: string;
    readonly default: boolean;
    readonly productCategories: ProductCategory[];
    readonly parentProductCategory: ProductCategory | null;

}

export type ProductDetail = {
    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly description: string;
    readonly status: boolean;
    readonly images: string[];
    readonly rate: number;
    readonly sales: number;
    readonly rateCount: number;
    readonly product: Product;
}

export interface User {
    readonly id: string;
    readonly avatar: string;
    readonly email: string;
    readonly birthday: string;
    readonly gender: boolean;
    readonly username: string;
    readonly role: string;
    readonly status: boolean;
}

export type UserRemember = {
    readonly username: string;
    readonly password: string;
    readonly avatar: string;
}

export interface Rate {
    readonly rate: number;
    readonly message: string;
    readonly images: string[];
    readonly name: string;
    readonly thumbnail: string;
    readonly username: string;
    readonly avatar: string;
}

export interface ShippingAddress {
    readonly fullName: string;
    readonly phoneNumber: string;
    readonly address: string;
}
