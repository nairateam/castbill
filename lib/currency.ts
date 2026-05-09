export const CURRENCIES = [
    { code: "NGN", symbol: "₦", label: "Nigerian Naira" },
    { code: "USD", symbol: "$", label: "US Dollar" },
    { code: "GBP", symbol: "£", label: "British Pound" },
    { code: "EUR", symbol: "€", label: "Euro" },
] as const;

export type CurrencyCode = typeof CURRENCIES[number]["code"];

export function getSymbol(code: string): string {
    return CURRENCIES.find(c => c.code === code)?.symbol ?? "₦";
}

export function formatAmount(amount: number, currency: string): string {
    return `${getSymbol(currency)}${Math.abs(amount).toFixed(2)}`;
}

export function fmt(n: number): string {
    return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}