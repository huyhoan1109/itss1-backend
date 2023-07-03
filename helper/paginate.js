const paginate = (currentPage, pageSize) => {
    const offset = parseInt((currentPage - 1) * pageSize, 10);
    const limit = parseInt(pageSize, 10);
    return {
        offset,
        limit,
    };
}

module.exports = paginate