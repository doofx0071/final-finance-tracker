'use client'

import React from 'react'

interface ChartData {
  [key: string]: any
}

interface BarChartProps {
  data: ChartData[]
  xKey: string
  yKeys: string[]
}

export function BarChart({ data, xKey, yKeys }: BarChartProps) {
  return (
    <div className="w-full h-full flex items-end justify-around gap-2 p-4">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex gap-1 items-end">
            {yKeys.map((key, i) => {
              const value = item[key] || 0
              const maxValue = Math.max(...data.flatMap(d => yKeys.map(k => d[k] || 0)))
              const height = (value / maxValue) * 100
              return (
                <div
                  key={key}
                  className={`flex-1 ${i === 0 ? 'bg-green-500' : 'bg-red-500'} rounded-t`}
                  style={{ height: `${height}%` }}
                  title={`${key}: ${value}`}
                />
              )
            })}
          </div>
          <span className="text-xs text-muted-foreground">{item[xKey]}</span>
        </div>
      ))}
    </div>
  )
}

interface LineChartProps {
  data: ChartData[]
  xKey: string
  yKey: string
}

export function LineChart({ data, xKey, yKey }: LineChartProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-muted-foreground">
        Line chart visualization
      </div>
    </div>
  )
}

interface PieChartProps {
  data: ChartData[]
  nameKey: string
  dataKey: string
}

export function PieChart({ data, nameKey, dataKey }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0)
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500']
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-4">
        <div className="w-48 h-48 rounded-full relative overflow-hidden border-4">
          {data.map((item, index) => {
            const percentage = ((item[dataKey] || 0) / total) * 100
            return (
              <div
                key={index}
                className={`absolute inset-0 ${colors[index % colors.length]}`}
                style={{
                  clipPath: `polygon(50% 50%, ${50 + percentage}% 0%, 100% ${percentage}%)`,
                  opacity: 0.8
                }}
              />
            )
          })}
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${colors[index % colors.length]}`} />
              <span className="text-sm">
                {item[nameKey]}: ₱{item[dataKey]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
