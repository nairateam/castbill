import { InvoiceTemplateData } from "@/lib/templates/invoice";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { getSymbol, fmt } from "@/lib/currency";
import fs from "fs";
import path from "path";

const robotoRegular = fs.readFileSync(path.join(process.cwd(), "public/fonts/Roboto-Regular.ttf"));
const robotoBold = fs.readFileSync(path.join(process.cwd(), "public/fonts/Roboto-Bold.ttf"));

Font.register({
    family: "Roboto",
    fonts: [
        { src: `data:font/truetype;base64,${robotoRegular.toString("base64")}`, fontWeight: 400 },
        { src: `data:font/truetype;base64,${robotoBold.toString("base64")}`, fontWeight: 700 },
    ],
});

const BLACK = "#0a0a0a";
const DARK = "#1a1a1a";
const MUTED = "#6b7280";
const LIGHT_MUTED = "#9ca3af";
const BORDER = "#e5e7eb";
const LIGHT = "#f9fafb";
const WHITE = "#ffffff";
const ACCENT = "#6366f1";

const s = StyleSheet.create({
    page: {
        fontFamily: "Roboto",
        fontSize: 10,
        color: BLACK,
        backgroundColor: WHITE,
        paddingBottom: 80,
    },

    body: {
        paddingHorizontal: 52,
        paddingTop: 48,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10,
    },

    invoiceTitle: {
        fontSize: 42,
        fontWeight: 700,
        color: BLACK,
        letterSpacing: -1,
        lineHeight: 1,
    },

    invoiceMeta: {
        flexDirection: "row",
        gap: 20,
        marginTop: 8,
    },

    invoiceMetaLabel: {
        fontSize: 8,
        color: LIGHT_MUTED,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginRight: 4,
    },

    invoiceMetaValue: {
        fontSize: 8,
        color: DARK,
        fontWeight: 700,
    },

    logoBlock: {
        alignItems: "flex-end",
    },

    logoImage: {
        width: 80,
        height: 40,
        objectFit: "contain",
    },

    logoFallback: {
        fontSize: 18,
        fontWeight: 700,
        color: BLACK,
        letterSpacing: 0.3,
    },

    logoFallbackDot: {
        color: ACCENT,
    },

    logoTagline: {
        fontSize: 7,
        color: LIGHT_MUTED,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginTop: 2,
        textAlign: "right",
    },

    divider: {
        borderBottom: `1px solid ${BORDER}`,
        marginVertical: 20,
    },

    billToSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 32,
    },

    billToLeft: {
        flex: 1,
    },

    billToLabel: {
        fontSize: 8,
        fontWeight: 700,
        color: ACCENT,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 6,
        // borderBottom: `1px solid ${ACCENT}`,
        paddingBottom: 3,
    },

    billToName: {
        fontSize: 13,
        fontWeight: 700,
        color: BLACK,
        marginBottom: 2,
    },

    billToRole: {
        fontSize: 9,
        color: MUTED,
        marginBottom: 4,
    },

    billToDetail: {
        fontSize: 9,
        color: MUTED,
        lineHeight: 1.6,
    },

    billToRight: {
        alignItems: "flex-end",
        justifyContent: "flex-start",
    },

    balanceLabel: {
        fontSize: 8,
        fontWeight: 700,
        color: MUTED,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 4,
        textAlign: "right",
    },

    balanceAmount: {
        fontSize: 26,
        fontWeight: 700,
        color: BLACK,
        textAlign: "right",
        letterSpacing: -0.5,
    },

    dueDateRow: {
        marginTop: 8,
        alignItems: "flex-end",
    },

    dueDateLabel: {
        fontSize: 7,
        fontWeight: 700,
        color: LIGHT_MUTED,
        textTransform: "uppercase",
        letterSpacing: 1,
        textAlign: "right",
    },

    dueDateValue: {
        fontSize: 10,
        fontWeight: 700,
        color: BLACK,
        textAlign: "right",
        marginTop: 2,
    },

    tableWrap: {
        marginBottom: 4,
    },

    tableHead: {
        flexDirection: "row",
        borderBottom: `2px solid ${BLACK}`,
        paddingBottom: 8,
        marginBottom: 0,
    },

    thText: {
        fontSize: 8,
        fontWeight: 700,
        color: BLACK,
        textTransform: "uppercase",
        letterSpacing: 1.2,
    },

    tableRow: {
        flexDirection: "row",
        paddingVertical: 12,
        borderBottom: `1px solid ${BORDER}`,
    },

    tdDescTitle: {
        fontSize: 10,
        fontWeight: 700,
        color: BLACK,
        marginBottom: 2,
    },

    tdDescSub: {
        fontSize: 8,
        color: MUTED,
        lineHeight: 1.5,
    },

    tdMuted: {
        fontSize: 10,
        color: MUTED,
    },

    tdAmount: {
        fontSize: 10,
        fontWeight: 700,
        color: BLACK,
    },

    col1: { flex: 3 },
    col2: { flex: 1, textAlign: "center" },
    col3: { flex: 1, textAlign: "right" },
    col4: { flex: 1, textAlign: "right" },

    bottomSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        gap: 32,
    },

    termsBlock: {
        flex: 1,
    },

    termsLabel: {
        fontSize: 9,
        fontWeight: 700,
        color: BLACK,
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },

    termsText: {
        fontSize: 8,
        color: MUTED,
        lineHeight: 1.7,
    },

    totalsBlock: {
        width: 220,
    },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
    },

    totalLabel: {
        fontSize: 9,
        color: MUTED,
    },

    totalValue: {
        fontSize: 9,
        color: BLACK,
    },

    grandRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 10,
        marginTop: 6,
        borderTop: `2px solid ${BLACK}`,
    },

    grandLabel: {
        fontSize: 11,
        fontWeight: 700,
        color: BLACK,
    },

    grandValue: {
        fontSize: 13,
        fontWeight: 700,
        color: BLACK,
    },

    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: DARK,
        paddingVertical: 14,
        paddingHorizontal: 52,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    footerLeft: {},

    footerContactLabel: {
        fontSize: 7,
        fontWeight: 700,
        color: WHITE,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 4,
    },

    footerDetail: {
        fontSize: 8,
        color: "rgba(255,255,255,0.5)",
        lineHeight: 1.6,
    },

    footerRight: {
        alignItems: "flex-end",
    },

    footerSenderName: {
        fontSize: 11,
        fontWeight: 700,
        color: WHITE,
        letterSpacing: 0.3,
    },

    footerSenderRole: {
        fontSize: 7,
        color: "rgba(255,255,255,0.4)",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginTop: 2,
    },

    statusPill: {
        marginTop: 6,
        paddingVertical: 2,
        paddingHorizontal: 8,
        backgroundColor: ACCENT,
        borderRadius: 20,
        alignSelf: "flex-start",
    },

    statusText: {
        fontSize: 7,
        fontWeight: 700,
        color: WHITE,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
});

export function InvoicePDF({ data }: { data: InvoiceTemplateData }) {
    const sym = getSymbol(data.currency ?? "NGN");
    const isCompany = !!data.senderLogoUrl || !!data.senderVatNumber;

    return (
        <Document>
            <Page size="A4" style={s.page}>
                <View style={s.body}>

                    {/* Header */}
                    <View style={s.header}>
                        <View>
                            <Text style={s.invoiceTitle}>INVOICE</Text>
                            <View style={s.invoiceMeta}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={s.invoiceMetaLabel}>No. </Text>
                                    <Text style={s.invoiceMetaValue}>#{data.invoiceNumber}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={s.invoiceMetaLabel}>Invoice Date: </Text>
                                    <Text style={s.invoiceMetaValue}>{data.createdAt}</Text>
                                </View>
                                {/* <View style={s.statusPill}>
                                    <Text style={s.statusText}>{data.status}</Text>
                                </View> */}
                            </View>
                        </View>

                        <View style={s.logoBlock}>
                            {data.senderLogoUrl ? (
                                <Image src={data.senderLogoUrl} style={s.logoImage} />
                            ) : (
                                <Text style={s.logoFallback}>
                                    CastBill<Text style={s.logoFallbackDot}>.</Text>
                                </Text>
                            )}
                            <Text style={s.logoTagline}>{data.senderName}</Text>
                        </View>
                    </View>

                    <View style={s.divider} />

                    {/* Bill To + Balance */}
                    <View style={s.billToSection}>
                        <View style={s.billToLeft}>
                            <Text style={s.billToLabel}>Invoice To:</Text>
                            <Text style={s.billToName}>{data.clientName}</Text>
                            {data.clientPhone && <Text style={s.billToDetail}>P. {data.clientPhone}</Text>}
                            <Text style={s.billToDetail}>E. {data.clientEmail}</Text>
                            {data.clientAddress && <Text style={s.billToDetail}>A. {data.clientAddress}</Text>}
                        </View>

                        <View style={s.billToRight}>
                            <Text style={s.balanceLabel}>Balance Due</Text>
                            <Text style={s.balanceAmount}>{sym} {fmt(data.total)}</Text>
                            {data.dueDate && (
                                <View style={s.dueDateRow}>
                                    <Text style={s.dueDateLabel}>Due Date</Text>
                                    <Text style={s.dueDateValue}>{data.dueDate}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Table */}
                    <View style={s.tableWrap}>
                        <View style={s.tableHead}>
                            <Text style={[s.thText, s.col1]}>Item Description</Text>
                            <Text style={[s.thText, s.col2]}>Qty</Text>
                            <Text style={[s.thText, s.col3]}>Price</Text>
                            <Text style={[s.thText, s.col4]}>Total</Text>
                        </View>

                        {data.items.map((item, i) => (
                            <View key={i} style={s.tableRow}>
                                <View style={s.col1}>
                                    <Text style={s.tdDescTitle}>{item.description}</Text>
                                </View>
                                <Text style={[s.tdMuted, s.col2]}>{item.quantity}</Text>
                                <Text style={[s.tdMuted, s.col3]}>{sym}{fmt(item.rate)}</Text>
                                <Text style={[s.tdAmount, s.col4]}>{sym}{fmt(item.amount)}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Bottom section */}
                    <View style={s.bottomSection}>
                        <View style={s.termsBlock}>
                            {data.notes ? (
                                <>
                                    <Text style={s.termsLabel}>Terms & Conditions:</Text>
                                    <Text style={s.termsText}>{data.notes}</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={s.termsLabel}>From:</Text>
                                    <Text style={s.termsText}>{data.senderName}</Text>
                                    <Text style={s.termsText}>{data.senderEmail}</Text>
                                    {data.senderPhone && <Text style={s.termsText}>{data.senderPhone}</Text>}
                                    {data.senderAddress && <Text style={s.termsText}>{data.senderAddress}</Text>}
                                    {isCompany && data.senderVatNumber && (
                                        <Text style={s.termsText}>VAT: {data.senderVatNumber}</Text>
                                    )}
                                </>
                            )}
                        </View>

                        <View style={s.totalsBlock}>
                            {[
                                { label: "Sub-Total:", value: `${sym}${fmt(data.subtotal)}` },
                                { label: `Tax Vat:`, value: `${sym}${fmt(data.tax)}` },
                                { label: "Discount:", value: `${sym}${fmt(data.discount)}` },
                            ].map(({ label, value }) => (
                                <View key={label} style={s.totalRow}>
                                    <Text style={s.totalLabel}>{label}</Text>
                                    <Text style={s.totalValue}>{value}</Text>
                                </View>
                            ))}
                            <View style={s.grandRow}>
                                <Text style={s.grandLabel}>Grand Total:</Text>
                                <Text style={s.grandValue}>{sym}{fmt(data.total)}</Text>
                            </View>
                        </View>
                    </View>

                </View>

                {/* Footer */}
                <View style={s.footer} fixed>
                    <View style={s.footerLeft}>
                        <Text style={s.footerContactLabel}>Contact:</Text>
                        {data.senderAddress && <Text style={s.footerDetail}>Address: {data.senderAddress}</Text>}
                        {data.senderPhone && <Text style={s.footerDetail}>{data.senderPhone}</Text>}
                        <Text style={s.footerDetail}>{data.senderEmail}</Text>
                    </View>
                    <View style={s.footerRight}>
                        <Text style={s.footerSenderName}>{data.senderName}</Text>
                        <Text style={s.footerSenderRole}>
                            {isCompany ? "Company" : "Individual"}
                        </Text>
                    </View>
                </View>

            </Page>
        </Document>
    );
}