export type QueryParams = {
  page?: number | null;
  pageSize?: number | null;
  status?: boolean | null;
  orderStatus?:
    | string
    | "APPROVED"
    | "REJECTED"
    | "DELIVERING"
    | "COMPLETED"
    | null;
  sort?: string[] | null;
  read?: string | null;
  slug?: string | null;
  pid?: string | null;
  orderGroup?: boolean | null;
  startDate?: string | null;
  endDate?: string | null;
  year?: string | null;
};

export default function generateQueryString(
  url: string,
  params?: QueryParams
): string {
  const {
    page,
    pageSize,
    status,
    orderStatus,
    sort,
    read,
    slug,
    pid,
    orderGroup,
    startDate,
    endDate,
    year
  } = params ?? ({} as QueryParams);
  let queryString = "";

  if (
    page ||
    pageSize ||
    status ||
    orderStatus ||
    sort ||
    read ||
    slug ||
    pid ||
    orderGroup ||
    startDate ||
    endDate ||
    year
  ) {
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

    if (slug) {
      if (queryString.length > 1) {
        queryString += "&";
      }
      queryString += `slug=${slug}`;
    }

    if (pid) {
      if (queryString.length > 1) {
        queryString += "&";
      }
      queryString += `pid=${pid}`;
    }

    if (startDate) {
      if (queryString.length > 1) {
        queryString += "&";
      }
      queryString += `startDate=${startDate}`;
    }

    if (endDate) {
      if (queryString.length > 1) {
        queryString += "&";
      }
      queryString += `endDate=${endDate}`;
    }
    if (year) {
      if (queryString.length > 1) {
        queryString += "&";
      }
      queryString += `year=${year}`;
    }
  }

  if (orderGroup !== undefined) {
    if (queryString.length > 1) {
      queryString += "&";
    }
    queryString += `orderGroup=${orderGroup}`;
  }

  return url + queryString;
}
