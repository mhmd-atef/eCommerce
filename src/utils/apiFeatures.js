

export class ApiFeatures {
  constructor(modelQuery, searchQuery) {
    this.modelQuery = modelQuery;
    this.searchQuery = searchQuery;
  }
  pagination() {
    let pageNumber = parseInt(this.searchQuery.page * 1 || 1);
    this.pageNumber = pageNumber;
    if (this.searchQuery.page < 0) pageNumber = 1;
    let nextPage = pageNumber + 1;
    this.nextPage = nextPage;
    let prevPage = nextPage !== 2 ? pageNumber - 1 : undefined;
    this.prevPage = prevPage;
    let limit = parseInt(this.searchQuery.limit * 1 || 5);
    this.limit = limit;
    let skip = (pageNumber - 1) * limit;
    this.modelQuery.skip(skip).limit(limit);

    return this;
  }
  filter() {
    let filterObj = structuredClone(this.searchQuery);
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(/(gt|gte|lt|lte)/g, (val) => `$${val}`);
    filterObj = JSON.parse(filterObj);
    let excludedFields = ["page", "sort", "fields", "search"];
    excludedFields.forEach((Val) => delete filterObj[Val]);
    this.modelQuery.find(filterObj);

    return this;
  }
  sort() {
    if (this.searchQuery.sort) {
      let sortObj = this.searchQuery.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortObj);
    }
    return this;
  }

  fields() {
    if (this.searchQuery.fields) {
      const fields = this.searchQuery.fields.split(",").map((f) => f.trim());
      this.modelQuery.select(fields);
    }
    return this;
  }
  search() {
    if (this.searchQuery.search) {
      let searchQuery = new RegExp(this.searchQuery.search, "i");
      this.mongooseQuery.find({
        $or: [{ title: searchQuery }, { description: searchQuery }],
      });
    }
    return this;
  }
}
