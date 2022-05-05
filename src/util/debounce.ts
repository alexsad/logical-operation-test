function debounce<T>(callback: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return (...args: T[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(function () { callback.apply(null, args); }, wait);
    };
}

export {debounce};