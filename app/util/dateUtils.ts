// Date formatting utilities to avoid hydration mismatches
export const formatDate = (dateString?: string | null): string => {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);

        // Use a consistent format that doesn't depend on locale
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

export const formatDateLong = (dateString?: string | null): string => {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);

        // Use a consistent format that doesn't depend on locale
        const day = date.getDate();
        const monthNames = [
            'tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
            'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'
        ];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month}, ${year}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

export const formatDateTime = (dateString?: string | null): string => {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);

        // Use a consistent format that doesn't depend on locale
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};