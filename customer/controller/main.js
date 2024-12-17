import { productServices } from "../services/product.services.js";
import { cartServices } from "../services/cart.services.js";

const carts = new cartServices();

const renderCartCount = () => {
    document.getElementById('cart-count').innerHTML = carts.carts.length;
}

renderCartCount();

const renderLoading = () => {
    let htmlContent = "";
    htmlContent += `
                    <div class="m-auto loading">
                        <div class="spinner-border text-danger" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                        
    `;
    document.getElementById("products").innerHTML = htmlContent;
    document.querySelector(".pagination").classList.add("d-none");
}

const renderProducts = (data, status) => {
    let htmlContent = '';

    if (status === 404) {
        htmlContent += `<div class="alert alert-warning" role="alert">
                            Không tìm thấy sản phẩm nào
                        </div>`;
        document.querySelector(".pagination").classList.add("d-none");
    } else {
        document.querySelector(".pagination").classList.remove("d-none");
        data.forEach((item, index) => {
            //const itemStr = JSON.stringify(item).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            htmlContent += `
                <div class="product">
                    <div class="img">
                        <img src="${item.img}" alt="" />
                    </div>
                    <h2 class="name">${item.name}</h2>
                    <span class="screen">
                    ${item.screen}
                    </span>
                    <div class="price">${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(item.price)}</div>
                    <div class="info">
                        <ul>
                            <li>
                                Camera sau: ${item.backCamera}
                            </li>
                            <li>
                                Camera trước: ${item.frontCamera}
                            </li>
                            <li>${item.desc}</li>
                        </ul>
                    </div>
                    <button id="buy" class="buy" onclick="productBuy(${item.id})">Mua ngay</button>
                </div>
            `;
        });

        // PAGINATION
        const limit = localStorage.getItem("limit");
        const page = localStorage.getItem("page");
        const total = localStorage.getItem("total");

        let numPage = Math.ceil(+total / +limit);

        if (numPage > 1) {
            document.getElementById("prevPage").classList.remove("d-none");
            document.getElementById("nextPage").classList.remove("d-none");
            document.getElementById("paginationDescription").classList.add("d-none");

            if (+page === 1) {
                document.getElementById("prevPage").classList.add("d-none");
            } else {
                document.getElementById("prevPage").classList.remove("d-none");
            }

            if (+page >= +numPage) {
                document.getElementById("nextPage").classList.add("d-none");
            } else {
                document.getElementById("nextPage").classList.remove("d-none");
            }

        } else {
            document.getElementById("prevPage").classList.add("d-none");
            document.getElementById("nextPage").classList.add("d-none");
        }

    }

    document.getElementById("products").innerHTML = htmlContent;
}

const getLocalStorage = () => {
    const filterKey = localStorage.getItem("filterKey");
    const filterValue = localStorage.getItem("filterValue");
    const sortKey = localStorage.getItem("sortKey");
    const sortValue = localStorage.getItem("sortValue");
    const page = localStorage.getItem("page");
    const limit = localStorage.getItem("limit");
    const total = localStorage.getItem("total");
    return { page, filterKey, filterValue, sortKey, sortValue, limit, total }
}

// Get List Product | sort | filter search | pagination
const getList = async ({ sortKey = 'updatedAt', sortValue = 'desc', filterKey = '', filterValue = '', limit = 5, page = 1 } = {}) => {
    try {
        renderLoading();

        const resTotal = await productServices.getTotalAPI(filterKey, filterValue);

        const res = await productServices.getListAPI(sortKey, sortValue, filterKey, filterValue, limit, page);

        //Lưu biến sort vào localStorage
        localStorage.setItem("sortKey", sortKey);
        localStorage.setItem("sortValue", sortValue);
        localStorage.setItem("filterKey", filterKey);
        localStorage.setItem("filterValue", filterValue);
        localStorage.setItem("page", page);
        localStorage.setItem("limit", limit);
        localStorage.setItem("total", resTotal.data.length);

        if (res?.data) {
            renderProducts(res.data, 200);
        }
    } catch (err) {
        console.log('err: ', err);
        renderProducts([], err.status);
    }
};

getList();

const cartModal = new bootstrap.Modal('#cartModal', {
    //keyboard: false
});

const cartSuccessModal = new bootstrap.Modal('#cartSuccessModal', {
    //keyboard: false
});

const openModal = () => {
    cartModal.show();
}

const closeModal = () => {
    cartModal.hide();
}

const openSuccessModal = () => {
    cartSuccessModal.show();
}

document.getElementById('cart-icon').onclick = (e) => {
    e.preventDefault();

    openModal();
    renderCartModal();

}
//Event buy
window.productBuy = async (id) => {
    //get product API
    const res = await productServices.getProductById(id);
    if (res && res.data) {
        //console.log("product: ", res.data);
        // [ {id, quantity, product} ]
        carts.add({ id: id, quantity: 1, product: res.data });
    }

    if (carts.carts.length > 0) {
        openModal();
        renderCartModal();
    }
}

const renderCartModal = () => {
    const cartsRenderWrapper = document.getElementById("cartsRenderWrapper");
    let htmlContent = '';
    if (carts.carts.length > 0) {

        renderCartCount();

        carts.carts.forEach((item, index) => {
            htmlContent += `
                <tr>
                    <td class="text-center">${index + 1}</td>
                    <td>${item.product.name}</td>
                    <td class="text-center">
                        ${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(item.product.price)}
                    </td>
                    <td class="text-center">
                        <button class="btn-quantity" onclick="quantityChange('-', ${item.id})">-</button>
                        <input type="number" 
                            class="input-quantity text-center"
                            id="quantity-${item.id}"
                            data-id="${item.id}"
                            value="${item.quantity}" 
                            onchange="updateCart()"
                        />
                        <button class="btn-quantity" onclick="quantityChange('+', ${item.id})">+</button>
                    </td>
                    <td>
                        ${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(item.product.price * item.quantity)}
                    </td>
                    <td>
                        <button class="btn text-danger" onClick="deleteCart('${item.id}')">
                        <i class="fa fa-trash"></i> <span>Xóa</span>
                        </button>
                    </td>
                </tr>
            `;
        });

        htmlContent += `
            <tr>
                    <td colspan="3"></td>
                    <td class="text-danger fw-bold text-center">Tổng: </td>
                    <td class="text-danger fw-bold">${new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(carts.totalOrderPrice())}
                    </td>
                    <td></td>
                </tr>
        `;
    } else {
        renderCartCount();
        htmlContent += `
                <tr>
                    <td colspan="6" class="empty-text">
                        Không có sản phẩm trong giỏ hàng
                    </td>
                </tr>
        `;
    }
    cartsRenderWrapper.innerHTML = htmlContent;
}

window.quantityChange = (type, id) => {

    carts.updateWithButton(id, type);

    if (carts.carts.length > 0) {
        renderCartModal();
    }
}

window.updateCart = () => {
    const quantityInputs = document.querySelectorAll('.input-quantity');

    // quét array input
    quantityInputs.forEach((input) => {
        const id = input.getAttribute("data-id");
        //kiểm tra id có trong carts?
        const newQuantity = input.value;
        carts.update(id, newQuantity);
    });

    if (carts.carts.length > 0) {
        renderCartModal();
    }
}

window.deleteCart = (id) => {
    carts.delete(id);
    renderCartModal();
}

document.getElementById("checkout").onclick = () => {
    // reset carts
    if (carts.carts.length > 0) {
        carts.reset();
        renderCartModal();
        closeModal();
        openSuccessModal();
    }
}

document.getElementById('prevPage').addEventListener('click', function (event) {
    event.preventDefault();
    const page = localStorage.getItem("page");
    const filterKey = localStorage.getItem("filterKey");
    const filterValue = localStorage.getItem("filterValue");
    const sortKey = localStorage.getItem("sortKey");
    const sortValue = localStorage.getItem("sortValue");

    if (page && page !== "") {
        if (page > 1) {
            getList({ sortKey: sortKey, sortValue: sortValue, filterKey: filterKey, filterValue: filterValue, page: page - 1 });
        }
    }
});

document.getElementById('nextPage').addEventListener('click', function (event) {
    event.preventDefault();
    const page = localStorage.getItem("page");
    const filterKey = localStorage.getItem("filterKey");
    const filterValue = localStorage.getItem("filterValue");
    const sortKey = localStorage.getItem("sortKey");
    const sortValue = localStorage.getItem("sortValue");

    if (page && page !== "") {
        getList({ sortKey: sortKey, sortValue: sortValue, filterKey: filterKey, filterValue: filterValue, page: +page + 1 });
    }
});

document.getElementById("sortSel").onchange = (e) => {
    const { filterKey, filterValue } = getLocalStorage();
    getList({
        sortKey: "updatedAt",
        sortValue: e.target.value,
        filterKey: filterKey,
        filterValue: filterValue
    });
}

document.getElementById("typeSel").onchange = (e) => {
    getList({
        filterKey: "type",
        filterValue: e.target.value,
    });
}

//Search
document.getElementById("searchForm").onsubmit = (e) => {
    e.preventDefault();
    const searchValue = document.getElementById("searchInput").value;
    if (searchValue !== "") {
        getList({
            filterKey: "name",
            filterValue: searchValue
        });
    }
}

//SCROLL TO TOP
const scrollToTop = document.querySelector("#scroll-to-top");
window.addEventListener("scroll", function () {
    if (window.scrollY > 600) {
        scrollToTop.classList.remove('hidden');
    } else {
        scrollToTop.classList.add('hidden');
    }
});
scrollToTop.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});