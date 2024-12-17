export class Validation {
    required(value, messageError, errorId) {

        const element = document.getElementById(errorId)

        // TH value lỗi
        if (value === '') {
            element.innerHTML = messageError
            element.style.display = 'block'
            return false
        }



        element.innerHTML = ''
        element.style.display = 'none'
        return true
    }

    minLength(value, minLength, messageError, errorId) {
        const element = document.getElementById(errorId)

        if (value.length < minLength) {
            element.innerHTML = messageError
            element.style.display = 'block'
            return false
        }

        element.innerHTML = ''
        element.style.display = 'none'
        return true
    }

    maxLength(value, maxLength, messageError, errorId) {
        const element = document.getElementById(errorId)

        if (value.length > maxLength) {
            element.innerHTML = messageError
            element.style.display = 'block'
            return false
        }

        element.innerHTML = ''
        element.style.display = 'none'
        return true
    }

    isNumber(value, messageError, errorId) {
        const regex = /^[0-9]*$/

        const element = document.getElementById(errorId)
        if (regex.test(value)) { // value thỏa mãn đk của regex
            element.innerHTML = ''
            element.style.display = 'none'
            return true
        }

        element.innerHTML = messageError
        element.style.display = 'block'
        return false
    }

    isText(value, messageError, errorId) {
        const regex = /^(?!\d+$)[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ\s]+$/

        const element = document.getElementById(errorId)
        if (regex.test(value)) { // value thỏa mãn đk của regex
            element.innerHTML = ''
            element.style.display = 'none'
            return true
        }

        element.innerHTML = messageError
        element.style.display = 'block'
        return false
    }

    isUrl(value, messageError, errorId) {
        const regex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig

        const element = document.getElementById(errorId)
        if (regex.test(value)) { // value thỏa mãn đk của regex
            element.innerHTML = ''
            element.style.display = 'none'
            return true
        }

        element.innerHTML = messageError
        element.style.display = 'block'
        return false
    }


    isEmail(value, messageError, errorId) {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

        const element = document.getElementById(errorId)
        if (regex.test(value)) { // value thỏa mãn đk của regex
            element.innerHTML = ''
            element.style.display = 'none'
            return true
        }

        element.innerHTML = messageError
        element.style.display = 'block'
        return false
    }

    isPassword(value, messageError, errorId) {
        const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/;

        const element = document.getElementById(errorId)
        if (regex.test(value)) {
            element.innerHTML = ''
            element.style.display = 'none'
            return true
        }

        element.innerHTML = messageError
        element.style.display = 'block'
        return false
    }

    isDate(value, messageError, errorId) {

        const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

        const element = document.getElementById(errorId)
        if (regex.test(value)) {
            element.innerHTML = ''
            element.style.display = 'none'
            return true
        }

        element.innerHTML = messageError
        element.style.display = 'block'
        return false
    }

    isLuongCB(value, messageError, errorId) {
        const element = document.getElementById(errorId)
        if (+value >= 10000000 && +value <= 20000000) {
            element.innerHTML = ''
            element.style.display = 'none'
            return true
        }

        element.innerHTML = messageError
        element.style.display = 'block'
        return false
    }

    isChucVu(value, messageError, errorId) {
        const element = document.getElementById(errorId)
        if (value !== "" || +value > 0) {
            element.innerHTML = ''
            element.style.display = 'none'
            return true
        }

        element.innerHTML = messageError
        element.style.display = 'block'
        return false
    }

    isGioLam(value, messageError, errorId) {
        const element = document.getElementById(errorId)
        if (+value >= 80 && +value <= 200) {
            element.innerHTML = ''
            element.style.display = 'none'
            return true
        }

        element.innerHTML = messageError
        element.style.display = 'block'
        return false
    }
}