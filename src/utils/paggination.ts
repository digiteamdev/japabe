"use strict";

class Pagination {
  page: number;
  perPage: number;
  currentPage: number;
  hostName: string;
  pathName: any;
  constructor(page: number, perPage: number, hostName: string, pathName: any) {
    this.page = page - 1 || 0;
    this.perPage = perPage || 10;
    this.currentPage = page || 1;
    this.hostName = hostName;
    this.pathName = pathName;
  }

  next(totalData: number) {
    const next = this.page + 2 || 1 + 1;
    if (this.currentPage == Math.ceil(totalData / this.perPage)) {
      return null;
    } else {
      return (
        "http://" +
        this.hostName +
        "/api/v1" +
        this.pathName +
        "?page=" +
        next +
        "&perPage=" +
        this.perPage
      );
    }
  }

  prev() {
    const prev = this.page;
    if (this.page == 0) {
      return null;
    } else {
      return (
        "http://" +
        this.hostName +
        "/api/v1" +
        this.pathName +
        "?page=" +
        prev +
        "&perPage=" +
        this.perPage
      );
    }
  }
}

export default Pagination;
