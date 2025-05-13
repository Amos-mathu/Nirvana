class QuoteManager {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
        this.currentQuote = null;
        this.apiUrl = 'https://api.quotable.io/random';
        this.fallbackQuotes = {
            motivational: [
                { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
                { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
            ],
            love: [
                { content: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
                { content: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
                { content: "Where there is love there is life.", author: "Mahatma Gandhi" }
            ],
            peace: [
                { content: "Peace begins with a smile.", author: "Mother Teresa" },
                { content: "Peace is not absence of conflict, it is the ability to handle conflict by peaceful means.", author: "Ronald Reagan" },
                { content: "Peace comes from within. Do not seek it without.", author: "Buddha" }
            ],
            zen: [
                { content: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
                { content: "In the beginner's mind there are many possibilities, in the expert's mind there are few.", author: "Shunryu Suzuki" },
                { content: "When you realize nothing is lacking, the whole world belongs to you.", author: "Lao Tzu" }
            ]
        };
        this.initializeElements();
        this.attachEventListeners();
        this.renderFavorites();
    }

    initializeElements() {
        this.quoteText = document.getElementById('quoteText');
        this.quoteAuthor = document.getElementById('quoteAuthor');
        this.categorySelect = document.getElementById('quoteCategory');
        this.getQuoteBtn = document.getElementById('getQuote');
        this.addToFavoritesBtn = document.getElementById('addToFavorites');
        this.favoritesList = document.getElementById('favoritesList');
    }

    attachEventListeners() {
        this.getQuoteBtn.addEventListener('click', () => this.fetchQuote());
        this.addToFavoritesBtn.addEventListener('click', () => this.addToFavorites());
    }    async fetchQuote() {
        try {
            const category = this.categorySelect.value;
            const response = await fetch(`${this.apiUrl}?tags=${category}`);
            const data = await response.json();
            
            this.currentQuote = data;
            this.quoteText.textContent = data.content;
            this.quoteAuthor.textContent = data.author;
            
            // Enable add to favorites button
            this.addToFavoritesBtn.disabled = false;
        } catch (error) {
            console.error('Error fetching quote:', error);
            // Use fallback quotes when API fails
            const category = this.categorySelect.value;
            const quotes = this.fallbackQuotes[category];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            
            this.currentQuote = { ...randomQuote, _id: Date.now().toString() };
            this.quoteText.textContent = randomQuote.content;
            this.quoteAuthor.textContent = randomQuote.author;
            this.addToFavoritesBtn.disabled = false;
        }
    }

    addToFavorites() {
        if (!this.currentQuote) {
            this.showToast('Please generate a quote first!');
            return;
        }

        // Check for duplicates
        const isDuplicate = this.favorites.some(q => q._id === this.currentQuote._id || 
            (q.content === this.currentQuote.content && q.author === this.currentQuote.author));
        if (isDuplicate) {
            this.showToast('This quote is already in your favorites!');
            return;
        }

        // Add unique ID if not present
        if (!this.currentQuote._id) {
            this.currentQuote._id = Date.now().toString();
        }

        this.favorites.push(this.currentQuote);
        localStorage.setItem('favoriteQuotes', JSON.stringify(this.favorites));
        this.renderFavorites();
        this.showToast('Quote added to favorites!');
    }

    removeFromFavorites(id) {
        this.favorites = this.favorites.filter(quote => quote._id !== id);
        localStorage.setItem('favoriteQuotes', JSON.stringify(this.favorites));
        this.renderFavorites();
    }    renderFavorites() {
        this.favoritesList.innerHTML = '';
        
        if (this.favorites.length === 0) {
            this.favoritesList.innerHTML = `
                <div class="text-center text-muted p-4">
                    <i class="fas fa-heart-broken fa-2x mb-3"></i>
                    <p>No favorite quotes yet. Generate and save some quotes to see them here!</p>
                </div>
            `;
            return;
        }
        
        this.favorites.forEach((quote, index) => {
            const quoteCard = document.createElement('div');
            quoteCard.className = 'quote-card';
            quoteCard.setAttribute('data-aos', 'fade-up');
            quoteCard.setAttribute('data-aos-delay', (index * 100).toString());
            quoteCard.innerHTML = `
                <blockquote class="blockquote mb-0">
                    <p>${quote.content}</p>
                    <footer class="blockquote-footer">${quote.author}</footer>
                </blockquote>
                <div class="quote-actions mt-3">
                    <button class="btn btn-sm btn-outline-danger" onclick="quoteManager.removeFromFavorites('${quote._id}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                    <button class="btn btn-sm btn-outline-primary ms-2" onclick="quoteManager.shareQuote('${encodeURIComponent(quote.content)}', '${encodeURIComponent(quote.author)}')">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>
            `;
            this.favoritesList.appendChild(quoteCard);
        });
    }

    shareQuote(content, author) {
        const text = `"${decodeURIComponent(content)}" - ${decodeURIComponent(author)}`;
        const shareData = {
            title: 'Inspirational Quote',
            text: text,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData)
                .catch(() => {
                    // Fallback to clipboard if share fails
                    this.copyToClipboard(text);
                });
        } else {
            // Fallback for browsers that don't support sharing
            this.copyToClipboard(text);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                this.showToast('Quote copied to clipboard!');
            })
            .catch(() => {
                this.showToast('Failed to copy quote. Please try again.');
            });
    }

    showToast(message) {
        // Create and show a Bootstrap toast
        const toastContainer = document.createElement('div');
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '11';
        
        toastContainer.innerHTML = `
            <div class="toast" role="alert">
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        document.body.appendChild(toastContainer);
        const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
        toast.show();
        
        // Remove the toast container after it's hidden
        toastContainer.querySelector('.toast').addEventListener('hidden.bs.toast', () => {
            document.body.removeChild(toastContainer);
        });
    }
}

// Initialize the quote manager
const quoteManager = new QuoteManager();
