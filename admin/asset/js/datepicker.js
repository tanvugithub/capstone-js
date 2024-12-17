// Hien thi button
$(function () {
    $("#ngaylam").datepicker({
        showOn: "button",
        buttonImage: "../asset/img/calendar-icon.png",
        buttonImageOnly: true,
        buttonText: "Select date",
        dateFormat: "mm/dd/yy"

    });
});

// Lay ngay mac dinh
$(document).ready(function () {
    var d = new Date();

    var month = d.getMonth() + 1;
    var day = d.getDate();

    var output = (('' + month).length < 2 ? '0' : '') + month + '/' +
        (('' + day).length < 2 ? '0' : '') + day + '/' +
        d.getFullYear();
    $('#ngaylam').val(output);
});