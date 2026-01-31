import type { Invoice } from "@/types";

export const invoices: Invoice[] = [
    {
        id: "inv_001",
        invoiceNumber: "INV-2026-001",

        billFrom: {
            name: "Undercast Studio",
            email: "hello@undercast.co",
            address: "Lekki Phase 1, Lagos, Nigeria",
            phone: "+234 801 234 5678",
        },

        billTo: {
            name: "Native Brands Ltd",
            email: "billing@nativebrands.co",
            address: "Victoria Island, Lagos, Nigeria",
            phone: "+234 809 876 5432",
        },

        dates: {
            issuedAt: "2026-01-05",
            dueAt: "2026-01-12",
        },

        items: [
            {
                id: "item_1",
                description: "Website Design & Development",
                quantity: 1,
                unitPrice: 350000,
                total: 350000,
            },
            {
                id: "item_2",
                description: "Brand Identity Design",
                quantity: 1,
                unitPrice: 150000,
                total: 150000,
            },
        ],

        tax: {
            label: "VAT",
            rate: 7.5,
        },

        totals: {
            subTotal: 500000,
            taxAmount: 37500,
            grandTotal: 537500,
        },

        note: "Payment is due within 7 days.",
        createdAt: "2026-01-05T09:00:00.000Z",
    },

    {
        id: "inv_002",
        invoiceNumber: "INV-2026-002",

        billFrom: {
            name: "Undercast Studio",
            email: "hello@undercast.co",
            address: "Lekki Phase 1, Lagos, Nigeria",
        },

        billTo: {
            name: "RawCraft Shop",
            email: "orders@rawcraftshop.com",
            address: "Yaba, Lagos, Nigeria",
        },

        dates: {
            issuedAt: "2026-01-10",
            dueAt: "2026-01-20",
        },

        items: [
            {
                id: "item_1",
                description: "E-commerce Website Setup",
                quantity: 1,
                unitPrice: 280000,
                total: 280000,
            },
            {
                id: "item_2",
                description: "Product Upload (20 items)",
                quantity: 20,
                unitPrice: 2500,
                total: 50000,
            },
        ],

        tax: {
            label: "VAT",
            rate: 7.5,
        },

        totals: {
            subTotal: 330000,
            taxAmount: 24750,
            grandTotal: 354750,
        },

        note: "Thanks for choosing us.",
        createdAt: "2026-01-10T11:30:00.000Z",
    },

    {
        id: "inv_003",
        invoiceNumber: "INV-2026-003",

        billFrom: {
            name: "Undercast Studio",
            email: "hello@undercast.co",
            address: "Lekki Phase 1, Lagos, Nigeria",
        },

        billTo: {
            name: "Kinzbell Smart Homes",
            email: "info@kinzbell.com",
            address: "Chevron Drive, Lekki, Lagos",
        },

        dates: {
            issuedAt: "2026-01-15",
            dueAt: "2026-01-30",
        },

        items: [
            {
                id: "item_1",
                description: "Smart Home Automation Setup",
                quantity: 1,
                unitPrice: 650000,
                total: 650000,
            },
        ],

        tax: {
            label: "VAT",
            rate: 7.5,
        },

        totals: {
            subTotal: 650000,
            taxAmount: 48750,
            grandTotal: 698750,
        },

        note: "Installation completed successfully.",
        createdAt: "2026-01-15T14:45:00.000Z",
    },
    {
        id: "inv_001",
        invoiceNumber: "INV-2026-001",

        billFrom: {
            name: "Undercast Studio",
            email: "hello@undercast.co",
            address: "Lekki Phase 1, Lagos, Nigeria",
            phone: "+234 801 234 5678",
        },

        billTo: {
            name: "Native Brands Ltd",
            email: "billing@nativebrands.co",
            address: "Victoria Island, Lagos, Nigeria",
            phone: "+234 809 876 5432",
        },

        dates: {
            issuedAt: "2026-01-05",
            dueAt: "2026-01-12",
        },

        items: [
            {
                id: "item_1",
                description: "Website Design & Development",
                quantity: 1,
                unitPrice: 350000,
                total: 350000,
            },
            {
                id: "item_2",
                description: "Brand Identity Design",
                quantity: 1,
                unitPrice: 150000,
                total: 150000,
            },
        ],

        tax: {
            label: "VAT",
            rate: 7.5,
        },

        totals: {
            subTotal: 500000,
            taxAmount: 37500,
            grandTotal: 537500,
        },

        note: "Payment is due within 7 days.",
        createdAt: "2026-01-05T09:00:00.000Z",
    },

    {
        id: "inv_002",
        invoiceNumber: "INV-2026-002",

        billFrom: {
            name: "Undercast Studio",
            email: "hello@undercast.co",
            address: "Lekki Phase 1, Lagos, Nigeria",
        },

        billTo: {
            name: "RawCraft Shop",
            email: "orders@rawcraftshop.com",
            address: "Yaba, Lagos, Nigeria",
        },

        dates: {
            issuedAt: "2026-01-10",
            dueAt: "2026-01-20",
        },

        items: [
            {
                id: "item_1",
                description: "E-commerce Website Setup",
                quantity: 1,
                unitPrice: 280000,
                total: 280000,
            },
            {
                id: "item_2",
                description: "Product Upload (20 items)",
                quantity: 20,
                unitPrice: 2500,
                total: 50000,
            },
        ],

        tax: {
            label: "VAT",
            rate: 7.5,
        },

        totals: {
            subTotal: 330000,
            taxAmount: 24750,
            grandTotal: 354750,
        },

        note: "Thanks for choosing us.",
        createdAt: "2026-01-10T11:30:00.000Z",
    },

    {
        id: "inv_003",
        invoiceNumber: "INV-2026-003",

        billFrom: {
            name: "Undercast Studio",
            email: "hello@undercast.co",
            address: "Lekki Phase 1, Lagos, Nigeria",
        },

        billTo: {
            name: "Kinzbell Smart Homes",
            email: "info@kinzbell.com",
            address: "Chevron Drive, Lekki, Lagos",
        },

        dates: {
            issuedAt: "2026-01-15",
            dueAt: "2026-01-30",
        },

        items: [
            {
                id: "item_1",
                description: "Smart Home Automation Setup",
                quantity: 1,
                unitPrice: 650000,
                total: 650000,
            },
        ],

        tax: {
            label: "VAT",
            rate: 7.5,
        },

        totals: {
            subTotal: 650000,
            taxAmount: 48750,
            grandTotal: 698750,
        },

        note: "Installation completed successfully.",
        createdAt: "2026-01-15T14:45:00.000Z",
    },
    {
        id: "inv_001",
        invoiceNumber: "INV-2026-001",

        billFrom: {
            name: "Undercast Studio",
            email: "hello@undercast.co",
            address: "Lekki Phase 1, Lagos, Nigeria",
            phone: "+234 801 234 5678",
        },

        billTo: {
            name: "Native Brands Ltd",
            email: "billing@nativebrands.co",
            address: "Victoria Island, Lagos, Nigeria",
            phone: "+234 809 876 5432",
        },

        dates: {
            issuedAt: "2026-01-05",
            dueAt: "2026-01-12",
        },

        items: [
            {
                id: "item_1",
                description: "Website Design & Development",
                quantity: 1,
                unitPrice: 350000,
                total: 350000,
            },
            {
                id: "item_2",
                description: "Brand Identity Design",
                quantity: 1,
                unitPrice: 150000,
                total: 150000,
            },
        ],

        tax: {
            label: "VAT",
            rate: 7.5,
        },

        totals: {
            subTotal: 500000,
            taxAmount: 37500,
            grandTotal: 537500,
        },

        note: "Payment is due within 7 days.",
        createdAt: "2026-01-05T09:00:00.000Z",
    },

    {
        id: "inv_002",
        invoiceNumber: "INV-2026-002",

        billFrom: {
            name: "Undercast Studio",
            email: "hello@undercast.co",
            address: "Lekki Phase 1, Lagos, Nigeria",
        },

        billTo: {
            name: "RawCraft Shop",
            email: "orders@rawcraftshop.com",
            address: "Yaba, Lagos, Nigeria",
        },

        dates: {
            issuedAt: "2026-01-10",
            dueAt: "2026-01-20",
        },

        items: [
            {
                id: "item_1",
                description: "E-commerce Website Setup",
                quantity: 1,
                unitPrice: 280000,
                total: 280000,
            },
            {
                id: "item_2",
                description: "Product Upload (20 items)",
                quantity: 20,
                unitPrice: 2500,
                total: 50000,
            },
        ],

        tax: {
            label: "VAT",
            rate: 7.5,
        },

        totals: {
            subTotal: 330000,
            taxAmount: 24750,
            grandTotal: 354750,
        },

        note: "Thanks for choosing us.",
        createdAt: "2026-01-10T11:30:00.000Z",
    },

    {
        id: "inv_003",
        invoiceNumber: "INV-2026-003",

        billFrom: {
            name: "Undercast Studio",
            email: "hello@undercast.co",
            address: "Lekki Phase 1, Lagos, Nigeria",
        },

        billTo: {
            name: "Kinzbell Smart Homes",
            email: "info@kinzbell.com",
            address: "Chevron Drive, Lekki, Lagos",
        },

        dates: {
            issuedAt: "2026-01-15",
            dueAt: "2026-01-30",
        },

        items: [
            {
                id: "item_1",
                description: "Smart Home Automation Setup",
                quantity: 1,
                unitPrice: 650000,
                total: 650000,
            },
        ],

        tax: {
            label: "VAT",
            rate: 7.5,
        },

        totals: {
            subTotal: 650000,
            taxAmount: 48750,
            grandTotal: 698750,
        },

        note: "Installation completed successfully.",
        createdAt: "2026-01-15T14:45:00.000Z",
    },
];
