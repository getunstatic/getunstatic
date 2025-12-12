document.addEventListener('DOMContentLoaded', () => {
    const adaptersContainer = document.getElementById('adapters-grid');
    const accessoriesContainer = document.getElementById('accessories-grid');
    const smarthomeContainer = document.getElementById('smarthome-grid');

    if (!adaptersContainer || !accessoriesContainer || !smarthomeContainer) {
        return;
    }

    fetch('products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            products.forEach(product => {
                const productCard = createProductCard(product);
                if (product.category === 'adapters') {
                    adaptersContainer.appendChild(productCard);
                } else if (product.category === 'accessories') {
                    accessoriesContainer.appendChild(productCard);
                } else if (product.category === 'smarthome') {
                    smarthomeContainer.appendChild(productCard);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching or rendering product data:', error);
            adaptersContainer.innerHTML = '<p>Error loading products.</p>';
            accessoriesContainer.innerHTML = '<p>Error loading products.</p>';
            smarthomeContainer.innerHTML = '<p>Error loading products.</p>';
        });
});

function createProductCard(product) {
    const productCardLink = document.createElement('a');
    productCardLink.href = `product.html?id=${product.id}`;
    productCardLink.classList.add('product-card-link');

    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.dataset.id = product.id;

    const productImage = document.createElement('div');
    productImage.classList.add('product-image');

    const productImageEl = document.createElement('img');
    productImageEl.classList.add('product-card-image');
    productImageEl.src = Array.isArray(product.images) ? product.images[product.images.length - 1] : product.image;
    productImageEl.alt = product.name;
    productImage.appendChild(productImageEl);

    const productName = document.createElement('h3');
    productName.textContent = product.name;

    const productDesc = document.createElement('p');
    productDesc.classList.add('product-desc');
    productDesc.textContent = `${product.features[0].substring(0, 100)}...`;

    const productFeatures = document.createElement('ul');
    productFeatures.classList.add('product-features');
    product.features.slice(1, 3).forEach(featureText => {
        const featureItem = document.createElement('li');
        featureItem.textContent = featureText;
        productFeatures.appendChild(featureItem);
    });

    const productFooter = document.createElement('div');
    productFooter.classList.add('product-footer');

    const viewDetailsButton = document.createElement('a');
    viewDetailsButton.href = `product.html?id=${product.id}`;
    viewDetailsButton.classList.add('btn-secondary');
    viewDetailsButton.textContent = 'View Details';

    productFooter.appendChild(viewDetailsButton);

    productCard.appendChild(productImage);
    productCard.appendChild(productName);
    productCard.appendChild(productDesc);
    productCard.appendChild(productFeatures);
    productCard.appendChild(productFooter);

    productCardLink.appendChild(productCard);

    return productCardLink;
}
