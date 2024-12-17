import { Product } from "../model/Product.js";
import { productServices } from "../services/product.services.js";
import { Validation } from "../services/Validation.js";

const btnInsert = document.getElementById("btnInsert");
const btnInsertSubmit = document.getElementById("btnInsertSubmit");
const btnUpdateSubmit = document.getElementById("btnUpdateSubmit");
const headerTileModal = document.getElementById("header-title");

const validation = new Validation();

//Bắt sự kiện click vô sort bất kỳ
const sortDivs = document.querySelectorAll(".sortDiv");

const renderTable = (data, status) => {
    let htmlContent = '';

    if (status === 404) {
        htmlContent += `
         <tr>
            <td colspan='6' class="text-red-500 font-bold">
                Không tìm thấy sản phẩm nào
            </td>
         </tr>`;
        document.querySelector(".pagination").classList.add("d-none");
    } else {
        document.querySelector(".pagination").classList.remove("d-none");
        data.forEach((item, index) => {
            htmlContent += `
                <tr>
                    <td>${item.name}</td>
                    <td><img src="${item.img}" style="width:80px" /></td>
                    <td>
                        ${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(item.price)}
                    </td>
                    <td>${item.type}</td>
                    <td>${moment(item.updatedAt).format("DD-MM-YYYY . HH:mm:ss")}</td>
                    <td>
                        <button class="btn btn-warning" data-toggle="modal" 
                        data-target="#myModal"
                        onClick="editProduct('${item.id}')"
                        >Edit</button>
                        <button class="btn btn-danger" onClick="deleteProduct('${item.id}')">Delete</button>
                    </td>
                </tr>
            `;
        });

        const sortKey = localStorage.getItem("sortKey"); //price
        const sortValue = localStorage.getItem("sortValue");  //asc

        sortDivs.forEach((item) => {
            item.querySelector(`.sortIconAsc`).classList.remove("d-none");
            item.querySelector(`.sortIconDesc`).classList.remove("d-none");
            item.querySelector(`.sortIconAsc`).classList.remove("text-primary");
            item.querySelector(`.sortIconDesc`).classList.remove("text-primary");
        });

        if (sortKey && sortKey !== "" && sortValue && sortValue) {

            const sortDiv = document.querySelector(`#${sortKey}Sort`);

            switch (sortValue) {
                case "desc":
                    sortDiv.querySelector(`.sortIconAsc`).classList.add("d-none");
                    sortDiv.querySelector(`.sortIconDesc`).classList.remove("d-none");
                    sortDiv.querySelector(`.sortIconDesc`).classList.add("text-primary");
                    break;
                case "asc":
                    sortDiv.querySelector(`.sortIconAsc`).classList.remove("d-none");
                    sortDiv.querySelector(`.sortIconDesc`).classList.add("d-none");
                    sortDiv.querySelector(`.sortIconAsc`).classList.add("text-primary");
                    break;
                default:
            }
        }

        // PAGINATION
        const limit = localStorage.getItem("limit");
        const page = localStorage.getItem("page");
        const total = localStorage.getItem("total");
        //const filter = localStorage.getItem("filter");

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

    document.getElementById("tableList").innerHTML = htmlContent;
}

// Get List Product | sort | filter search | pagination
const getList = async ({ sortKey = 'updatedAt', sortValue = 'desc', filter = '', limit = 5, page = 1 } = {}) => {
    try {
        const resTotal = await productServices.getTotalAPI(filter);

        const res = await productServices.getListAPI(sortKey, sortValue, filter, limit, page);

        //Lưu biến sort vào localStorage
        localStorage.setItem("sortKey", sortKey);
        localStorage.setItem("sortValue", sortValue);
        localStorage.setItem("filter", filter);
        localStorage.setItem("page", page);
        localStorage.setItem("limit", limit);
        localStorage.setItem("total", resTotal.data.length);

        if (res?.data) {
            renderTable(res.data, 200);
        }
    } catch (err) {
        console.log('err: ', err);
        renderTable([], err.status);
    }
};

getList();

//Search
document.getElementById("searchForm").onsubmit = async (e) => {
    e.preventDefault();
    const searchValue = document.getElementById("searchInput").value;
    if (searchValue !== "") {
        getList({ filter: searchValue });
    }
}

document.getElementById("resetSearch").onclick = () => {
    getList();
    document.getElementById("searchInput").value = "";
}

sortDivs.forEach((item) => {
    item.addEventListener('click', function (event) {

        if (event.target.tagName !== 'DIV') {
            event.stopPropagation();
            this.click();
        } else {
            const sortKey = this.getAttribute("data-sort-key");

            // Check trong localStorage có sortKey đó hay không?
            const sortKeyStorage = localStorage.getItem("sortKey");

            let sortValueCurrent = '';
            let sortValue = 'desc';
            //Nếu click đúng vào sortKey cũ
            if (sortKey === sortKeyStorage) {
                sortValueCurrent = localStorage.getItem("sortValue");
                if (sortValueCurrent === 'asc') {
                    sortValue = 'desc';
                } else {
                    sortValue = 'asc';
                }
            } else {
                sortValue = 'asc';
                // Reset current sort arrow icon
                const ele = document.querySelector(`#${sortKeyStorage}Sort`);
                ele.querySelector(`.sortIconAsc`).classList.remove("d-none");
                ele.querySelector(`.sortIconAsc`).classList.remove("text-primary");

                ele.querySelector(`.sortIconDesc`).classList.remove("d-none");
                ele.querySelector(`.sortIconDesc`).classList.remove("text-primary");
            }

            const filter = localStorage.getItem("filter");
            getList({ sortKey: sortKey, sortValue: sortValue, filter: filter });
        }
    })
})

document.getElementById('prevPage').addEventListener('click', function (event) {
    event.preventDefault();
    const page = localStorage.getItem("page");
    const filter = localStorage.getItem("filter");
    const sortKey = localStorage.getItem("sortKey");
    const sortValue = localStorage.getItem("sortValue");

    if (page && page !== "") {
        if (page > 1) {
            getList({ sortKey: sortKey, sortValue: sortValue, filter: filter, page: page - 1 });
        }
    }
});

document.getElementById('nextPage').addEventListener('click', function (event) {
    event.preventDefault();
    const page = localStorage.getItem("page");
    const filter = localStorage.getItem("filter");
    const sortKey = localStorage.getItem("sortKey");
    const sortValue = localStorage.getItem("sortValue");

    if (page && page !== "") {
        getList({ sortKey: sortKey, sortValue: sortValue, filter: filter, page: +page + 1 });
    }
});

// Thêm sự kiện click cho các thẻ <i> để ngăn chặn sự kiện nổi bọt
document.querySelectorAll('#sortPrice i').forEach(function (icon) {
    icon.addEventListener('click', function (event) {
        event.stopPropagation();
        document.getElementById('sortPrice').click();
    });
});

// Get Form Info
const getFormInfo = () => {
    const elements = document.querySelectorAll("#formProduct input, #formProduct select, #formProduct textarea");
    //console.log(">>> elements: ", elements);

    let obj = {};
    elements.forEach((element) => {
        const { id, value } = element;
        obj[id] = value;
    })

    //Khởi tạo object Product
    return new Product(obj.name, +obj.price, obj.screen, obj.backCamera, obj.frontCamera, obj.img, obj.desc, obj.type);
}

// Button click: Open modal Thêm sản phẩm
btnInsert.onclick = async () => {
    headerTileModal.innerHTML = "Thêm mới sản phẩm";
    btnUpdateSubmit.setAttribute("style", "display:none");
    btnInsertSubmit.removeAttribute("style", "display:none");

    resetError();

    const elements = document.querySelectorAll("#formProduct input, #formProduct select, #formProduct textarea");
    elements.forEach((element) => {
        element.value = "";
    })
}

// Insert submit on modal
btnInsertSubmit.onclick = async () => {
    const data = getFormInfo();
    data.createdAt = new Date().getTime();
    data.updatedAt = new Date().getTime();

    let isValid = true;
    isValid &= validation.required(data.name, "Vui lòng nhập tên sản phẩm", 'tbName')
        && validation.isText(data.name, "Tên sản phẩm phải là chữ", "tbName")
        && validation.required(data.price, "Vui lòng nhập giá sản phẩm", 'tbPrice')
        && validation.isNumber(data.price, "Giá sản phẩm phải là số", 'tbPrice')
        && validation.required(data.screen, "Vui lòng nhập thông tin màn hình", 'tbScreen')
        && validation.required(data.backCamera, "Vui lòng nhập thông tin camera sau", 'tbBackCamera')
        && validation.required(data.frontCamera, "Vui lòng nhập thông tin camera trước", 'tbFrontCamera')
        && validation.required(data.img, "Vui lòng nhập hình ảnh sản phẩm", 'tbImg')
        && validation.required(data.type, "Vui lòng chọn loại sản phẩm", 'tbType')

    if (!isValid) return;

    await productServices.addAPI(data);
    document.getElementById("btnClose").click();
    getList();
}

// Update submit on modal
btnUpdateSubmit.onclick = async () => {
    const data = getFormInfo();

    data.updatedAt = new Date().getTime();

    let isValid = true;
    isValid &= validation.required(data.name, "Vui lòng nhập tên sản phẩm", 'tbName')
        && validation.isText(data.name, "Tên sản phẩm phải là chữ", "tbName")
        && validation.required(data.price, "Vui lòng nhập giá sản phẩm", 'tbPrice')
        && validation.isNumber(data.price, "Giá sản phẩm phải là số", 'tbPrice')
        && validation.required(data.screen, "Vui lòng nhập thông tin màn hình", 'tbScreen')
        && validation.required(data.backCamera, "Vui lòng nhập thông tin camera sau", 'tbBackCamera')
        && validation.required(data.frontCamera, "Vui lòng nhập thông tin camera trước", 'tbFrontCamera')
        && validation.required(data.img, "Vui lòng nhập hình ảnh sản phẩm", 'tbImg')
        && validation.required(data.type, "Vui lòng chọn loại sản phẩm", 'tbType')

    if (!isValid) return;

    const id = document.getElementById('formProduct').getAttribute('data-id');

    await productServices.editAPI(id, data);

    document.getElementById("btnClose").click();

    getList();
}

// Edit button click on table
window.editProduct = async (id) => {
    headerTileModal.innerHTML = "Cập nhật sản phẩm";
    btnUpdateSubmit.removeAttribute("style", "display:none");
    btnInsertSubmit.setAttribute("style", "display:none");

    resetError();

    document.getElementById('formProduct').setAttribute('data-id', id)

    try {
        const res = await productServices.getByIdAPI(id);
        //hiển thị data lên form
        const elements = document.querySelectorAll("#formProduct input, #formProduct select, #formProduct textarea");
        elements.forEach((element) => {
            const { id } = element;
            element.value = res.data[id];
        })
    } catch (err) {
        console.log("Err: ", err);
    }
}

// Delete button click on table
window.deleteProduct = async (id) => {
    try {
        if (confirm("Bạn có chắn chắn muốn xóa không?")) {
            await productServices.deleteAPI(id);
            getList();
        }
    } catch (err) {
        console.log("Err");
    }
}

// Hàm chuyển không dấu
const nonAccentVietnamese = (str) => {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
};

const resetError = () => {
    document.getElementById("tbName").innerHTML = "";
    document.getElementById("tbPrice").innerHTML = "";
    document.getElementById("tbScreen").innerHTML = "";
    document.getElementById("tbBackCamera").innerHTML = "";
    document.getElementById("tbFrontCamera").innerHTML = "";
    document.getElementById("tbImg").innerHTML = "";
    document.getElementById("tbDesc").innerHTML = "";
    document.getElementById("tbType").innerHTML = "";
}

