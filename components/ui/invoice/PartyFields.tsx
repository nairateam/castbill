type Props = {
    label: string;
    name: string; onName: (v: string) => void;
    email: string; onEmail: (v: string) => void;
    phone: string; onPhone: (v: string) => void;
    address: string; onAddress: (v: string) => void;
    inputCls: string;
    labelCls: string;
    accentColor?: string;
};

export default function PartyFields({ label, name, onName, email, onEmail, phone, onPhone, address, onAddress, inputCls, labelCls, accentColor = "var(--accent2)" }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className={labelCls}>Name <span style={{ color: accentColor }}>*</span></label>
                <input className={inputCls} value={name} onChange={(e) => onName(e.target.value)} placeholder={label === "From — You" ? "Your name or company" : "Client name or company"} />
            </div>
            <div>
                <label className={labelCls}>Email <span style={{ color: accentColor }}>*</span></label>
                <input type="email" className={inputCls} value={email} onChange={(e) => onEmail(e.target.value)} placeholder={label === "From — You" ? "you@company.com" : "client@company.com"} />
            </div>
            <div>
                <label className={labelCls}>Phone</label>
                <input className={inputCls} value={phone} onChange={(e) => onPhone(e.target.value)} placeholder="+234 801 234 5678" />
            </div>
            <div>
                <label className={labelCls}>Address</label>
                <input className={inputCls} value={address} onChange={(e) => onAddress(e.target.value)} placeholder="123 Main St, City" />
            </div>
        </div>
    );
}