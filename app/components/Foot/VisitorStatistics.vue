<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

interface StatItem {
  label: string
  value: string | number
  icon: string
}

/* =========================
   SUPABASE VISIT LOGIC
========================= */

const { supabase } = useSupabase();

function getWIBDate(date?: Date) {
  // Browser sudah menggunakan timezone lokal (WIB)
  return date || new Date()
}

function todayDate() {
  const now = getWIBDate()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function yesterdayDate() {
  const now = getWIBDate()
  const yesterday = new Date(now.getTime() - 86400000)
  const year = yesterday.getFullYear()
  const month = String(yesterday.getMonth() + 1).padStart(2, '0')
  const day = String(yesterday.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getFirstDayOfMonth() {
  const now = getWIBDate()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-01`
}

function getFirstDayOfYear() {
  const now = getWIBDate()
  const year = now.getFullYear()
  return `${year}-01-01`
}

async function getStats() {
  const today = todayDate()
  const yesterday = yesterdayDate()
  const firstDayOfMonth = getFirstDayOfMonth()
  const firstDayOfYear = getFirstDayOfYear()
  console.log('Fetching stats for dates:', { today, yesterday, firstDayOfMonth, firstDayOfYear })

  const [
    { data: todayData },
    { data: yesterdayData },
    { data: monthData },
    { data: yearData },
    { data: totalData },
    { data: profilesData, count: profilesCount }
  ] = await Promise.all([
    supabase.from('visit_stats').select('count').eq('date', today).maybeSingle(),
    supabase.from('visit_stats').select('count').eq('date', yesterday).maybeSingle(),
    supabase.from('visit_stats').select('count').gte('date', firstDayOfMonth).lte('date', today),
    supabase.from('visit_stats').select('count').gte('date', firstDayOfYear).lte('date', today),
    supabase.from('visit_stats').select('count'),
    supabase.from('profiles').select('*', { count: 'exact', head: true })
  ])

  const thisMonth = monthData?.reduce((s: number, r: any) => s + r.count, 0) || 0
  const thisYear = yearData?.reduce((s: number, r: any) => s + r.count, 0) || 0
  const total = totalData?.reduce((s: number, r: any) => s + r.count, 0) || 0

  return {
    today: todayData?.count || 0,
    yesterday: yesterdayData?.count || 0,
    thisMonth: thisMonth,
    thisYear: thisYear,
    total: total,
    totalUsers: profilesCount || 0
  }
}

const onlineUsersCount = ref(0)
let presenceChannel: any = null

function setupRealtimePresence() {
  if (import.meta.server) return

  // Create a unique user ID for this session
  const sessionId = `user_${Math.random().toString(36).substring(2, 15)}`
  
  // Create presence channel
  presenceChannel = supabase.channel('online_users', {
    config: {
      presence: {
        key: sessionId
      }
    }
  })

  // Subscribe to presence changes
  presenceChannel
    .on('presence', { event: 'sync' }, () => {
      const presenceState = presenceChannel.presenceState()
      onlineUsersCount.value = Object.keys(presenceState).length
    })
    .subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        // Track this user as online
        await presenceChannel.track({
          online_at: new Date().toISOString()
        })
      }
    })
}

function cleanupRealtimePresence() {
  if (presenceChannel) {
    supabase.removeChannel(presenceChannel)
    presenceChannel = null
  }
}

async function getIPAddress() {
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    return data.ip
  } catch {
    return 'Unknown'
  }
}

/* =========================
   STATS STATE
========================= */

const stats = ref<StatItem[]>([])

onMounted(async () => {
  setupRealtimePresence()

  const [stat, ip] = await Promise.all([
    getStats(),
    getIPAddress()
  ])

  stats.value = [
    { label: 'Pengunjung Hari Ini', value: stat.today.toLocaleString(), icon: 'i-mdi-account-clock' },
    { label: 'Pengunjung Kemarin', value: stat.yesterday.toLocaleString(), icon: 'i-mdi-account-outline' },
    { label: 'Bulan Ini', value: stat.thisMonth.toLocaleString(), icon: 'i-mdi-calendar-month' },
    { label: 'Tahun Ini', value: stat.thisYear.toLocaleString(), icon: 'i-mdi-calendar' },
    { label: 'Total Pengunjung', value: stat.total.toLocaleString(), icon: 'i-mdi-chart-line' },
    { label: 'Total Pengguna', value: stat.totalUsers.toLocaleString(), icon: 'i-mdi-account-group' },
    { label: 'Sedang Online', value: onlineUsersCount, icon: 'i-mdi-account-multiple' },
    { label: 'Alamat IP Anda', value: ip, icon: 'i-mdi-ip-network' }
  ]
})

onBeforeUnmount(() => {
  cleanupRealtimePresence()
})
</script>

<template>
  <div class="glass-panel mb-8 p-6 rounded-2xl backdrop-blur-md bg-white/70 dark:bg-green-900/30 shadow-lg border border-white/20 dark:border-green-800/30">
    <h3 class="text-xl font-bold text-center mb-6 text-green-800 dark:text-green-200">
      Statistik Kunjungan
    </h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div 
        v-for="(stat, index) in stats" 
        :key="index"
        class="stat-card flex items-center space-x-3 p-4 rounded-xl bg-linear-to-br from-white/50 to-green-50/30 dark:from-green-800/20 dark:to-green-900/10 border border-green-200/40 dark:border-green-700/30 hover:shadow-md transition-shadow"
      >
        <div class="stat-icon flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 dark:bg-green-800/40 flex items-center justify-center">
          <UIcon :name="stat.icon" class="text-xl text-green-600 dark:text-green-400" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs text-green-600/70 dark:text-green-400/70 font-medium mb-0.5">{{ stat.label }}</p>
          <p class="text-sm font-bold text-green-800 dark:text-green-200 truncate">{{ stat.value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Glassmorphism effect */
.glass-panel {
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Stat card */
.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  transition: background-color 0.3s ease;
}

.stat-card:hover .stat-icon {
  background-color: rgba(34, 197, 94, 0.2);
}

.dark .stat-card:hover .stat-icon {
  background-color: rgba(34, 197, 94, 0.15);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .stat-card {
    padding: 0.75rem;
  }
  
  .stat-icon {
    width: 2rem;
    height: 2rem;
  }
}

@media (prefers-reduced-motion) {
  .stat-card {
    transition: none;
  }
}
</style>