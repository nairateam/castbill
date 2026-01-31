export type Client = {
    name: string;
    email?: string;
    address?: string;
    phone?: string;
};

export type InvoiceItem = {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
};

export type Tax = {
    label?: string;
    rate: number;
};

export type InvoiceDates = {
    issuedAt: string;
    dueAt: string;
};

export type InvoiceTotals = {
    subTotal: number;
    taxAmount: number;
    grandTotal: number;
};

export type Invoice = {
    id: string;
    invoiceNumber: string;

    billFrom: Client;
    billTo: Client;

    dates: InvoiceDates;

    items: InvoiceItem[];

    tax?: Tax;
    totals: InvoiceTotals;

    note?: string;
    createdAt: string;
};
