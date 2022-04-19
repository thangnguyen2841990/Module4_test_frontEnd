let index = 0;
function getAllProducts() {
    $.ajax({
        type: 'GET',
        url : 'http://localhost:8080/products',
        success : function (data) {
            let content = "";
            for (let i = 0; i < data.length; i++) {
                content += `<tr>
            <td>${i+1}</td>
            <td><img src="${data[i].image}" alt="Ảnh sản phẩm" width="100" height="100"></td>  
            <td>${data[i].name}</td>
            <td>${data[i].price}</td>
            <td>${data[i].quantity}</td>
            <td>${data[i].description}</td>
               <td><button type="button" id="editProduct" class="btn btn-warning" onclick="showEditForm(${data[i].id})">Sửa</button></td>
            <td><button type="button" id="deleteProduct" class="btn btn-danger" onclick="deleteProduct(${data[i].id})">Xóa</button></td>
        </tr>`
            }
            document.getElementById("body-table-product").innerHTML = content;
        }
    })
}
function createNewProduct() {
    let inputName = $(`#name`).val();
    let inputPrice = $(`#price`).val();
    let inputQuantity = $(`#quantity`).val();
    let inputDescription = $(`#description`).val();
    let inputImage = $(`#image`).val();
    let product = {
        name : inputName,
        price : inputPrice,
        quantity : inputQuantity,
        description : inputDescription,
        image : inputImage
    }
    $.ajax({
        type : 'POST',
        url : 'http://localhost:8080/products',
        data : JSON.stringify(product),
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        success : function (){
            getAllProducts()
        }
    })
}
function findProductByName() {
    let q = $(`#q`).val();
    let content = '';
    $.ajax({
        type : 'GET',
        url : `http://localhost:8080/products?q=${q}`,
        success : function (data) {
            for (let i = 0; i < data.length; i++) {
                content += `<tr>
            <td>${i + 1}</td>
            <td><img src="${data[i].image}" alt="Ảnh sản phẩm" width="100" height="100"></td>  
            <td>${data[i].name}</td>
            <td>${data[i].price}</td>
            <td>${data[i].quantity}</td>
            <td>${data[i].description}</td>
               <td><button type="button" id="editProduct" class="btn btn-warning" onclick="showEditForm(${data[i].id})">Sửa</button></td>
            <td><button type="button" id="deleteProduct" class="btn btn-danger" onclick="deleteProduct(${data[i].id})">Xóa</button></td>
        </tr>`
            }
            document.getElementById("body-table-product").innerHTML = content;
        }
        });
    event.preventDefault();

}
function showEditForm(id) {
    $.ajax({
        type : 'GET',
        url : `http://localhost:8080/products/${id}`,
        success : function (data) {
            $(`#name`).val(data.name);
            $(`#price`).val(data.price);
            $(`#quantity`).val(data.quantity);
            $(`#description`).val(data.description);
            $(`#image`).val(data.image);
            index = data.id;
            document.getElementById("createProduct").hidden = false;
            document.getElementById("submib-create").onclick = function () {
                editProduct()
            };
        }
    });
    event.preventDefault();

}
function editProduct() {
    let inputName= $(`#name`).val();
    let price= $(`#price`).val();
    let quantity= $(`#quantity`).val();
    let description= $(`#description`).val();
    let image= $(`#image`).val();
    let newProduct = {
        name : inputName,
        price : price,
        quantity  : quantity,
        description : description,
        image : image,
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "PUT",
        data: JSON.stringify(newProduct),
        url: `http://localhost:8080/products/${index}`,
        success: function () {
            getAllProducts()
        }
    });
    event.preventDefault();
}
function deleteProduct(id) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/products/${id}`,
        success: function () {
            getAllProducts();
        }
    });
}
function showCreateForm() {
    document.getElementById("createProduct").reset()
    document.getElementById("createProduct").hidden = false;
    document.getElementById("submib-create").onclick = function () {
        createNewProduct();
    }

}
function closeFormCreate() {
    document.getElementById("createProduct").reset()
    document.getElementById("createProduct").hidden = true;
}

getAllProducts();