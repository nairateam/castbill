import { InvoiceTemplateData } from "@/lib/templates/invoice";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { getSymbol } from "@/lib/currency";

Font.register({
    family: "Roboto",
    fonts: [
        {
            src: "https://fonts.gstatic.com/s/roboto/v32/KFOmCnqEu92Fr1Me5Q.ttf",
            fontWeight: 400,
        },
        {
            src: "https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmEU9vAw.ttf",
            fontWeight: 700,
        },
    ],
});

const s = StyleSheet.create({
    page: { padding: 48, fontSize: 11, fontFamily: "Roboto", color: "#1a1a2e" },
    header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32, paddingBottom: 20, borderBottom: "2px solid #e8e8f0" },
    brand: { fontSize: 18, fontWeight: 700 },
    invoiceNum: { fontSize: 24, fontWeight: 700, color: "#6366f1", textAlign: "right" },
    metaLabel: { fontSize: 10, color: "#6b7280", textAlign: "right", marginTop: 2 },
    parties: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
    partyLabel: { fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", marginBottom: 4 },
    partyName: { fontSize: 13, fontWeight: 700, marginBottom: 2 },
    partyEmail: { fontSize: 10, color: "#6b7280" },
    tableHeader: { flexDirection: "row", backgroundColor: "#1a1a2e", padding: "8 12", marginBottom: 0 },
    thText: { fontSize: 9, fontWeight: 700, color: "#ffffff", textTransform: "uppercase" },
    row: { flexDirection: "row", padding: "8 12", borderBottom: "1px solid #f0f0f8" },
    tdText: { fontSize: 10, color: "#374151" },
    col1: { flex: 3 },
    col2: { flex: 1, textAlign: "center" },
    col3: { flex: 1, textAlign: "right" },
    col4: { flex: 1, textAlign: "right" },
    totalsWrap: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16, marginBottom: 40 },
    totals: { width: 220 },
    totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottom: "1px dashed #e8e8f0" },
    totalLabel: { fontSize: 11, color: "#6b7280" },
    totalValue: { fontSize: 11, color: "#1a1a2e" },
    grandRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: 10, marginTop: 4 },
    grandLabel: { fontSize: 13, fontWeight: 700 },
    grandValue: { fontSize: 13, fontWeight: 700, color: "#6366f1" },
    footer: { textAlign: "center", fontSize: 10, color: "#d1d5db", paddingTop: 20, borderTop: "1px solid #f0f0f8" },
});

export function InvoicePDF({ data }: { data: InvoiceTemplateData }) {
    const sym = getSymbol(data.currency ?? "NGN");

    return (
        <Document>
            <Page size="A4" style={s.page}>

                <View style={s.header}>
                    <Text style={s.brand}>Invoice.</Text>
                    <View>
                        <Text style={s.invoiceNum}>#{data.invoiceNumber}</Text>
                        <Text style={s.metaLabel}>Invoice Number</Text>
                        <Text style={s.metaLabel}>{data.status}</Text>
                    </View>
                </View>

                <View style={s.parties}>
                    <View>
                        <Text style={s.partyLabel}>From</Text>
                        <Text style={s.partyName}>{data.senderName}</Text>
                        <Text style={s.partyEmail}>{data.senderEmail}</Text>
                    </View>
                    <View>
                        <Text style={s.partyLabel}>Bill To</Text>
                        <Text style={s.partyName}>{data.clientName}</Text>
                        <Text style={s.partyEmail}>{data.clientEmail}</Text>
                    </View>
                    <View>
                        <Text style={s.partyLabel}>Issued</Text>
                        <Text style={s.partyEmail}>{data.createdAt}</Text>
                        {data.dueDate && <>
                            <Text style={[s.partyLabel, { marginTop: 8 }]}>Due</Text>
                            <Text style={s.partyEmail}>{data.dueDate}</Text>
                        </>}
                    </View>
                </View>

                <View style={s.tableHeader}>
                    <Text style={[s.thText, s.col1]}>Description</Text>
                    <Text style={[s.thText, s.col2]}>Qty</Text>
                    <Text style={[s.thText, s.col3]}>Unit Price</Text>
                    <Text style={[s.thText, s.col4]}>Total</Text>
                </View>

                {data.items.map((item, i) => (
                    <View key={i} style={s.row}>
                        <Text style={[s.tdText, s.col1]}>{item.description}</Text>
                        <Text style={[s.tdText, s.col2]}>{item.quantity}</Text>
                        <Text style={[s.tdText, s.col3]}>{sym}{item.rate.toFixed(2)}</Text>
                        <Text style={[s.tdText, s.col4]}>{sym}{item.amount.toFixed(2)}</Text>
                    </View>
                ))}

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

                <Text style={s.footer}>
                    Generated on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · Thank you for your business.
                </Text>

            </Page>
        </Document>
    );
}