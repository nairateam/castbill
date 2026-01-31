import StatCard from "@/components/StatsCard"
import { CheckCircle, Clock10, InfoIcon, Receipt } from "lucide-react"

export default function Stats() {
    const stats = [
        {
            value: '60',
            label: 'Total Invoices',
            icon: <Receipt />,
            color: '#39A78D',
            helper: '+12%'
        },
        {
            value: '$32',
            label: 'Total Paid',
            icon: <CheckCircle />,
            color: '#01796F',
            helper: '+12%'
        },
        {
            value: '$26',
            label: 'Pending',
            icon: <Clock10 />,
            color: '#FA824C',
            helper: '12 Active'
        },
        {
            value: '$2',
            label: 'Overdue',
            icon: <InfoIcon />,
            color: '#F42C04',
            helper: '+12%'
        },
    ]
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-8">
            {
                stats.map((stat, index) => (
                    <div key={index}>
                        <StatCard
                            label={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                            color={stat.color}
                            helperText={stat.helper}
                        />
                    </div>
                ))
            }
        </div>
    )
}