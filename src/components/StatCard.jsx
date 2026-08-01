import React from 'react'

export function StatCard({ title, value, subtext, icon, colorClass = 'text-[#555568]' }) {
  const IconComponent = icon;

  return (
    <div className="p-4 rounded-lg bg-[#111118] border border-[#1e1e2e] space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#555568]">{title}</span>
        {IconComponent && (
          <IconComponent className={`w-4 h-4 ${colorClass}`} />
        )}
      </div>
      <h3 className="text-2xl font-semibold text-white tabular-nums tracking-tight">{value}</h3>
      <p className="text-[11px] text-[#555568] font-medium">{subtext}</p>
    </div>
  )
}