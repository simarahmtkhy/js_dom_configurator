/**
 * Identifies the current page based on the URL path or other criteria.
 * @returns {string|null} - The identified page, or null if no specific page is identified.
 */
export function identifyPage() {
    if (window.location.pathname.includes('list')) {
        return 'list';
    }
    if (window.location.pathname.includes('details')) {
        return 'details';
    }
    if (window.location.pathname.includes('cart')) {
        return 'cart';
    }
    return null; // Return null if no specific page is identified
}