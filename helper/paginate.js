const paginate = (currentPage, pageSize) => {
    const offset = parseInt((currentPage - 1) * pageSize, 10);
    const limit = parseInt(pageSize, 10);
    return {
        offset,
        limit,
    };
}

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: tutorials } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, tutorials, totalPages, currentPage };
};

module.exports = paginate