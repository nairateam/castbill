import { InvoiceTemplateData } from "@/lib/templates/invoice";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { getSymbol } from "@/lib/currency";

Font.register({
    family: "Roboto",
    fonts: [
        { src: "https://fonts.gstatic.com/s/roboto/v32/KFOmCnqEu92Fr1Me5Q.ttf", fontWeight: 400 },
        { src: "https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmEU9vAw.ttf", fontWeight: 700 },
        { src: "https://fonts.gstatic.com/s/roboto/v32/KFOkCnqEu92Fr1MmgVxIIzI.ttf", fontWeight: 300 },
    ],
});

const INDIGO = "#6366f1";
const DARK = "#0f0f1a";
const SLATE = "#1e1e2e";
const MUTED = "#6b7280";
const LIGHT = "#f8f8fc";
const BORDER = "#e8e8f0";
const WHITE = "#ffffff";

const s = StyleSheet.create({
    page: {
        fontFamily: "Roboto",
        fontSize: 10,
        color: DARK,
        backgroundColor: WHITE,
    },

    sidebar: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: 180,
        backgroundColor: DARK,
    },

    content: {
        marginLeft: 180,
        padding: "48 48 48 36",
    },

    sidebarTop: {
        padding: "48 24 32 24",
        borderBottom: `1px solid rgba(255,255,255,0.08)`,
    },

    brandText: {
        fontSize: 18,
        fontWeight: 700,
        color: WHITE,
        letterSpacing: 0.5,
    },

    brandDot: {
        color: INDIGO,
    },

    sidebarSection: {
        padding: "24 24",
        borderBottom: `1px solid rgba(255,255,255,0.06)`,
    },

    sidebarLabel: {
        fontSize: 7,
        fontWeight: 700,
        color: INDIGO,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 10,
    },

    sidebarValue: {
        fontSize: 10,
        color: WHITE,
        fontWeight: 400,
        marginBottom: 3,
        lineHeight: 1.5,
    },

    sidebarMuted: {
        fontSize: 9,
        color: "rgba(255,255,255,0.4)",
        lineHeight: 1.5,
    },

    sidebarStatusPill: {
        marginTop: 6,
        paddingVertical: 3,
        paddingHorizontal: 8,
        backgroundColor: INDIGO,
        borderRadius: 20,
        alignSelf: "flex-start",
    },

    sidebarStatusText: {
        fontSize: 8,
        fontWeight: 700,
        color: WHITE,
        textTransform: "uppercase",
        letterSpacing: 1,
    },

    invoiceNumLabel: {
        fontSize: 7,
        fontWeight: 700,
        color: "rgba(255,255,255,0.35)",
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 6,
    },

    invoiceNum: {
        fontSize: 22,
        fontWeight: 700,
        color: WHITE,
        letterSpacing: 0.5,
    },

    contentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 36,
        paddingBottom: 24,
        borderBottom: `1px solid ${BORDER}`,
    },

    fromLabel: {
        fontSize: 7,
        fontWeight: 700,
        color: INDIGO,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 6,
    },

    senderName: {
        fontSize: 16,
        fontWeight: 700,
        color: DARK,
        marginBottom: 3,
    },

    senderDetail: {
        fontSize: 9,
        color: MUTED,
        lineHeight: 1.6,
    },

    billToBlock: {
        alignItems: "flex-end",
    },

    billToLabel: {
        fontSize: 7,
        fontWeight: 700,
        color: MUTED,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 6,
    },

    clientName: {
        fontSize: 13,
        fontWeight: 700,
        color: DARK,
        marginBottom: 3,
        textAlign: "right",
    },

    clientDetail: {
        fontSize: 9,
        color: MUTED,
        lineHeight: 1.6,
        textAlign: "right",
    },

    tableHeader: {
        flexDirection: "row",
        backgroundColor: SLATE,
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderRadius: 4,
        marginBottom: 2,
    },

    thText: {
        fontSize: 7,
        fontWeight: 700,
        color: "rgba(255,255,255,0.6)",
        textTransform: "uppercase",
        letterSpacing: 1.2,
    },

    row: {
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottom: `1px solid ${BORDER}`,
    },

    rowAlt: {
        backgroundColor: LIGHT,
    },

    tdDesc: {
        fontSize: 10,
        color: DARK,
        fontWeight: 400,
    },

    tdMeta: {
        fontSize: 10,
        color: MUTED,
    },

    tdAmount: {
        fontSize: 10,
        color: DARK,
        fontWeight: 700,
    },

    col1: { flex: 3 },
    col2: { flex: 1, textAlign: "center" },
    col3: { flex: 1, textAlign: "right" },
    col4: { flex: 1, textAlign: "right" },

    totalsWrap: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 32,
    },

    totals: { width: 240 },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderBottom: `1px solid ${BORDER}`,
    },

    totalLabel: {
        fontSize: 10,
        color: MUTED,
        fontWeight: 300,
    },

    totalValue: {
        fontSize: 10,
        color: DARK,
    },

    grandWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: DARK,
        borderRadius: 6,
    },

    grandLabel: {
        fontSize: 11,
        fontWeight: 700,
        color: WHITE,
    },

    grandValue: {
        fontSize: 15,
        fontWeight: 700,
        color: INDIGO,
    },

    notesWrap: {
        marginBottom: 32,
        padding: "14 16",
        backgroundColor: LIGHT,
        borderLeft: `3px solid ${INDIGO}`,
        borderRadius: 2,
    },

    notesLabel: {
        fontSize: 7,
        fontWeight: 700,
        color: INDIGO,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 5,
    },

    notesText: {
        fontSize: 9,
        color: MUTED,
        lineHeight: 1.7,
    },

    footer: {
        borderTop: `1px solid ${BORDER}`,
        paddingTop: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    footerLeft: {
        fontSize: 8,
        color: "rgba(107,114,128,0.6)",
    },

    footerRight: {
        fontSize: 8,
        color: INDIGO,
        fontWeight: 700,
    },
});

export function InvoicePDF({ data }: { data: InvoiceTemplateData }) {
    const sym = getSymbol(data.currency ?? "NGN");

    return (
        <Document>
            <Page size="A4" style={s.page}>

                {/* Dark sidebar */}
                <View style={s.sidebar} fixed />

                {/* Sidebar content */}
                <View style={{ position: "absolute", top: 0, left: 0, width: 180 }}>
                    <View style={s.sidebarTop}>
                        <Text style={s.brandText}>
                            CastBill<Text style={{ color: INDIGO }}>.</Text>
                        </Text>
                        <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                            Invoice Management
                        </Text>
                    </View>

                    <View style={s.sidebarSection}>
                        <Text style={s.invoiceNumLabel}>Invoice No.</Text>
                        <Text style={s.invoiceNum}>#{data.invoiceNumber}</Text>
                        <View style={s.sidebarStatusPill}>
                            <Text style={s.sidebarStatusText}>{data.status}</Text>
                        </View>
                    </View>

                    <View style={s.sidebarSection}>
                        <Text style={s.sidebarLabel}>Issued</Text>
                        <Text style={s.sidebarValue}>{data.createdAt}</Text>
                        {data.dueDate && (
                            <>
                                <Text style={[s.sidebarLabel, { marginTop: 14 }]}>Due Date</Text>
                                <Text style={s.sidebarValue}>{data.dueDate}</Text>
                            </>
                        )}
                    </View>

                    <View style={s.sidebarSection}>
                        <Text style={s.sidebarLabel}>Currency</Text>
                        <Text style={s.sidebarValue}>{data.currency}</Text>
                    </View>
                </View>

                {/* Main content */}
                <View style={s.content}>

                    {/* From / Bill To */}
                    <View style={s.contentHeader}>
                        <View>
                            <Text style={s.fromLabel}>From</Text>
                            <Text style={s.senderName}>{data.senderName}</Text>
                            <Text style={s.senderDetail}>{data.senderEmail}</Text>
                            {data.senderPhone && <Text style={s.senderDetail}>{data.senderPhone}</Text>}
                            {data.senderAddress && <Text style={s.senderDetail}>{data.senderAddress}</Text>}
                        </View>
                        <View style={s.billToBlock}>
                            <Text style={s.billToLabel}>Bill To</Text>
                            <Text style={s.clientName}>{data.clientName}</Text>
                            <Text style={s.clientDetail}>{data.clientEmail}</Text>
                            {data.clientPhone && <Text style={s.clientDetail}>{data.clientPhone}</Text>}
                            {data.clientAddress && <Text style={s.clientDetail}>{data.clientAddress}</Text>}
                        </View>
                    </View>

                    {/* Table */}
                    <View style={s.tableHeader}>
                        <Text style={[s.thText, s.col1]}>Description</Text>
                        <Text style={[s.thText, s.col2]}>Qty</Text>
                        <Text style={[s.thText, s.col3]}>Unit Price</Text>
                        <Text style={[s.thText, s.col4]}>Total</Text>
                    </View>

                    {data.items.map((item, i) => (
                        <View key={i} style={[s.row, i % 2 !== 0 ? s.rowAlt : {}]}>
                            <Text style={[s.tdDesc, s.col1]}>{item.description}</Text>
                            <Text style={[s.tdMeta, s.col2]}>{item.quantity}</Text>
                            <Text style={[s.tdMeta, s.col3]}>{sym}{item.rate.toFixed(2)}</Text>
                            <Text style={[s.tdAmount, s.col4]}>{sym}{item.amount.toFixed(2)}</Text>
                        </View>
                    ))}

                    {/* Totals */}
                    <View style={s.totalsWrap}>
                        <View style={s.totals}>
                            {[
                                { label: "Subtotal", value: `${sym}${data.subtotal.toFixed(2)}` },
                                { label: `Tax`, value: `${sym}${data.tax.toFixed(2)}` },
                                { label: "Discount", value: `-${sym}${data.discount.toFixed(2)}` },
                            ].map(({ label, value }) => (
                                <View key={label} style={s.totalRow}>
                                    <Text style={s.totalLabel}>{label}</Text>
                                    <Text style={s.totalValue}>{value}</Text>
                                </View>
                            ))}
                            <View style={s.grandWrap}>
                                <Text style={s.grandLabel}>Total Due</Text>
                                <Text style={s.grandValue}>{sym}{data.total.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Notes */}
                    {data.notes && (
                        <View style={s.notesWrap}>
                            <Text style={s.notesLabel}>Notes</Text>
                            <Text style={s.notesText}>{data.notes}</Text>
                        </View>
                    )}

                    {/* Footer */}
                    <View style={s.footer}>
                        <Text style={s.footerLeft}>
                            Generated on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · Thank you for your business.
                        </Text>
                        <Text style={s.footerRight}>castbill.vercel.app</Text>
                    </View>

                </View>
            </Page>
        </Document>
    );
}