'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabasePage() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function testTables() {
      const tables = [
        'profiles',
        'transactions',
        'budgets',
        'car_profiles',
        'fuel_logs',
        'maintenance_logs',
        'reminders'
      ]

      const testResults: Record<string, any> = {}

      for (const table of tables) {
        try {
          const { data, error, count } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true })

          if (error) {
            testResults[table] = { status: 'error', message: error.message }
          } else {
            testResults[table] = { status: 'ok', count: count || 0 }
          }
        } catch (err: any) {
          testResults[table] = { status: 'error', message: err.message }
        }
      }

      setResults(testResults)
      setLoading(false)
    }

    testTables()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Проверка подключения к Supabase...</div>
      </div>
    )
  }

  const allOk = Object.values(results).every((r) => r.status === 'ok')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6">
            🔍 Проверка Supabase
          </h1>

          {allOk ? (
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6">
              <p className="text-green-300 font-semibold">
                ✅ Все таблицы созданы успешно!
              </p>
            </div>
          ) : (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
              <p className="text-red-300 font-semibold">
                ❌ Некоторые таблицы не найдены
              </p>
              <p className="text-red-200 text-sm mt-2">
                Выполните SQL скрипт из файла supabase-schema.sql
              </p>
            </div>
          )}

          <div className="space-y-3">
            {Object.entries(results).map(([table, result]) => (
              <div
                key={table}
                className={`p-4 rounded-xl border ${
                  result.status === 'ok'
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {result.status === 'ok' ? '✅' : '❌'}
                    </span>
                    <div>
                      <p className="text-white font-semibold">{table}</p>
                      {result.status === 'ok' ? (
                        <p className="text-gray-300 text-sm">
                          Записей: {result.count}
                        </p>
                      ) : (
                        <p className="text-red-300 text-sm">{result.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!allOk && (
            <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">
                📝 Как создать таблицы:
              </h2>
              <ol className="text-gray-300 space-y-2 text-sm">
                <li>1. Откройте Supabase Dashboard</li>
                <li>2. Перейдите в SQL Editor (слева в меню)</li>
                <li>3. Нажмите "New query"</li>
                <li>4. Скопируйте содержимое файла supabase-schema.sql</li>
                <li>5. Вставьте в редактор и нажмите "Run"</li>
                <li>6. Обновите эту страницу</li>
              </ol>
            </div>
          )}

          <div className="mt-6">
            <a
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
            >
              ← Вернуться на главную
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
