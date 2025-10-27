import React from 'react'
import { Progress } from './ui/progress' // Você já tem este componente em components/ui

export function UsageCard({ title, count, limit, icon, colorClass = 'text-blue-400' }) {
  const IconComponent = icon;
  const percentage = limit > 0 ? (count / limit) * 100 : 0;
  
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 bg-slate-900 rounded-lg ${colorClass}`}>
          {IconComponent && <IconComponent size={20} />}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-white">{count}</p>
          <p className="text-xs text-slate-500">/ {limit}</p>
        </div>
      </div>
      
      <h3 className="text-md font-semibold text-white mb-2">{title}</h3>
      <p className="text-xs text-slate-400 mb-3">
        {limit - count} restantes este mês
      </p>
      
      {/* Para a barra de progresso funcionar, você precisa ter 
        o componente 'progress.jsx' de shadcn/ui.
        Seu 'src/components/ui/progress.jsx' já deve existir.
      */}
      <Progress value={percentage} className="h-2" />
    </div>
  )
}