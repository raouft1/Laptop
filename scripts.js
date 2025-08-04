
const apiURL = 'https://script.google.com/macros/s/YOUR_API_URL/exec'; // ضع رابط API هنا
let data = [];

fetch(apiURL)
    .then(response => response.json())
    .then(fetchedData => {
        data = fetchedData;
        populateCategories();
        displayProducts('all');
    });

function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    let categories = new Set(data.map(p => p['الصنف']));
    categories.forEach(cat => {
        let option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

function displayProducts(filter, searchTerm = '') {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    data.filter(p => (filter === 'all' || p['الصنف'] === filter) &&
                     (p['اسم المنتج'].includes(searchTerm) || p['الوصف'].includes(searchTerm)))
        .forEach(product => {
            let div = document.createElement('div');
            div.className = 'product';
            div.innerHTML = `
                <img src="${product['رابط الصورة']}" alt="${product['اسم المنتج']}">
                <h3>${product['اسم المنتج']}</h3>
                <p>${product['الوصف']}</p>
                <p>السعر: ${product['السعر']} دج</p>
            `;
            container.appendChild(div);
        });
}

document.getElementById('categoryFilter').addEventListener('change', function() {
    displayProducts(this.value, document.getElementById('searchInput').value);
});

document.getElementById('searchInput').addEventListener('input', function() {
    displayProducts(document.getElementById('categoryFilter').value, this.value);
});

document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const productData = {
        name: document.getElementById('name').value,
        price: document.getElementById('price').value,
        desc: document.getElementById('desc').value,
        image: document.getElementById('image').value,
        category: document.getElementById('category').value
    };

    fetch(apiURL, {
        method: 'POST',
        body: JSON.stringify(productData),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.text())
    .then(result => {
        document.getElementById('addStatus').innerText = result;
        alert("تمت إضافة المنتج، قم بتحديث الصفحة لرؤيته");
    })
    .catch(error => {
        document.getElementById('addStatus').innerText = 'حدث خطأ';
        console.error('Error!', error.message);
    });
});
