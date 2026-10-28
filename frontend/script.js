"use strict";

/* ========================================
   1. SAMPLE PRODUCT DATA
======================================== */

let products = [
    {
        id: 1,
        name: "Cotton T-Shirt",
        description: "Comfortable everyday cotton T-shirt.",
        price: 399,
        category: "Clothing",
        stockQuantity: 20,
        imageUrl: "https://placehold.co/600x400/e0f2fe/1e40af?text=Cotton+T-Shirt"
    },
    {
        id: 2,
        name: "Wireless Earphones",
        description: "Wireless earphones for music and calls.",
        price: 1299,
        category: "Electronics",
        stockQuantity: 12,
        imageUrl: "https://placehold.co/600x400/f3e8ff/6b21a8?text=Earphones"
    },
    {
        id: 3,
        name: "Water Bottle",
        description: "Reusable bottle for everyday use.",
        price: 249,
        category: "Home",
        stockQuantity: 30,
        imageUrl: "https://placehold.co/600x400/dcfce7/166534?text=Water+Bottle"
    },
    {
        id: 4,
        name: "Notebook",
        description: "A notebook for notes, ideas, and planning.",
        price: 99,
        category: "Stationery",
        stockQuantity: 50,
        imageUrl: "https://placehold.co/600x400/fef3c7/92400e?text=Notebook"
    },
    {
        id: 5,
        name: "Backpack",
        description: "A practical backpack for college and travel.",
        price: 899,
        category: "Accessories",
        stockQuantity: 8,
        imageUrl: "https://placehold.co/600x400/fee2e2/991b1b?text=Backpack"
    },
    {
        id: 6,
        name: "Desk Lamp",
        description: "A compact lamp for your study table.",
        price: 599,
        category: "Home",
        stockQuantity: 0,
        imageUrl: "https://placehold.co/600x400/e2e8f0/334155?text=Desk+Lamp"
    }
];

/* ========================================
   2. SELECT HTML ELEMENTS
======================================== */

const productList = document.getElementById("product-list");
const productCount = document.getElementById("product-count");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const emptyState = document.getElementById("empty-state");

const productForm = document.getElementById("product-form");
const productIdInput = document.getElementById("product-id");
const productNameInput = document.getElementById("product-name");
const productDescriptionInput = document.getElementById("product-description");
const productPriceInput = document.getElementById("product-price");
const productStockInput = document.getElementById("product-stock");
const productCategoryInput = document.getElementById("product-category");
const productImageInput = document.getElementById("product-image");

const formTitle = document.getElementById("form-title");
const saveProductButton = document.getElementById("save-product-button");
const cancelEditButton = document.getElementById("cancel-edit-button");
const formMessage = document.getElementById("form-message");
const managementList = document.getElementById("management-list");
const currentYear = document.getElementById("current-year");

/* ========================================
   3. HELPER FUNCTIONS
======================================== */

// Escape user-provided text before inserting it into HTML.
function escapeHTML(value) {
    const characters = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    return String(value).replace(/[&<>"']/g, character => {
        return characters[character];
    });
}

// Only allow HTTP and HTTPS URLs for product images.
function getSafeImageURL(value) {
    if (typeof value !== "string" || !value.trim()) {
        return "";
    }

    try {
        const url = new URL(value.trim());

        if (url.protocol === "https:" || url.protocol === "http:") {
            return url.href;
        }
    } catch {
        return "";
    }

    return "";
}

// Display prices in Indian rupees.
function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(price);
}

// Display a message beneath the product form.
function showFormMessage(message, type = "") {
    formMessage.textContent = message;
    formMessage.className = "form-message";

    if (type) {
        formMessage.classList.add(type);
    }
}

// Return the next available sample product ID.
function getNextProductId() {
    return products.reduce((highest, product) => {
        return Math.max(highest, product.id);
    }, 0) + 1;
}

/* ========================================
   4. CATEGORY FILTER
======================================== */

function renderCategoryOptions() {
    const selectedCategory = categoryFilter.value || "all";

    const categories = [
        ...new Set(
            products
                .map(product => product.category)
                .filter(category => category.trim() !== "")
        )
    ].sort((a, b) => a.localeCompare(b));

    categoryFilter.replaceChildren();

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Categories";
    categoryFilter.appendChild(allOption);

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    categoryFilter.value = categories.includes(selectedCategory)
        ? selectedCategory
        : "all";
}

/* ========================================
   5. DISPLAY PRODUCT CARDS
======================================== */

function renderProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredProducts = products.filter(product => {
        const matchesName = product.name
            .toLowerCase()
            .includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesName && matchesCategory;
    });

    productCount.textContent =
        `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"}`;

    productList.setAttribute("aria-busy", "false");

    if (filteredProducts.length === 0) {
        productList.replaceChildren();
        emptyState.hidden = false;
        return;
    }

    emptyState.hidden = true;

    productList.innerHTML = filteredProducts.map(product => {
        const imageURL = getSafeImageURL(product.imageUrl);

        const stockLabel = product.stockQuantity > 0
            ? `${product.stockQuantity} in stock`
            : "Out of stock";

        const stockClass = product.stockQuantity > 0
            ? "in-stock"
            : "out-of-stock";

        const imageMarkup = imageURL
            ? `<img
                    class="product-image"
                    src="${escapeHTML(imageURL)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                    data-product-image
                >`
            : `<div class="product-image-placeholder" aria-hidden="true">🛍️</div>`;

        return `
            <article class="product-card">
                ${imageMarkup}

                <div class="product-info">
                    <span class="product-category">
                        ${escapeHTML(product.category)}
                    </span>

                    <h3 class="product-name">
                        ${escapeHTML(product.name)}
                    </h3>

                    <p class="product-description">
                        ${escapeHTML(product.description || "No description available.")}
                    </p>

                    <div class="product-bottom">
                        <span class="product-price">
                            ${formatPrice(product.price)}
                        </span>

                        <span class="stock-status ${stockClass}">
                            ${stockLabel}
                        </span>
                    </div>
                </div>
            </article>
        `;
    }).join("");

    // Show a fallback if a product image cannot be loaded.
    productList.querySelectorAll("[data-product-image]").forEach(image => {
        image.addEventListener("error", () => {
            const placeholder = document.createElement("div");
            placeholder.className = "product-image-placeholder";
            placeholder.setAttribute("aria-hidden", "true");
            placeholder.textContent = "🛍️";

            image.replaceWith(placeholder);
        }, { once: true });
    });
}

/* ========================================
   6. DISPLAY MANAGEMENT LIST
======================================== */

function renderManagementList() {
    if (products.length === 0) {
        managementList.innerHTML =
            '<p class="loading-message">No products have been added yet.</p>';
        return;
    }

    managementList.innerHTML = products.map(product => {
        return `
            <div class="management-item">
                <div class="management-item-info">
                    <p class="management-item-name">
                        ${escapeHTML(product.name)}
                    </p>

                    <p class="management-item-price">
                        ${formatPrice(product.price)}
                        &middot;
                        Stock: ${product.stockQuantity}
                    </p>
                </div>

                <div class="management-item-actions">
                    <button
                        type="button"
                        class="button-small"
                        data-action="edit"
                        data-id="${product.id}"
                        aria-label="Edit ${escapeHTML(product.name)}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="button-small button-delete"
                        data-action="delete"
                        data-id="${product.id}"
                        aria-label="Delete ${escapeHTML(product.name)}"
                    >
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

/* ========================================
   7. REFRESH THE INTERFACE
======================================== */

function refreshInterface() {
    renderCategoryOptions();
    renderProducts();
    renderManagementList();
}

/* ========================================
   8. RESET THE PRODUCT FORM
======================================== */

function resetProductForm() {
    productForm.reset();

    productIdInput.value = "";
    productStockInput.value = "0";

    formTitle.textContent = "Add a New Product";
    saveProductButton.textContent = "Add Product";
    cancelEditButton.hidden = true;

    showFormMessage("");
}

/* ========================================
   9. VALIDATE PRODUCT INPUT
======================================== */

function getValidatedProduct() {
    const name = productNameInput.value.trim();
    const description = productDescriptionInput.value.trim();
    const category = productCategoryInput.value.trim();
    const imageUrl = productImageInput.value.trim();

    const priceText = productPriceInput.value;
    const stockText = productStockInput.value;

    const price = Number(priceText);
    const stockQuantity = Number(stockText);

    if (!name || !category || priceText === "" || stockText === "") {
        throw new Error("Please complete all required fields.");
    }

    if (name.length > 100) {
        throw new Error("Product name cannot exceed 100 characters.");
    }

    if (category.length > 50) {
        throw new Error("Category cannot exceed 50 characters.");
    }

    if (description.length > 1000) {
        throw new Error("Description cannot exceed 1000 characters.");
    }

    if (
        !Number.isFinite(price) ||
        price < 0 ||
        price > 99999999.99 ||
        Math.round(price * 100) / 100 !== price
    ) {
        throw new Error("Enter a valid price with up to two decimal places.");
    }

    if (
        !Number.isSafeInteger(stockQuantity) ||
        stockQuantity < 0 ||
        stockQuantity > 2147483647
    ) {
        throw new Error("Stock must be a valid non-negative whole number.");
    }

    if (imageUrl && !getSafeImageURL(imageUrl)) {
        throw new Error("Enter a valid image URL beginning with http:// or https://.");
    }

    return {
        name,
        description,
        price,
        category,
        stockQuantity,
        imageUrl
    };
}

/* ========================================
   10. ADD OR UPDATE A PRODUCT
======================================== */

productForm.addEventListener("submit", event => {
    event.preventDefault();

    try {
        const productData = getValidatedProduct();
        const existingId = productIdInput.value;

        if (existingId) {
            const product = products.find(item => {
                return item.id === Number(existingId);
            });

            if (!product) {
                throw new Error("This product no longer exists.");
            }

            Object.assign(product, productData);

            showFormMessage("Product updated successfully.", "success");
        } else {
            products.push({
                id: getNextProductId(),
                ...productData
            });

            showFormMessage("Product added successfully.", "success");
        }

        refreshInterface();
        resetProductForm();
    } catch (error) {
        showFormMessage(
            error instanceof Error
                ? error.message
                : "Something went wrong. Please try again.",
            "error"
        );
    }
});

/* ========================================
   11. EDIT AN EXISTING PRODUCT
======================================== */

function editProduct(id) {
    const product = products.find(item => item.id === id);

    if (!product) {
        showFormMessage("Product not found.", "error");
        return;
    }

    productIdInput.value = String(product.id);
    productNameInput.value = product.name;
    productDescriptionInput.value = product.description;
    productPriceInput.value = String(product.price);
    productStockInput.value = String(product.stockQuantity);
    productCategoryInput.value = product.category;
    productImageInput.value = product.imageUrl;

    formTitle.textContent = "Edit Product";
    saveProductButton.textContent = "Save Changes";
    cancelEditButton.hidden = false;

    showFormMessage("Update the details and save your changes.");

    document.getElementById("manage-products").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    productNameInput.focus({ preventScroll: true });
}

/* ========================================
   12. DELETE A PRODUCT
======================================== */

function deleteProduct(id) {
    const product = products.find(item => item.id === id);

    if (!product) {
        showFormMessage("Product not found.", "error");
        return;
    }

    const confirmed = window.confirm(
        `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
        return;
    }

    products = products.filter(item => item.id !== id);

    if (Number(productIdInput.value) === id) {
        resetProductForm();
    }

    refreshInterface();
    showFormMessage("Product deleted successfully.", "success");
}

/* ========================================
   13. HANDLE MANAGEMENT BUTTONS
======================================== */

managementList.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button || !managementList.contains(button)) {
        return;
    }

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (!Number.isSafeInteger(id)) {
        showFormMessage("Invalid product identifier.", "error");
        return;
    }

    if (action === "edit") {
        editProduct(id);
    } else if (action === "delete") {
        deleteProduct(id);
    }
});

/* ========================================
   14. SEARCH AND CATEGORY FILTER EVENTS
======================================== */

searchInput.addEventListener("input", renderProducts);

categoryFilter.addEventListener("change", renderProducts);

/* ========================================
   15. CANCEL EDITING
======================================== */

cancelEditButton.addEventListener("click", resetProductForm);

/* ========================================
   16. INITIALIZE THE APPLICATION
======================================== */

function initializeApp() {
    currentYear.textContent = new Date().getFullYear();

    refreshInterface();

    console.log("Small Shop Product Catalog initialized successfully.");
}

initializeApp();