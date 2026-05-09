import { InvoiceTemplateData } from "@/lib/templates/invoice";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { getSymbol } from "@/lib/currency";

const FONT_BASE = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

Font.register({
    family: "Roboto",
    fonts: [
        { src: `${FONT_BASE}/fonts/Roboto-Regular.ttf`, fontWeight: 400 },
        { src: `${FONT_BASE}/fonts/Roboto-Bold.ttf`, fontWeight: 700 },
    ],
});

const INDIGO = "#6366f1";
const DARK = "#111118";
const MUTED = "#6b7280";
const BORDER = "#ebebf0";
const LIGHT = "#f9f9fc";
const WHITE = "#ffffff";

const s = StyleSheet.create({
    page: {
        fontFamily: "Roboto",
        fontSize: 10,
        color: DARK,
        backgroundColor: WHITE,
        padding: "52 52 44 52",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 40,
        paddingBottom: 28,
        borderBottom: `1px solid ${BORDER}`,
    },

    brand: {
        fontSize: 20,
        fontWeight: 700,
        color: DARK,
        letterSpacing: 0.3,
    },

    brandDot: {
        color: INDIGO,
    },

    invoiceNumLabel: {
        fontSize: 7,
        fontWeight: 700,
        color: MUTED,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        textAlign: "right",
        marginBottom: 4,
    },

    invoiceNum: {
        fontSize: 20,
        fontWeight: 700,
        color: INDIGO,
        textAlign: "right",
    },

    statusPill: {
        marginTop: 6,
        paddingVertical: 2,
        paddingHorizontal: 8,
        backgroundColor: LIGHT,
        borderRadius: 20,
        border: `1px solid ${BORDER}`,
        alignSelf: "flex-end",
    },

    statusText: {
        fontSize: 7,
        fontWeight: 700,
        color: MUTED,
        textTransform: "uppercase",
        letterSpacing: 1,
    },

    parties: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 36,
    },

    partyLabel: {
        fontSize: 7,
        fontWeight: 700,
        color: INDIGO,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 6,
    },

    partyName: {
        fontSize: 12,
        fontWeight: 700,
        color: DARK,
        marginBottom: 3,
    },

    partyDetail: {
        fontSize: 9,
        color: MUTED,
        lineHeight: 1.6,
    },

    metaRow: {
        flexDirection: "row",
        gap: 32,
        marginBottom: 28,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: LIGHT,
        borderRadius: 4,
    },

    metaLabel: {
        fontSize: 7,
        fontWeight: 700,
        color: MUTED,
        textTransform: "uppercase",
        letterSpacing: 1.2,
        marginBottom: 3,
    },

    metaValue: {
        fontSize: 10,
        fontWeight: 700,
        color: DARK,
    },

    tableHeader: {
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: DARK,
        borderRadius: 3,
        marginBottom: 2,
    },

    thText: {
        fontSize: 7,
        fontWeight: 700,
        color: "rgba(255,255,255,0.55)",
        textTransform: "uppercase",
        letterSpacing: 1.2,
    },

    row: {
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottom: `1px solid ${BORDER}`,
    },

    tdDesc: {
        fontSize: 10,
        color: DARK,
    },

    tdMuted: {
        fontSize: 10,
        color: MUTED,
    },

    tdBold: {
        fontSize: 10,
        fontWeight: 700,
        color: DARK,
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

    totals: { width: 230 },

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

    grandRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: DARK,
        borderRadius: 4,
    },

    grandLabel: {
        fontSize: 10,
        fontWeight: 700,
        color: WHITE,
    },

    grandValue: {
        fontSize: 14,
        fontWeight: 700,
        color: INDIGO,
    },

    notesWrap: {
        marginBottom: 32,
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: LIGHT,
        borderLeft: `3px solid ${INDIGO}`,
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
    },

    footerText: {
        fontSize: 8,
        color: "rgba(107,114,128,0.5)",
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

                {/* Header */}
                <View style={s.header}>
                    <View>
                        <Text style={s.brand}>
                            CastBill<Text style={s.brandDot}>.</Text>
                        </Text>
                        <Text style={{ fontSize: 8, color: MUTED, marginTop: 3 }}>Invoice Management</Text>
                    </View>
                    <View>
                        <Text style={s.invoiceNumLabel}>Invoice No.</Text>
                        <Text style={s.invoiceNum}>#{data.invoiceNumber}</Text>
                        <View style={s.statusPill}>
                            <Text style={s.statusText}>{data.status}</Text>
                        </View>
                    </View>
                </View>

                {/* Parties */}
                <View style={s.parties}>
                    <View>
                        <Text style={s.partyLabel}>From</Text>
                        <Text style={s.partyName}>{data.senderName}</Text>
                        <Text style={s.partyDetail}>{data.senderEmail}</Text>
                        {data.senderPhone && <Text style={s.partyDetail}>{data.senderPhone}</Text>}
                        {/* {data.senderAddress && <Text style={s.partyDetail}>{data.senderAddress}</Text>} */}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={[s.partyLabel, { textAlign: "right" }]}>Bill To</Text>
                        <Text style={[s.partyName, { textAlign: "right" }]}>{data.clientName}</Text>
                        <Text style={[s.partyDetail, { textAlign: "right" }]}>{data.clientEmail}</Text>
                        {data.clientPhone && <Text style={[s.partyDetail, { textAlign: "right" }]}>{data.clientPhone}</Text>}
                        {/* {data.clientAddress && <Text style={[s.partyDetail, { textAlign: "right" }]}>{data.clientAddress}</Text>} */}
                    </View>
                </View>

                {/* Meta */}
                <View style={s.metaRow}>
                    <View>
                        <Text style={s.metaLabel}>Issued</Text>
                        <Text style={s.metaValue}>{data.createdAt}</Text>
                    </View>
                    {data.dueDate && (
                        <View>
                            <Text style={s.metaLabel}>Due Date</Text>
                            <Text style={s.metaValue}>{data.dueDate}</Text>
                        </View>
                    )}
                    <View>
                        <Text style={s.metaLabel}>Currency</Text>
                        <Text style={s.metaValue}>{data.currency}</Text>
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
                    <View key={i} style={s.row}>
                        <Text style={[s.tdDesc, s.col1]}>{item.description}</Text>
                        <Text style={[s.tdMuted, s.col2]}>{item.quantity}</Text>
                        <Text style={[s.tdMuted, s.col3]}>{sym}{item.rate.toFixed(2)}</Text>
                        <Text style={[s.tdBold, s.col4]}>{sym}{item.amount.toFixed(2)}</Text>
                    </View>
                ))}

                {/* Totals */}
                <View style={s.totalsWrap}>
                    <View style={s.totals}>
                        {[
                            { label: "Subtotal", value: `${sym}${data.subtotal.toFixed(2)}` },
                            { label: "Tax", value: `${sym}${data.tax.toFixed(2)}` },
                            { label: "Discount", value: `-${sym}${data.discount.toFixed(2)}` },
                        ].map(({ label, value }) => (
                            <View key={label} style={s.totalRow}>
                                <Text style={s.totalLabel}>{label}</Text>
                                <Text style={s.totalValue}>{value}</Text>
                            </View>
                        ))}
                        <View style={s.grandRow}>
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
                    <Text style={s.footerText}>
                        Generated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · Thank you for your business.
                    </Text>
                    <Text style={s.footerBrand}>castbill.vercel.app</Text>
                </View>

            </Page>
        </Document>
    );
}