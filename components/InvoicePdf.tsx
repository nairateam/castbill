import { InvoiceTemplateData } from "@/lib/templates/invoice";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { getSymbol } from "@/lib/currency";
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

const INDIGO = "#6366f1";
const DARK = "#111118";
const MUTED = "#6b7280";
const BORDER = "#e8e8f0";
const LIGHT = "#f4f4f8";
const WHITE = "#ffffff";

const s = StyleSheet.create({
    page: {
        fontFamily: "Roboto",
        fontSize: 10,
        color: DARK,
        backgroundColor: WHITE,
    },

    accentBar: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: 4,
        backgroundColor: INDIGO,
    },

    body: {
        paddingHorizontal: 48,
        paddingVertical: 44,
    },

    // Header
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 32,
    },

    headerLeft: {},

    invoiceTitle: {
        fontSize: 28,
        fontWeight: 700,
        color: DARK,
        letterSpacing: 1,
        textTransform: "uppercase",
    },

    invoicePill: {
        marginTop: 6,
        backgroundColor: DARK,
        borderRadius: 20,
        paddingVertical: 3,
        paddingHorizontal: 10,
        alignSelf: "flex-start",
    },

    invoicePillText: {
        fontSize: 8,
        color: WHITE,
        fontWeight: 400,
        letterSpacing: 0.5,
    },

    headerRight: {
        alignItems: "flex-end",
    },

    brandName: {
        fontSize: 16,
        fontWeight: 700,
        color: DARK,
        letterSpacing: 0.5,
    },

    brandDot: {
        color: INDIGO,
    },

    brandSub: {
        fontSize: 8,
        color: MUTED,
        marginTop: 2,
        letterSpacing: 1,
        textTransform: "uppercase",
    },

    divider: {
        borderBottom: `1px solid ${BORDER}`,
        marginBottom: 24,
    },

    // Customer + Balance
    customerSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 28,
    },

    customerLabel: {
        fontSize: 7,
        fontWeight: 700,
        color: INDIGO,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 6,
    },

    customerName: {
        fontSize: 15,
        fontWeight: 700,
        color: DARK,
        marginBottom: 4,
    },

    customerDetail: {
        fontSize: 9,
        color: MUTED,
        lineHeight: 1.7,
    },

    balanceBlock: {
        alignItems: "flex-end",
    },

    balanceLabel: {
        fontSize: 8,
        fontWeight: 700,
        color: INDIGO,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 4,
    },

    balanceAmount: {
        fontSize: 22,
        fontWeight: 700,
        color: DARK,
        marginBottom: 6,
    },

    dateLabel: {
        fontSize: 7,
        fontWeight: 700,
        color: MUTED,
        textTransform: "uppercase",
        letterSpacing: 1,
        textAlign: "right",
        marginBottom: 2,
    },

    dateValue: {
        fontSize: 10,
        fontWeight: 700,
        color: DARK,
        textAlign: "right",
    },

    // Table
    tableHeader: {
        flexDirection: "row",
        marginBottom: 0,
    },

    thDesc: {
        flex: 3,
        backgroundColor: DARK,
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderRadius: "3 0 0 3",
    },

    thMid: {
        flex: 1,
        backgroundColor: DARK,
        paddingVertical: 9,
        paddingHorizontal: 8,
        marginLeft: 2,
        textAlign: "center",
    },

    thTotal: {
        flex: 1,
        backgroundColor: INDIGO,
        paddingVertical: 9,
        paddingHorizontal: 8,
        marginLeft: 2,
        textAlign: "center",
        borderRadius: "0 3 3 0",
    },

    thText: {
        fontSize: 7,
        fontWeight: 700,
        color: WHITE,
        textTransform: "uppercase",
        letterSpacing: 1.2,
    },

    row: {
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 2,
        borderBottom: `1px solid ${BORDER}`,
    },

    tdDescCol: { flex: 3, paddingRight: 12 },
    tdMidCol: { flex: 1, textAlign: "center" },
    tdTotalCol: { flex: 1, textAlign: "right" },

    tdTitle: {
        fontSize: 10,
        fontWeight: 700,
        color: DARK,
        marginBottom: 2,
        textTransform: "uppercase",
        letterSpacing: 0.3,
    },

    tdSub: {
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
        color: DARK,
    },

    // Totals
    totalSection: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 4,
        paddingVertical: 10,
        paddingRight: 2,
    },

    totalLabel: {
        fontSize: 10,
        fontWeight: 700,
        color: MUTED,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginRight: 24,
    },

    totalValue: {
        fontSize: 10,
        fontWeight: 700,
        color: DARK,
        minWidth: 80,
        textAlign: "right",
    },

    // Footer band
    footerBand: {
        backgroundColor: LIGHT,
        marginTop: 24,
        padding: "16 48",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    dueLabel: {
        fontSize: 9,
        color: MUTED,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 2,
    },

    dueDate: {
        fontSize: 10,
        fontWeight: 700,
        color: DARK,
    },

    dueAmount: {
        fontSize: 20,
        fontWeight: 700,
        color: DARK,
    },

    // Notes
    notesWrap: {
        paddingHorizontal: 48,
        paddingTop: 16,
        paddingBottom: 8,
    },

    notesLabel: {
        fontSize: 7,
        fontWeight: 700,
        color: INDIGO,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 4,
    },

    notesText: {
        fontSize: 9,
        color: MUTED,
        lineHeight: 1.7,
    },

    // Bottom footer
    bottomFooter: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: DARK,
        paddingVertical: 10,
        paddingHorizontal: 48,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    footerText: {
        fontSize: 8,
        color: "rgba(255,255,255,0.4)",
    },

    footerBrand: {
        fontSize: 8,
        fontWeight: 700,
        color: INDIGO,
    },
});

export function InvoicePDF({ data }: { data: InvoiceTemplateData }) {
    const sym = getSymbol(data.currency ?? "NGN");

    return (
        <Document>
            <Page size="A4" style={s.page}>

                <View style={s.accentBar} fixed />

                <View style={s.body}>

                    {/* Header */}
                    <View style={s.header}>
                        <View style={s.headerLeft}>
                            <Text style={s.invoiceTitle}>Invoice</Text>
                            <View style={s.invoicePill}>
                                <Text style={s.invoicePillText}>Invoice No : {data.invoiceNumber}</Text>
                            </View>
                        </View>
                        <View style={s.headerRight}>
                            <Text style={s.brandName}>
                                CastBill<Text style={s.brandDot}>.</Text>
                            </Text>
                            <Text style={s.brandSub}>{data.senderName}</Text>
                        </View>
                    </View>

                    <View style={s.divider} />

                    {/* Customer + Balance */}
                    <View style={s.customerSection}>
                        <View>
                            <Text style={s.customerLabel}>Customer</Text>
                            <Text style={s.customerName}>{data.clientName}</Text>
                            {data.clientPhone && <Text style={s.customerDetail}>P. {data.clientPhone}</Text>}
                            <Text style={s.customerDetail}>E. {data.clientEmail}</Text>
                            {data.clientAddress && <Text style={s.customerDetail}>A. {data.clientAddress}</Text>}
                        </View>
                        <View style={s.balanceBlock}>
                            <Text style={s.balanceLabel}>Balance Due</Text>
                            <Text style={s.balanceAmount}>{sym} {data.total.toFixed(2)}/-</Text>
                            {data.dueDate && (
                                <>
                                    <Text style={s.dateLabel}>Due Date</Text>
                                    <Text style={s.dateValue}>{data.dueDate}</Text>
                                </>
                            )}
                        </View>
                    </View>

                    {/* Table header */}
                    <View style={s.tableHeader}>
                        <View style={s.thDesc}>
                            <Text style={s.thText}>Description</Text>
                        </View>
                        <View style={s.thMid}>
                            <Text style={s.thText}>Rate</Text>
                        </View>
                        <View style={s.thMid}>
                            <Text style={s.thText}>Unit</Text>
                        </View>
                        <View style={s.thTotal}>
                            <Text style={s.thText}>Subtotal</Text>
                        </View>
                    </View>

                    {/* Rows */}
                    {data.items.map((item, i) => (
                        <View key={i} style={s.row}>
                            <View style={s.tdDescCol}>
                                <Text style={s.tdTitle}>{item.description}</Text>
                            </View>
                            <View style={s.tdMidCol}>
                                <Text style={s.tdMuted}>{sym}{item.rate.toFixed(2)}</Text>
                            </View>
                            <View style={s.tdMidCol}>
                                <Text style={s.tdMuted}>{item.quantity}</Text>
                            </View>
                            <View style={s.tdTotalCol}>
                                <Text style={s.tdAmount}>{sym}{item.amount.toFixed(2)}</Text>
                            </View>
                        </View>
                    ))}

                    {/* Subtotal / tax / discount rows */}
                    {[
                        { label: "Subtotal", value: `${sym}${data.subtotal.toFixed(2)}` },
                        { label: "Tax", value: `${sym}${data.tax.toFixed(2)}` },
                        { label: "Discount", value: `-${sym}${data.discount.toFixed(2)}` },
                    ].map(({ label, value }) => (
                        <View key={label} style={s.totalSection}>
                            <Text style={s.totalLabel}>{label}</Text>
                            <Text style={s.totalValue}>{value}</Text>
                        </View>
                    ))}

                </View>

                {/* Footer band */}
                <View style={s.footerBand}>
                    <View>
                        <Text style={s.dueLabel}>Due By</Text>
                        <Text style={s.dueDate}>{data.dueDate ?? "On Receipt"}</Text>
                    </View>
                    <Text style={s.dueAmount}>{sym}{data.total.toFixed(2)}/-</Text>
                </View>

                {/* Notes */}
                {data.notes && (
                    <View style={s.notesWrap}>
                        <Text style={s.notesLabel}>Notes</Text>
                        <Text style={s.notesText}>{data.notes}</Text>
                    </View>
                )}

                {/* Bottom bar */}
                <View style={s.bottomFooter} fixed>
                    <Text style={s.footerText}>
                        {data.senderEmail}
                    </Text>
                    <Text style={s.footerText}>castbill.vercel.app</Text>
                    <Text style={s.footerBrand}>CastBill.</Text>
                </View>

            </Page>
        </Document>
    );
}