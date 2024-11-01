export type QueryParams = {
  page?: number | null;
  pageSize?: number | null;
  status?: boolean | null;
  orderStatus?: string | null;
  sort?: string[] | null;
  read?: string | null;
  // body?: z.infer<typeof productSchema>;
};

export default function generateQueryString(
  url: string,
  params?: QueryParams
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

    if (status !== undefined) {
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
      queryString += `sort=${sort.join("&sort=")}`;
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
