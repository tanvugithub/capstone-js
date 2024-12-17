export const productServices = {

    getTotalAPI: (filterValue) => {
        const url = new URL('https://674d5f74635bad45618af71d.mockapi.io/api/v1/products');

        if (filterValue && filterValue !== '') {
            url.searchParams.append('name', filterValue);
        }

        return axios({
            method: 'GET',
            url: url,
        })
    },

    getListAPI: (sortKey, sortValue, filterValue, limit, page) => {
        const url = new URL('https://674d5f74635bad45618af71d.mockapi.io/api/v1/products');

        //url.searchParams.append('completed', false);
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);

        if (filterValue && filterValue !== '') {
            url.searchParams.append('name', filterValue);
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

    addAPI: (payload) => {
        return axios({
            method: 'POST',
            url: 'https://674d5f74635bad45618af71d.mockapi.io/api/v1/products',
            data: payload
        })
    },

    editAPI: (id, payload) => {
        return axios({
            method: 'PUT',
            url: `https://674d5f74635bad45618af71d.mockapi.io/api/v1/products/${id}`,
            data: payload
        })
    },

    deleteAPI: (id) => {
        return axios({
            method: 'DELETE',
            url: `https://674d5f74635bad45618af71d.mockapi.io/api/v1/products/${id}`
        })
    },

    getByIdAPI: (id) => {
        return axios({
            method: 'GET',
            url: `https://674d5f74635bad45618af71d.mockapi.io/api/v1/products/${id}`
        })
    },

}