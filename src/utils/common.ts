import { server } from "@/utils/server.ts";
import { User } from "@/type/types.ts";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const checkDirty = (
  editingFields: Array<{
    readonly field: string;
    readonly value: string;
    readonly errorMessage: string | null;
  }>,
  savedFields: Array<{ field: string; value: string }> | null,
): boolean => {
  if (!savedFields) {
    return false;
  }

  if (editingFields.length !== savedFields.length) {
    return false;
  }

  //check value in editingFields is equal to value in savedFields
  for (let i = 0; i < editingFields.length; i++) {
    if (
      !["lon", "lat"].includes(editingFields[i].field) &&
      editingFields[i].value !== savedFields[i].value
    ) {
      console.log(editingFields[i].value, savedFields[i].value);
      return false;
    }
  }

  return true;
};

export const getAvatar = (user: User) => {
  if (user.role === "RETAILER") {
    return "/public/logo-02.png";
  }

  if (user.avatar) {
    return user.avatar.startsWith("http") || user.avatar.startsWith("https")
      ? user.avatar
      : server + user.avatar;
  }
  return "/public/no-avatar.png";
};

export const getThumbnail = (thumbnail: string | null | undefined) => {
  if (thumbnail) {
    return thumbnail.startsWith("http") || thumbnail.startsWith("https")
      ? thumbnail
      : server + thumbnail;
  }
  return "/public/no-avatar.png";
};

export const currencyFormat = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
