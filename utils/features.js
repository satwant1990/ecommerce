class ProductApiFeatures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }
    search() {
        const category = this.queryStr.category;
        const price = this.queryStr.price;

        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {}
        if (!category && !price) {
            this.query = this.query.find({ ...keyword })
        }

        return this;
    }
    filter() {
        const queryCopy = { ...this.queryStr }

        //Removing fields from query
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key])

        let queryNewStr = JSON.stringify(queryCopy)
        queryNewStr = queryNewStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`)

        this.query = this.query.find(JSON.parse(queryNewStr))
        return this;

    }
    pagination(perPage) {
        const currentPage = Number(this.queryStr.page) || 1
        const skip = perPage * (currentPage - 1)
        this.query = this.query.limit().skip(skip)
        return this;
    }

}

export default ProductApiFeatures