let index = 0;
let cityId =  JSON.parse(localStorage.getItem("cityId"));
window.onload = function () {
    localStorage.clear();
}
function getCountry() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/countries',

        success: function (data) {
            let content = `<select id="country">`
            for (let i = 0; i < data.length; i++) {
                content += displayCountry(data[i]);
            }
            content += '</select>'
            document.getElementById('country-option').innerHTML = content;
        }
    })
}
function displayCountry(country) {
    return `<option  value="${country.id}">${country.name}</option>`;
}
function showAllCity() {
    $.ajax({
        type : 'GET',
        url : 'http://localhost:8080/cities',
        success : function (data) {
            let content = '';
            for (let i = 0; i < data.length; i++) {
                content += `  <tr>
                                            <td>${i+1}</td>
                                            <td><a href="city.html" onclick="showCityDetails(${data[i].id})">${data[i].name}</a></td>
                                            <td>${data[i].country?.name}</td>
                                            <td><button class="btn btn-warning" onclick="showEditForm(${data[i].id})" data-target="#create-city" data-toggle="modal">Sửa</button></td>
                                            <td><button class="btn btn-danger" onclick="showDeleteCity(${data[i].id})"  data-target="#delete-city" data-toggle="modal">Xóa</button></td>
                                        </tr>`
            }
            $(`#city-list`).html(content);
        }
    })
}
function showCreateForm() {
    $(`#create-city-title`).html("Thêm mới thành phố")
    // let footer =   `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
    //                 <button class="btn btn-primary" onclick="createNewCity()" type="button">Tạo mới</button>`;
    // $(`#create-city-footer`).html(footer);
    $(`#name`).val(null);
    $(`#country`).val(null);
    $(`#area`).val(null);
    $(`#population`).val(null);
    $(`#gdp`).val(null);
    $(`#description`).val(null);
    getCountry();
}
function createNewCity() {
    let inPutname = $(`#name`).val();
    let inPutcountry = $(`#country`).val();
    let inPutarea = $(`#area`).val();
    let inPutpopulation = $(`#population`).val();
    let inPutgdp = $(`#gdp`).val();
    let inPutdescription = $(`#description`).val();
    let city = {
        name : inPutname,
        country: {
           id : inPutcountry
        },
        area : inPutarea,
        population : inPutpopulation,
        gdp : inPutgdp,
        description: inPutdescription
    };
    $.ajax({
        type : 'POST',
        url : 'http://localhost:8080/cities',
        data : JSON.stringify(city),
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        success : function () {
            showSuccessMessage("Thêm mới thành phố thành công!");
            showAllCity();
        },
        error : function () {
            showErrorMessage("Thêm mới thất bại!");
        }
    })
}
function showEditForm(id) {
    $(`#create-city-title`).html("Sửa thông tin thành phố")
    let footer =   `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-primary" onclick="editCity(id)" type="button" data-dismiss="modal">Cập nhât</button>`;
    $(`#create-city-footer`).html(footer);

    $.ajax({
        type : 'GET',
        url : `http://localhost:8080/cities/${id}`,
        success : function (data) {
            $(`#name`).val(data.name);
            $(`#country`).val(data.country.name);
            $(`#area`).val(data.area);
            $(`#population`).val(data.population);
            $(`#gdp`).val(data.gdp);
            $(`#description`).val(data.description);
            index= data.id
            getCountry();
        }
    })

}
function editCity() {
    let name = $(`#name`).val();
    let country = $(`#country`).val();
    let area = $(`#area`).val();
    let population = $(`#population`).val();
    let gdp = $(`#gdp`).val();
    let description = $(`#description`).val();
    let city = {
        name : name,
        country: {
            id : country
        },
        area : area,
        population : population,
        gdp : gdp,
        description : description
    };
    $.ajax({
        type : 'PUT',
        url : `http://localhost:8080/cities/${index}`,
        data : JSON.stringify(city),
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        success : function () {
            showSuccessMessage("Cập nhật thành phố thành công!")
            showAllCity();
            showCityDetails(cityId)
        },
        error : function () {
            showErrorMessage("Cập nhật thất bại!")
        }
    })
}

function showDeleteCity(id) {
    let content = `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-danger" onclick="deleteCity(${id})" data-dismiss="modal"  type="button">Xóa</button>`;
    $(`#footer-delete`).html(content);
}

function deleteCity(id) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/cities/${id}`,

        success: function () {
            showAllCity();
            showSuccessMessage('Xóa thành công!');
            showCityDetails(cityId)

        },
        error: function () {
            showErrorMessage('Xóa lỗi');
        }
    });
}
function showCityDetails(id) {
    $.ajax({
        type : 'GET',
        url : `http://localhost:8080/cities/${id}`,

        success : function (data) {
            let content = '';

            window.localStorage.setItem("cityId",JSON.stringify(data.id))

            content += `<h4>Thành phố: ${data.name}</h4><br><br>
                        <p>Tên: ${data.name}</p><br>
                        <p>Quốc gia: ${data.country.name}</p><br>
                        <p>Diện tích: ${data.area}</p><br>
                        <p>Dân số: ${data.population}</p><br>
                        <p>Gdp: ${data.gdp}</p><br>
                        <p>Giới thiệu: ${data.description}</p><br>
                                 <button class="btn btn-warning" onclick="showEditForm(${data.id})" data-target="#create-city" data-toggle="modal">Sửa</button>
                                            <span><button class="btn btn-danger" onclick="showDeleteCity(${data.id})"  data-target="#delete-city" data-toggle="modal">Xóa</button></span>
                        
                   `

            $(`#city-list1`).html(content);
        }
    })
}
showCityDetails(cityId)
showAllCity();
