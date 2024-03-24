export function yearMonthFormat(date: string) {
    const dateObj = new Date(date);
    return `${dateObj.toLocaleString('default', { month: "long" })} ${dateObj.getFullYear()}`
}

export function formatDateSince(date: string) {
    const dateObj = new Date(date);
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years) return yearMonthFormat(date);
    if (months) return `${months}m`;
    if (days) return `${days}d`;
    if (hours) return `${hours}h`;
    if (minutes) return `${minutes}m`;
    if (seconds) return `${seconds}s`;
    return "now"
}