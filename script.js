// hide static results
$(document).ready(function() {
    $(".result").hide();
    $("#sel-recipe").hide();
    loadCategories();
});

function process() {
    event.preventDefault();
    var search = $("#search").val();

    console.log("search:", search);
    searchUrl =
        "https://www.themealdb.com/api/json/v1/1/search.php?s=" + search;
    getData(display, searchUrl);
}
function getData(display, url) {
    console.log("Hello display");
    var xhr = new XMLHttpRequest();

    xhr.open("GET", url);
    xhr.send();
    xhr.onload = function() {
        if ((xhr.status = 200)) {
            // console.log(xhr.response);
            display(xhr.response);
        } else alert("Error msg:", xhr.status);
    };
}

// to display Full meal Recipie on display.html
function display(response) {
    event.preventDefault();
    response = JSON.parse(response);
    console.log("JSON parsed:\n", response);
    var meals = response.meals;
    if (meals == null) {
        alert("OOps!! we dont have it for you, may be later");
        return 0;
    }
    // show static elements
    $(".result").show();
    $(".banner").hide();
    var obj = meals[0];
    // add fetched data to tags
    $("#mealName").text(obj["strMeal"]);
    $("#mealPic").attr("src", obj["strMealThumb"]);
    $("#instruction").text(obj["strInstructions"]);

    // extract videos key to support youtube embeb url
    var link = obj["strYoutube"].split("");
    var position = link.indexOf("=");
    link = link.splice(position + 1);
    link = link.join("");
    var src = "https://www.youtube.com/embed/" + link;

    $("iframe").attr("src", src);
    console.log(src);
    // creating list item for ingrediantes and measurement
    for (keys in obj) {
        if (
            keys.includes("Ingredient") &&
            obj[keys] != null &&
            obj[keys] != ""
        ) {
            $("#ingredients").append(
                `<li class="list-group-item">` + obj[keys] + "</li>"
            );
        } else if (
            keys.includes("Measure") &&
            obj[keys] != null &&
            obj[keys] != ""
        ) {
            $("#measure").append(
                `<li class="list-group-item">` + obj[keys] + "</li>"
            );
        }
    }
}

function loadCategories() {
    var url = "https://www.themealdb.com/api/json/v1/1/categories.php";
    fetch(printCategories, url);
}

function fetch(callback, url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onload = function() {
        if (xhr.status == 200) callback(xhr.response);
        else alert("Error loading msg:", xhr.status);
    };
}

function printCategories(response) {
    response = JSON.parse(response);
    var categoriesArr = response.categories;
    var img, name;
    categoriesArr.forEach(function(ele) {
        name = ele.strCategory;
        img = ele.strCategoryThumb;
        console.log(name, img);
        // to get list of meals of each category
        $("#sel-category").append(
            `<option value=` + name + `>` + name + `</option`
        );
    });
}

function fetchList(name) {
    var url = "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + name;
    fetch(printList, url);
}

function printList(response) {
    $("#sel-recipe").html("");
    $("#sel-recipe").show();
    response = JSON.parse(response);
    var list = response.meals;
    console.log(list);
    var row = document.createElement("div");
    list.forEach(function(ele) {
        var img = ele.strMealThumb;
        var name = ele.strMeal;
        var id = ele.idMeal;
        console.log(name);
        $("#sel-recipe").append(
            `<option value=` + id + `>` + name + `</option>`
        );
    });
}
$("#sel-category").click(function() {
    fetchList($("#sel-category").val());
});

$("#sel-recipe").click(function() {
    fetchRecipe($("#sel-recipe").val());
});

function fetchRecipe(id) {
    url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id;
    fetch(display, url);
}
