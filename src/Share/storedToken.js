

export function storeTokenInCookie(token) {
    // document.cookie = `token=${token}; path=/; secure; SameSite=Strict;`;
    localStorage.setItem('Token', token);
}

export function getTokenFromCookie() {
    // const cookieValue = document.cookie.match('(^|;)\\s*token\\s*=\\s*([^;]+)')?.pop() || '';
    // return cookieValue ? decodeURIComponent(cookieValue) : '';
    return localStorage.getItem('Token');
}

export function checkTokenExistsInCookie() {
    const cookieValue = document.cookie.match('(^|;)\\s*token\\s*=\\s*([^;]+)')?.pop() || '';
    return cookieValue !== '';
}
export function clearTokenFromCookie() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; SameSite=Strict;';
}