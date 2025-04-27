export type AlertMessage = {
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
    title?: string;
};