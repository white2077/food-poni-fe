export type QueryParams = {
  page?: number;
  pageSize?: number;
  status?: boolean | undefined;
  sort?: string;
  // body?: z.infer<typeof productSchema>;
};

export default function generateQueryString(
  url: string,
  params?: QueryParams,
): string {
  const { page, pageSize, status, sort } = params ?? ({} as QueryParams);
  let queryString = "";

  if (page || pageSize || status || sort) {
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

    if (sort) {
      if (queryString.length > 1) {
        queryString += "&";
      }
      queryString += `sort=${sort}`;
    }
  }

  return url + queryString;
}
