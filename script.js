"use strict";
const apiEndpoint = 'https://fakestoreapi.com/products';
let allProducts = [];
let displayedProducts = [];
const itemsPerPage = 10;
// On page load 
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    document.getElementById('load-more').addEventListener('click', loadMoreProducts);
    document.getElementById('search').addEventListener('input', filterProducts);
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    filterCheckboxes.forEach(checkbox => { checkbox.addEventListener('change', filterProducts); });
    const sortDropdown = document.querySelectorAll('#sort-options');
    sortDropdown.forEach(sort => {
        sort.addEventListener('change', sortProducts);

    });
});
// fetching api data using async and await 
async function fetchProducts() {
    showLoading();
    try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
            throw new Error('Network response was not ok');

        } allProducts = await response.json(); displayedProducts = allProducts.slice(0, itemsPerPage);
        renderProducts();
        toggleLoadMoreButton();
    }
    catch (error) {
        console.error('Error fetching products:', error);
        showError();
    } finally {
        hideLoading();

    }
}
// rendeding products list on UI 
function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    displayedProducts.forEach(product => {
        const truncatedDescription = truncateDescription(product.description, 100);
        const productDiv = document.createElement('div'); productDiv.className = 'product';
        productDiv.innerHTML = ` <img src="${product.image}" alt="${product.title}" /> 
           <p><strong>${product.title}</strong></p> 
           <p>$${product.price}</p> 
           <p class="product-description"> ${truncatedDescription} 
           <span class="tooltip-trigger">...</span> <div class="tooltip hidden">${product.description}</div> </p> `;
        productList.appendChild(productDiv);
        // Add click event for the tooltip trigger 
        const tooltipTrigger = productDiv.querySelector('.tooltip-trigger');
        const tooltip = productDiv.querySelector('.tooltip');
        tooltipTrigger.addEventListener('click', (event) => {
            event.stopPropagation();
            // Hide any visible tooltip before showing the clicked one 
            const visibleTooltips = document.querySelectorAll('.tooltip:not(.hidden)');
            visibleTooltips.forEach(tooltip => { tooltip.classList.add('hidden'); });
            // Position the tooltip 
            const rect = tooltipTrigger.getBoundingClientRect();
            tooltip.style.top = `${rect.bottom + window.scrollY}px`;
            tooltip.style.left = `${rect.left}px`;
            tooltip.classList.toggle('hidden');
        });
    });
    let resultCountElem = document.getElementById('countResult');
    resultCountElem.innerHTML = `<span>${displayedProducts.length} Results</span>`;
}
function truncateDescription(description, maxLength) {
    return description.length > maxLength ? description.slice(0, maxLength) + '...' : description;
}
document.addEventListener('click', () => {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => { tooltip.classList.add('hidden'); });
});
// clicking on load more button 
function loadMoreProducts() {
    const nextBatch = allProducts.slice(displayedProducts.length, displayedProducts.length + itemsPerPage);
    displayedProducts = displayedProducts.concat(nextBatch); renderProducts(); toggleLoadMoreButton();
}
function toggleLoadMoreButton() {
    const loadMoreButton = document.getElementById('load-more');
    if (displayedProducts.length < allProducts.length) { loadMoreButton.style.display = 'block'; } else {
        loadMoreButton.style.display = 'none';
    }
}
// filter products based on category section checkbox 
function filterProducts() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const selectedCategories = Array.from(document.querySelectorAll('.filter-checkbox:checked')).map(checkbox => checkbox.value);
    displayedProducts = allProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategories.length > 0 ? selectedCategories.includes(product.category) : true;
        return matchesSearch && matchesCategory;
    });
    // Reset displayed products to the first itemsPerPage 
    displayedProducts = displayedProducts.slice(0, itemsPerPage); renderProducts();
    toggleLoadMoreButton();
}
// sort the product list based on dropdown option 
function sortProducts() {
    const sortOption = document.getElementById('sort-options').value;
    if (sortOption === 'price-asc') {
        displayedProducts.sort((a, b) => a.price - b.price);

    }
    else if (sortOption === 'price-desc') { displayedProducts.sort((a, b) => b.price - a.price); } renderProducts();
}
// mobile view sidebar functionality 
document.getElementById('toggleFilterSidebar').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar'); sidebar.classList.toggle('hidden');
});
// closing sidebar by clicking on close icon in sidebar 
document.getElementById('closeMenu').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
});
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}
function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}
function showError() {
    document.getElementById('error').classList.remove('hidden');
}
