document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('product-detail-container');
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (productId) {
            fetch('data/products.json')
                .then(response => response.json())
                .then(products => {
                    const product = products.find(p => p.id === productId);
                    if (product) {
                        document.title = product.name;

                        let imagesToDisplay = [];
                        if (product.images && Array.isArray(product.images)) {
                            imagesToDisplay = product.images;
                        } else if (product.image) {
                            imagesToDisplay = [product.image];
                        }

                        let imageHtml = '';
                        if (imagesToDisplay.length > 0) {
                            imageHtml = `
                                <div class="product-image-gallery">
                                    <div class="gallery-main-image">
                                        <img src="${imagesToDisplay[0]}" alt="${product.name}">
                                        <div class="gallery-controls">
                                            <button class="prev-btn">&lt;</button>
                                            <button class="next-btn">&gt;</button>
                                        </div>
                                        <div class="gallery-counter">1 / ${imagesToDisplay.length}</div>
                                    </div>
                                    <div class="gallery-thumbnails product-gallery-thumbnail">
                                        ${imagesToDisplay.map((image, index) => `<img src="${image}" alt="${product.name}" class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">`).join('')}
                                    </div>
                                </div>
                            `;
                        } else {
                            imageHtml = `<p>No images available for this product.</p>`;
                        }

                        let specsHtml = '';
                        if (product.variations) {
                            specsHtml = `
                                <div class="product-variations">
                                    <div class="variation-tabs">
                                        ${product.variations.map((variation, index) => `
                                            <button class="variation-tab ${index === 0 ? 'active' : ''}" data-index="${index}">${variation.name}</button>
                                        `).join('')}
                                    </div>
                                    <div class="variation-content">
                                        ${product.variations.map((variation, index) => `
                                            <div class="variation-pane ${index === 0 ? 'active' : ''}" data-index="${index}">
                                                <table>
                                                    ${Object.entries(variation.specs).map(([key, value]) => `
                                                        <tr>
                                                            <th>${key}</th>
                                                            <td>${value}</td>
                                                        </tr>
                                                    `).join('')}
                                                </table>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        } else if (product.specs) {
                            specsHtml = `
                                <table>
                                    ${Object.entries(product.specs).map(([key, value]) => {
                                        if (typeof value === 'object') {
                                            return `
                                                <tr>
                                                    <th colspan="2">${key}</th>
                                                </tr>
                                                ${Object.entries(value).map(([subKey, subValue]) => `
                                                    <tr>
                                                        <td>${subKey}</td>
                                                        <td>${subValue}</td>
                                                    </tr>
                                                `).join('')}
                                            `;
                                        } else {
                                            return `
                                                <tr>
                                                    <th>${key}</th>
                                                    <td>${value}</td>
                                                </tr>
                                            `;
                                        }
                                    }).join('')}
                                </table>
                            `;
                        }

                        container.innerHTML = `
                            <div class="product-detail-grid">
                                <div class="product-detail-image">
                                    ${imageHtml}
                                </div>
                                <div class="product-detail-info">
                                    <h1>${product.name}</h1>
                                    <h2>Main Technical Features：</h2>
                                    <ul class="features-list">
                                        ${product.features.map((feature, index) => `<li class="feature-item ${index >= 5 ? 'hidden' : ''}">${feature}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>

                            <div class="product-detail-specs">
                                <h2>Details</h2>
                                ${specsHtml}
                            </div>
                        `;

                        if (imagesToDisplay.length > 0) {
                            const mainImage = document.querySelector('.gallery-main-image img');
                            const thumbnails = document.querySelectorAll('.gallery-thumbnails .thumbnail');
                            const lightbox = document.getElementById('lightbox');
                            const lightboxImg = document.getElementById('lightbox-img');
                            const closeLightbox = document.querySelector('.close-lightbox');
                            const prevBtn = document.querySelector('.prev-btn');
                            const nextBtn = document.querySelector('.next-btn');
                            const galleryCounter = document.querySelector('.gallery-counter');

                            let currentIndex = 0;

                            function updateGallery() {
                                mainImage.src = imagesToDisplay[currentIndex];
                                thumbnails.forEach((t, index) => {
                                    if (index === currentIndex) {
                                        t.classList.add('active');
                                    } else {
                                        t.classList.remove('active');
                                    }
                                });
                                galleryCounter.textContent = `${currentIndex + 1} / ${imagesToDisplay.length}`;
                            }

                            mainImage.addEventListener('click', () => {
                                lightbox.style.display = 'block';
                                lightboxImg.src = mainImage.src;
                            });

                            closeLightbox.addEventListener('click', () => {
                                lightbox.style.display = 'none';
                            });

                            prevBtn.addEventListener('click', () => {
                                currentIndex = (currentIndex - 1 + imagesToDisplay.length) % imagesToDisplay.length;
                                updateGallery();
                            });

                            nextBtn.addEventListener('click', () => {
                                currentIndex = (currentIndex + 1) % imagesToDisplay.length;
                                updateGallery();
                            });

                            thumbnails.forEach((thumbnail, index) => {
                                thumbnail.addEventListener('click', () => {
                                    currentIndex = index;
                                    updateGallery();
                                });
                            });


                        }

                        if (product.variations) {
                            const tabs = document.querySelectorAll('.variation-tab');
                            const panes = document.querySelectorAll('.variation-pane');

                            tabs.forEach((tab, index) => {
                                tab.addEventListener('click', () => {
                                    tabs.forEach(t => t.classList.remove('active'));
                                    tab.classList.add('active');
                                    panes.forEach(p => p.classList.remove('active'));
                                    panes[index].classList.add('active');
                                });
                            });
                        }

                        const showMoreFeaturesBtn = document.querySelector('.show-more-features');
                        if (showMoreFeaturesBtn) {
                            showMoreFeaturesBtn.addEventListener('click', () => {
                                const hiddenFeatures = document.querySelectorAll('.features-list .feature-item.hidden');
                                hiddenFeatures.forEach(feature => {
                                    feature.classList.remove('hidden');
                                });
                                showMoreFeaturesBtn.style.display = 'none';
                            });
                        }
                    } else {
                        container.innerHTML = '<p>Product not found.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching product data:', error);
                    container.innerHTML = '<p>Error loading product data.</p>';
                });
        } else {
            container.innerHTML = '<p>No product selected.</p>';
        }
    });