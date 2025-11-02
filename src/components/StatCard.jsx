import React from 'react'

export function StatCard({ title, value, subtext, icon, colorClass = 'text-blue-400' }) {
  const IconComponent = icon;
  
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          <p className="text-xs text-slate-500 mt-1">{subtext}</p>
        </div>
        {/* CORREÇÃO: Remove o fundo 'bg-slate-900' para bater com o design */}
        {IconComponent && (
          <div className={`${colorClass}`}>
            <IconComponent size={24} /> {/* Tamanho opcionalmente um pouco maior */}
          </div>
        )}
      </div>
    </div>
  )
}