// Простой скрипт для проверки подключения к Supabase
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fqbsxwqswcydiopwqgct.supabase.co'
const supabaseKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxYnN4d3Fzd2N5ZGlvcHdxZ2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MzY4MDAsImV4cCI6MjA1MjExMjgwMH0.sb_pub1Tshab1e_o1B1zo1RLc3FUBw-rbcjmu_sbVreoxB'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Проверка подключения к Supabase...\n')

  try {
    // Список таблиц для проверки
    const tables = [
      'profiles',
      'transactions',
      'budgets',
      'car_profiles',
      'fuel_logs',
      'maintenance_logs',
      'reminders'
    ]

    console.log('📋 Проверка таблиц:\n')

    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })

        if (error) {
          console.log(`❌ ${table}: ОШИБКА - ${error.message}`)
        } else {
          console.log(`✅ ${table}: OK (записей: ${count || 0})`)
        }
      } catch (err) {
        console.log(`❌ ${table}: ОШИБКА - ${err.message}`)
      }
    }

    console.log('\n🎉 Проверка завершена!')
    console.log('\n💡 Если видите ошибки "relation does not exist":')
    console.log('   1. Откройте Supabase Dashboard → SQL Editor')
    console.log('   2. Скопируйте содержимое файла supabase-schema.sql')
    console.log('   3. Вставьте в SQL Editor и нажмите Run')

  } catch (error) {
    console.error('❌ Ошибка подключения:', error.message)
  }
}

testConnection()
