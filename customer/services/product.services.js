export const productServices = {
    getTotalAPI: (filterKey, filterValue) => {
        const url = new URL('https://674d5f74635bad45618af71d.mockapi.io/api/v1/products');

        if (filterKey && filterKey !== '' && filterValue && filterValue !== '') {
            url.searchParams.append(filterKey, filterValue);
        }

        return axios({
            method: 'GET',
            url: url,
        })
    },

    getListAPI: (sortKey, sortValue, filterKey, filterValue, limit, page) => {
        const url = new URL('https://674d5f74635bad45618af71d.mockapi.io/api/v1/products');

        //url.searchParams.append('completed', false);
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);

        if (filterKey && filterKey !== '' && filterValue && filterValue !== '') {
            url.searchParams.append(filterKey, filterValue);
        }

        if (sortKey && sortKey != "" && sortValue && sortValue !== '') {
            url.searchParams.append('sortBy', sortKey);
            url.searchParams.append('order', sortValue);
        }

        return axios({
            method: 'GET',
            url: url,
        })
    },
    getProductById: (id) => {
        const url = `https://674d5f74635bad45618af71d.mockapi.io/api/v1/products/${id}`;
        return axios({
            method: 'GET',
            url: url,
        })
    }
}