import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/InvoicePdf";
import { InvoiceTemplateData } from "@/lib/templates/invoice";
import React from "react";
import type { DocumentProps } from "@react-pdf/renderer";

export async function renderInvoicePDF(data: InvoiceTemplateData): Promise<Uint8Array> {
    const element = React.createElement(InvoicePDF, { data }) as React.ReactElement<DocumentProps>;
    const buffer = await renderToBuffer(element);
    return new Uint8Array(buffer);
}