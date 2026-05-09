import { InvoiceTemplateData } from "@/lib/templates/invoice";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
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

const INDIGO = "#6366f1";
const DARK = "#0d0d14";
const MUTED = "#8b8fa8";
const BORDER = "#ebebf2";
const LIGHT = "#f7f7fb";
const WHITE = "#ffffff";
const INDIGO_LIGHT = "#eef0fe";

const s = StyleSheet.create({
    page: {
        fontFamily: "Roboto",
        fontSize: 10,
        color: DARK,
        backgroundColor: WHITE,
        paddingBottom: 60,
    },

    // Top band
    topBand: {
        backgroundColor: DARK,
        paddingHorizontal: 52,
        paddingVertical: 32,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },

    brandName: {
        fontSize: 22,
        fontWeight: 700,
        color: WHITE,
        letterSpacing: 0.5,
    },

    brandDot: {
        color: INDIGO,
    },

    brandTagline: {
        fontSize: 7,
        color: "rgba(255,255,255,0.3)",
        marginTop: 3,
        letterSpacing: 1.5,
        textTransform: "uppercase",
    },

    invoiceTitleBlock: {
        alignItems: "flex-end",
    },

    invoiceWord: {
        fontSize: 11,
        fontWeight: 700,
        color: "rgba(255,255,255,0.35)",
        textTransform: "uppercase",
        letterSpacing: 3,
        marginBottom: 4,
    },

    invoiceNumber: {
        fontSize: 26,
        fontWeight: 700,
        color: WHITE,
        letterSpacing: 0.5,
    },

    invoiceNumberHash: {
        color: INDIGO,
    },

    statusPill: {
        marginTop: 8,
        backgroundColor: INDIGO,
        borderRadius: 20,
        paddingVertical: 3,
        paddingHorizontal: 10,
        alignSelf: "flex-end",
    },

    statusText: {
        fontSize: 7,
        fontWeight: 700,
        color: WHITE,
        textTransform: "uppercase",
        letterSpacing: 1.5,
    },

    // Meta strip
    metaStrip: {
        backgroundColor: INDIGO_LIGHT,
        paddingHorizontal: 52,
        paddingVertical: 12,
        flexDirection: "row",
        gap: 40,
    },

    metaItem: {},

    metaLabel: {
        fontSize: 6,
        fontWeight: 700,
        color: INDIGO,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 2,
    },

    metaValue: {
        fontSize: 9,
        fontWeight: 700,
        color: DARK,
    },

    // Body
    body: {
        paddingHorizontal: 52,
        paddingTop: 32,
    },

    // Parties
    partiesRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 32,
        paddingBottom: 28,
        borderBottom: `1px solid ${BORDER}`,
    },

    partyLabel: {
        fontSize: 6,
        fontWeight: 700,
        color: MUTED,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 7,
    },

    partyName: {
        fontSize: 13,
        fontWeight: 700,
        color: DARK,
        marginBottom: 5,
    },

    partyDetail: {
        fontSize: 8.5,
        color: MUTED,
        lineHeight: 1.7,
    },

    balanceBlock: {
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },

    balanceLabel: {
        fontSize: 6,
        fontWeight: 700,
        color: MUTED,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 6,
    },

    balanceAmount: {
        fontSize: 28,
        fontWeight: 700,
        color: DARK,
        letterSpacing: -0.5,
    },

    balanceSym: {
        fontSize: 16,
        fontWeight: 400,
        color: MUTED,
    },

    // Table
    tableWrap: {
        marginBottom: 0,
    },

    tableHead: {
        flexDirection: "row",
        paddingVertical: 9,
        paddingHorizontal: 14,
        backgroundColor: DARK,
        borderRadius: 4,
        marginBottom: 2,
    },

    thText: {
        fontSize: 6.5,
        fontWeight: 700,
        color: "rgba(255,255,255,0.45)",
        textTransform: "uppercase",
        letterSpacing: 1.3,
    },

    tableRow: {
        flexDirection: "row",
        paddingVertical: 11,
        paddingHorizontal: 14,
        borderBottom: `1px solid ${BORDER}`,
    },

    tableRowAlt: {
        backgroundColor: LIGHT,
    },

    col1: { flex: 3 },
    col2: { flex: 1, textAlign: "center" },
    col3: { flex: 1, textAlign: "right" },
    col4: { flex: 1, textAlign: "right" },

    tdDesc: {
        fontSize: 10,
        color: DARK,
        fontWeight: 700,
    },

    tdMuted: {
        fontSize: 9.5,
        color: MUTED,
    },

    tdAmount: {
        fontSize: 9.5,
        fontWeight: 700,
        color: DARK,
    },

    // Totals
    totalsWrap: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 6,
    },

    totalsInner: {
        width: 240,
    },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 7,
        borderBottom: `1px solid ${BORDER}`,
    },

    totalLabel: {
        fontSize: 9,
        color: MUTED,
    },

    totalValue: {
        fontSize: 9,
        color: DARK,
    },

    grandWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        paddingVertical: 11,
        paddingHorizontal: 16,
        backgroundColor: INDIGO,
        borderRadius: 4,
    },

    grandLabel: {
        fontSize: 9,
        fontWeight: 700,
        color: "rgba(255,255,255,0.7)",
        textTransform: "uppercase",
        letterSpacing: 1,
    },

    grandValue: {
        fontSize: 15,
        fontWeight: 700,
        color: WHITE,
    },

    // Notes
    notesWrap: {
        marginHorizontal: 52,
        marginTop: 24,
        padding: "12 14",
        borderLeft: `3px solid ${INDIGO}`,
        backgroundColor: INDIGO_LIGHT,
        borderRadius: 2,
    },

    notesLabel: {
        fontSize: 6,
        fontWeight: 700,
        color: INDIGO,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 5,
    },

    notesText: {
        fontSize: 8.5,
        color: MUTED,
        lineHeight: 1.7,
    },

    // Bottom footer
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 14,
        paddingHorizontal: 52,
        borderTop: `1px solid ${BORDER}`,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: WHITE,
    },

    footerLeft: {
        fontSize: 7.5,
        color: MUTED,
    },

    footerRight: {
        fontSize: 7.5,
        fontWeight: 700,
        color: INDIGO,
    },
});

export function InvoicePDF({ data }: { data: InvoiceTemplateData }) {
    const sym = getSymbol(data.currency ?? "NGN");

    return (
        <Document>
            <Page size="A4" style={s.page}>

                {/* Top dark band */}
                <View style={s.topBand}>
                    <View>
                        <Text style={s.brandName}>
                            CastBill<Text style={s.brandDot}>.</Text>
                        </Text>
                        <Text style={s.brandTagline}>Invoice Management</Text>
                    </View>
                    <View style={s.invoiceTitleBlock}>
                        <Text style={s.invoiceWord}>Invoice</Text>
                        <Text style={s.invoiceNumber}>
                            <Text style={s.invoiceNumberHash}>#</Text>{data.invoiceNumber}
                        </Text>
                        <View style={s.statusPill}>
                            <Text style={s.statusText}>{data.status}</Text>
                        </View>
                    </View>
                </View>

                {/* Meta strip */}
                <View style={s.metaStrip}>
                    <View style={s.metaItem}>
                        <Text style={s.metaLabel}>Issued</Text>
                        <Text style={s.metaValue}>{data.createdAt}</Text>
                    </View>
                    {data.dueDate && (
                        <View style={s.metaItem}>
                            <Text style={s.metaLabel}>Due Date</Text>
                            <Text style={s.metaValue}>{data.dueDate}</Text>
                        </View>
                    )}
                    <View style={s.metaItem}>
                        <Text style={s.metaLabel}>Currency</Text>
                        <Text style={s.metaValue}>{data.currency}</Text>
                    </View>
                </View>

                <View style={s.body}>

                    {/* Parties */}
                    <View style={s.partiesRow}>
                        <View>
                            <Text style={s.partyLabel}>From</Text>
                            <Text style={s.partyName}>{data.senderName}</Text>
                            <Text style={s.partyDetail}>{data.senderEmail}</Text>
                            {data.senderPhone && <Text style={s.partyDetail}>{data.senderPhone}</Text>}
                            {data.senderAddress && <Text style={s.partyDetail}>{data.senderAddress}</Text>}
                        </View>

                        <View>
                            <Text style={[s.partyLabel, { textAlign: "right" }]}>Bill To</Text>
                            <Text style={[s.partyName, { textAlign: "right" }]}>{data.clientName}</Text>
                            <Text style={[s.partyDetail, { textAlign: "right" }]}>{data.clientEmail}</Text>
                            {data.clientPhone && <Text style={[s.partyDetail, { textAlign: "right" }]}>{data.clientPhone}</Text>}
                            {data.clientAddress && <Text style={[s.partyDetail, { textAlign: "right" }]}>{data.clientAddress}</Text>}
                        </View>

                        <View style={s.balanceBlock}>
                            <Text style={s.balanceLabel}>Total Due</Text>
                            <Text style={s.balanceAmount}>
                                <Text style={s.balanceSym}>{sym}</Text>{fmt(data.total)}
                            </Text>
                        </View>
                    </View>

                    {/* Table */}
                    <View style={s.tableWrap}>
                        <View style={s.tableHead}>
                            <Text style={[s.thText, s.col1]}>Description</Text>
                            <Text style={[s.thText, s.col2]}>Qty</Text>
                            <Text style={[s.thText, s.col3]}>Rate</Text>
                            <Text style={[s.thText, s.col4]}>Amount</Text>
                        </View>

                        {data.items.map((item, i) => (
                            <View key={i} style={[s.tableRow, i % 2 !== 0 ? s.tableRowAlt : {}]}>
                                <Text style={[s.tdDesc, s.col1]}>{item.description}</Text>
                                <Text style={[s.tdMuted, s.col2]}>{item.quantity}</Text>
                                <Text style={[s.tdMuted, s.col3]}>{sym}{fmt(item.rate)}</Text>
                                <Text style={[s.tdAmount, s.col4]}>{sym}{fmt(item.amount)}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Totals */}
                    <View style={s.totalsWrap}>
                        <View style={s.totalsInner}>
                            {[
                                { label: "Subtotal", value: `${sym}${fmt(data.subtotal)}` },
                                { label: "Tax", value: `${sym}${fmt(data.tax)}` },
                                { label: "Discount", value: `-${sym}${fmt(data.discount)}` },
                            ].map(({ label, value }) => (
                                <View key={label} style={s.totalRow}>
                                    <Text style={s.totalLabel}>{label}</Text>
                                    <Text style={s.totalValue}>{value}</Text>
                                </View>
                            ))}
                            <View style={s.grandWrap}>
                                <Text style={s.grandLabel}>Total Due</Text>
                                <Text style={s.grandValue}>{sym}{fmt(data.total)}</Text>
                            </View>
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
                <View style={s.footer} fixed>
                    <Text style={s.footerLeft}>
                        {data.senderEmail} · castbill.vercel.app
                    </Text>
                    <Text style={s.footerRight}>CastBill.</Text>
                </View>

            </Page>
        </Document>
    );
}