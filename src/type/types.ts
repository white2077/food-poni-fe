export type Address = {
  readonly id: string;
  readonly fullName: string;
  readonly phoneNumber: string;
  readonly address: string;
  readonly lon: number;
  readonly lat: number;
};

export type AuthResponse = {
  readonly accessToken: string;
  readonly refreshToken: string;
};

export type AuthRequest = {
  readonly username: string | null;
  readonly email?: string | null;
  readonly password: string;
};

export type Cart = {
  readonly id: string;
  readonly user?: {
    readonly id: string;
    readonly username: string;
    readonly avatar: string;
  };
  readonly quantity: number;
  readonly productName: string;
  readonly productDetail: {
    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly images: string[];
  };
  readonly toppings: Array<{
    readonly id: string;
    readonly name: string;
    readonly price: number;
  }>;
  readonly type: string | null;
  readonly note?: string;
  readonly checked?: boolean;
};

export type CurrentUser = {
  readonly id: string;
  readonly role: string;
  readonly avatar: string | null;
  readonly addressId: string | null;
  readonly username: string;
  readonly email: string;
};

export type Error = {
  readonly message: string;
  readonly code: number;
  readonly details: string[];
};

export type FileUpload = {
  readonly id: string;
  readonly name: string;
  readonly extension: string;
  readonly contentType: string;
  readonly size: number;
  readonly url: string;
  readonly dimension: string;
};

export type Order = {
  readonly id: string;
  readonly postPaidOrderId: string;
  readonly totalAmount: number;
  readonly user: User;
  readonly shippingAddress: ShippingAddress;
  readonly status: OrderStatus;
  readonly note: string;
  readonly payment: PaymentInfo;
  readonly createdAt: Date;
  readonly shippingFee: number;
};

export type OrderItem = {
  readonly id: string;
  readonly user: User;
  readonly quantity: number;
  readonly price: number;
  readonly productDetail: ProductDetail;
  readonly toppings: Array<{
    readonly id: string;
    readonly name: string;
    readonly price: number;
  }>;
  readonly type: string | null;
  readonly note: string;
  readonly rate: Rate;
};

export type OrderStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "DELIVERING"
  | "CANCELLED";

export type CartGroup = {
  readonly roomId: string;
  readonly timeout: number;
  readonly user: {
    readonly id: string;
    readonly username: string;
    readonly avatar: string;
  };
  readonly cartItems: Array<Cart>;
};

export type CartGroupEvent = {
  readonly type:
    | "UPDATE_CART_ITEM_QUANTITY"
    | "UPDATE_CART_ITEM_NOTE"
    | "ADD_CART_ITEM"
    | "DELETE_CART_ITEM"
    | "LEAVE_GROUP"
    | "DELETE_GROUP"
    | "KICK_USER";
  readonly roomId: string;
  readonly user: {
    readonly id: string;
    readonly username: string;
    readonly avatar: string;
  };
  readonly attributes:
    | {
        readonly cartItemId: string;
        readonly productName: string;
        readonly productDetail: {
          readonly id: string;
          readonly name: string;
          readonly price: number;
          readonly images: Array<string>;
        };
        readonly toppings: Array<{
          readonly id: string;
          readonly name: string;
          readonly price: number;
        }>;
        readonly type: string | null;
        readonly quantity: number;
      }
    | {
        readonly cartItemId: string;
        readonly quantity: number;
      }
    | {
        readonly cartItemId: string;
        readonly note: string;
      }
    | { readonly userId: string };
};

export type Notification = {
  readonly id: string;
  readonly fromUser: User;
  readonly toUser: User;
  readonly read: boolean;
  readonly status: boolean;
  readonly attributes: string;
  readonly type: "ORDER" | "PROMOTION" | "VOUCHER" | "RATE";
  readonly createdAt: Date;
};

export type NotificationAttributes = {
  readonly id: string;
  readonly orderStatus: string | "REJECTED" | "APPROVED" | "COMPLETED";
};

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
};

export type PaymentInfo = {
  readonly method: string;
  readonly status: string;
  readonly paymentUrl: string;
};

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
  readonly productCategories: Array<ProductCategory>;
  readonly toppings: Array<{
    readonly id: string;
    readonly name: string;
    readonly price: number;
  }>;
  readonly types: Array<string>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type ProductCategory = {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly thumbnail: string;
  readonly level: number;
  readonly parentProductCategory: ProductCategory | null;
};

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
};

export type User = {
  readonly id: string;
  readonly avatar: string;
  readonly email: string;
  readonly birthday: string;
  readonly gender: boolean;
  readonly username: string;
  readonly role: string;
  readonly status: boolean;
  readonly address: Address;
};

export type UserRemember = {
  readonly username: string;
  readonly password: string;
  readonly avatar: string;
};

export type Rate = {
  readonly rate: number;
  readonly message: string;
  readonly images: string[];
  readonly name: string;
  readonly thumbnail: string;
  readonly username: string;
  readonly avatar: string;
};

export type ProductRatePercent = {
  readonly star: number;
  readonly total: number;
  readonly percent: number;
};

export type SearchResult = {
  readonly display_name: string | null;
  readonly lon: number;
  readonly lat: number;
};

export type ShippingAddress = {
  readonly fullName: string;
  readonly phoneNumber: string;
  readonly address: string;
};

export type Topping = {
  readonly id: string;
  readonly name: string;
  readonly price: number;
};
