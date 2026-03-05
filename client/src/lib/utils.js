import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'

export function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
}

export function formatLastSeen(date) {
    if (!date) return "Offline";
    const d = new Date(date);

    if (Date.now() - d.getTime() < 60000) return "Active just now";
    if (Date.now() - d.getTime() < 3600000) return `Active ${formatDistanceToNow(d)} ago`;

    if (isToday(d)) return `Last seen today at ${format(d, 'HH:mm')}`;
    if (isYesterday(d)) return `Last seen yesterday at ${format(d, 'HH:mm')}`;

    return `Last seen on ${format(d, 'MMM dd, yyyy')}`;
}