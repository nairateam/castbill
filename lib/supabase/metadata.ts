import { Metadata } from 'next';

const title = 'Castbill';
const description =
    'CastBill is a full-stack invoice management platform built with Next.js and Supabase, featuring email authentication, real-time database updates, invoice generation, and a user-friendly dashboard for managing clients and payments.';
export const url = 'https://castbill.vercel.app/';

const keywords = [
    'invoice generator',
    'invoicing software',
    'online invoice',
    'create invoice',
    'invoice maker',
    'billing software',
    'invoice management',
    'digital invoicing',
    'freelancer invoice',
    'small business invoicing',
    'contractor billing',
    'consultant invoice',
    'self-employed invoicing',
    'send invoice email',
    'PDF invoice',
    'invoice tracking',
    'payment tracking',
    'invoice templates',
    'custom invoices',
    'professional invoices',
    'invoice automation',
    'generate invoice online',
    'email invoice to client',
    'track payments',
    'manage clients',
    'invoice history',
    'free invoice software',
    'simple invoicing',
    'fast invoice creation',
    'easy billing',
    'invoice online free',
    'NextJS invoice app',
    'web-based invoicing',
    'cloud invoice software',
    'invoice SaaS',
];

export const metaDataOptions: Metadata = {
    generator: 'Next.js',
    applicationName: 'Castbill',
    referrer: 'origin-when-cross-origin',
    keywords,
    authors: [{ name: 'Oluwafemi Onabule', url: 'https://twitter.com/dev_femi' }],
    creator: 'Oluwafemi Onabule',
    publisher: 'Oluwafemi Onabule',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title,
        description,
        url,
        siteName: 'Castbill',
        images: [
            {
                url: '/opengraph-image.png',
                width: 800,
                height: 600,
            },
            {
                url: '/opengraph-image.png',
                width: 1800,
                height: 1600,
                alt: 'Castbill',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    icons: {
        icon: '/favicon.png',
        shortcut: '/favicon.png',
        apple: '/favicon.png',
        other: {
            rel: 'apple-touch-icon-precomposed',
            url: '/favicon.png',
        },
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: '@dev_femi',
        images: ['/opengraph-image.png'],
    },
    alternates: {
        canonical: '/',
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};