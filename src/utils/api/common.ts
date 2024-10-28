export type QueryParams = {
  page?: number;
  pageSize?: number;
  status?: boolean | undefined;
  orderStatus?: string;
  sort?: string;
  read?: string;
  // body?: z.infer<typeof productSchema>;
};

export default function generateQueryString(
  url: string,
  params?: QueryParams,
): string {
  const { page, pageSize, status, orderStatus, sort, read } =
    params ?? ({} as QueryParams);
  let queryString = "";

  if (page || pageSize || status || orderStatus || sort) {
    queryString += "?";

    if (page) {
      queryString += `page=${page}`;
    }

    if (pageSize) {
      if (queryString.length > 1) {
        queryString += "&";
      }
      queryString += `size=${pageSize}`;
    }

    if (status) {
      if (queryString.length > 1) {
        queryString += "&";
      }
      queryString += `status=${status}`;
    }

    if (orderStatus) {
      if (queryString.length > 1) {
        queryString += "&";
      }
      queryString += `orderStatus=${orderStatus}`;
    }

    if (sort) {
      if (queryString.length > 1) {
        queryString += "&";
      }
      queryString += `sort=${sort}`;
    }

    if (read) {
      if (queryString.length > 1) {
        queryString += "&";
      }
      queryString += `read=${read}`;
    }
  }

  return url + queryString;
}
