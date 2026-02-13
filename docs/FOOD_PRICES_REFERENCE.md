# 🌾 Food Prices Table - Quick Reference

## 📊 Table Overview

**Table Name:** `food_prices`  
**Purpose:** Store historical food commodity prices with categories  
**Access:** Public read, Admin write  
**Soft Delete:** Yes

---

## 🗂️ Table Schema

```sql
CREATE TABLE food_prices (
  id UUID PRIMARY KEY,
  commodity VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

### Constraints
- `price` must be >= 0
- `category` must be one of: 'hortikultura', 'perkebunan', 'perikanan', 'peternakan'
- Unique constraint: `commodity + date` (no duplicates for same day)

---

## 🎯 Categories (Enum)

```typescript
import { CATEGORY_FOOD_PRICES } from '@/constants/enum'

CATEGORY_FOOD_PRICES.HORTIKULTURA  // 'hortikultura'
CATEGORY_FOOD_PRICES.PERKEBUNAN    // 'perkebunan'
CATEGORY_FOOD_PRICES.PERIKANAN     // 'perikanan'
CATEGORY_FOOD_PRICES.PETERNAKAN    // 'peternakan'
```

### Labels (Indonesian)
```typescript
import { CATEGORY_FOOD_PRICES_LABELS } from '@/constants/enum'

CATEGORY_FOOD_PRICES_LABELS[CATEGORY_FOOD_PRICES.HORTIKULTURA] // 'Hortikultura'
CATEGORY_FOOD_PRICES_LABELS[CATEGORY_FOOD_PRICES.PETERNAKAN]   // 'Peternakan'
```

---

## 🔐 RLS Policies

| Operation | Who can access |
|-----------|---------------|
| SELECT | Public (anon + authenticated) |
| INSERT | Admin only |
| UPDATE | Admin only |
| DELETE | Admin only (soft delete) |

---

## 📚 Helper Functions

### 1. Get Latest Price for Commodity

```typescript
// Get latest price for "Daging Ayam Ras"
const { data } = await supabase
  .rpc('get_latest_food_price', { 
    p_commodity: 'Daging Ayam Ras' 
  })

// Returns:
// {
//   id: 'uuid',
//   commodity: 'Daging Ayam Ras',
//   category: 'peternakan',
//   price: 40857,
//   date: '2026-02-12'
// }
```

### 2. Get Price Trend (with Change %)

```typescript
// Get price trend for last 30 days
const { data } = await supabase
  .rpc('get_food_price_trend', { 
    p_commodity: 'Daging Ayam Ras',
    p_days: 30
  })

// Returns array:
// [
//   {
//     date: '2026-02-12',
//     price: 40857,
//     price_change: 619,
//     price_change_percent: 1.54
//   },
//   {
//     date: '2026-02-09',
//     price: 40238,
//     price_change: 3238,
//     price_change_percent: 8.75
//   }
// ]
```

### 3. Get Prices by Category

```typescript
import { CATEGORY_FOOD_PRICES } from '@/constants/enum'

// Get all livestock (peternakan) prices - latest only
const { data } = await supabase
  .rpc('get_food_prices_by_category', { 
    p_category: CATEGORY_FOOD_PRICES.PETERNAKAN,
    p_latest_only: true
  })

// Returns:
// [
//   {
//     commodity: 'Daging Ayam Ras',
//     price: 40857,
//     date: '2026-02-12',
//     category: 'peternakan'
//   },
//   {
//     commodity: 'Telur Ayam Ras',
//     price: 30060,
//     date: '2026-02-12',
//     category: 'peternakan'
//   }
// ]

// Get all historical prices for category
const { data: historicalData } = await supabase
  .rpc('get_food_prices_by_category', { 
    p_category: CATEGORY_FOOD_PRICES.PETERNAKAN,
    p_latest_only: false
  })
```

### 4. Get Price Statistics

```typescript
// Get comprehensive stats for a commodity
const { data } = await supabase
  .rpc('get_food_price_stats', { 
    p_commodity: 'Daging Ayam Ras',
    p_days: 30
  })

// Returns JSON:
// {
//   "commodity": "Daging Ayam Ras",
//   "period_days": 30,
//   "latest_price": 40857,
//   "latest_date": "2026-02-12",
//   "avg_price": 36125,
//   "min_price": 34450,
//   "max_price": 40857,
//   "data_points": 12
// }
```

### 5. Search Commodities

```typescript
// Search by commodity name
const { data } = await supabase
  .rpc('search_food_commodities', { 
    p_search_term: 'ayam',
    p_limit: 20
  })

// Returns:
// [
//   {
//     commodity: 'Daging Ayam Ras',
//     category: 'peternakan',
//     latest_price: 40857,
//     latest_date: '2026-02-12'
//   },
//   {
//     commodity: 'Telur Ayam Ras',
//     category: 'peternakan',
//     latest_price: 30060,
//     latest_date: '2026-02-12'
//   }
// ]
```

---

## 💡 Common Use Cases

### Display Latest Prices on Homepage

```typescript
import { CATEGORY_FOOD_PRICES } from '@/constants/enum'

export const useFoodPrices = () => {
  const supabase = useSupabase()
  
  // Get latest prices for all categories
  const getLatestPrices = async () => {
    const categories = [
      CATEGORY_FOOD_PRICES.HORTIKULTURA,
      CATEGORY_FOOD_PRICES.PERKEBUNAN,
      CATEGORY_FOOD_PRICES.PERIKANAN,
      CATEGORY_FOOD_PRICES.PETERNAKAN
    ]
    
    const promises = categories.map(cat => 
      supabase.rpc('get_food_prices_by_category', {
        p_category: cat,
        p_latest_only: true
      })
    )
    
    const results = await Promise.all(promises)
    return results.map((r, i) => ({
      category: categories[i],
      prices: r.data || []
    }))
  }
  
  return { getLatestPrices }
}
```

### Show Price Chart (Last 30 Days)

```typescript
export const usePriceChart = (commodity: string) => {
  const supabase = useSupabase()
  
  const getPriceHistory = async () => {
    const { data } = await supabase
      .rpc('get_food_price_trend', {
        p_commodity: commodity,
        p_days: 30
      })
    
    return data?.map(item => ({
      date: new Date(item.date),
      price: item.price,
      change: item.price_change,
      changePercent: item.price_change_percent
    }))
  }
  
  return { getPriceHistory }
}
```

### Price Comparison Widget

```typescript
export const usePriceComparison = () => {
  const supabase = useSupabase()
  
  const comparePrices = async (commodities: string[]) => {
    const promises = commodities.map(commodity =>
      supabase.rpc('get_food_price_stats', {
        p_commodity: commodity,
        p_days: 30
      })
    )
    
    const results = await Promise.all(promises)
    return results.map(r => r.data)
  }
  
  return { comparePrices }
}
```

### Admin: Add New Price

```typescript
import { CATEGORY_FOOD_PRICES } from '@/constants/enum'

export const useAdminFoodPrices = () => {
  const supabase = useSupabase()
  
  const addPrice = async (data: {
    commodity: string
    category: string
    price: number
    date?: string
  }) => {
    const { data: result, error } = await supabase
      .from('food_prices')
      .insert({
        commodity: data.commodity,
        category: data.category,
        price: data.price,
        date: data.date || new Date().toISOString().split('T')[0]
      })
    
    if (error) throw error
    return result
  }
  
  return { addPrice }
}

// Usage
const { addPrice } = useAdminFoodPrices()

await addPrice({
  commodity: 'Beras Premium',
  category: CATEGORY_FOOD_PRICES.HORTIKULTURA,
  price: 15000,
  date: '2026-02-14'
})
```

---

## 📊 Query Examples

### Get All Prices (with Pagination)

```typescript
const { data, count } = await supabase
  .from('food_prices')
  .select('*', { count: 'exact' })
  .is('deleted_at', null)
  .order('date', { ascending: false })
  .range(0, 19) // First 20 items
```

### Filter by Category

```typescript
import { CATEGORY_FOOD_PRICES } from '@/constants/enum'

const { data } = await supabase
  .from('food_prices')
  .select('*')
  .eq('category', CATEGORY_FOOD_PRICES.PETERNAKAN)
  .is('deleted_at', null)
  .order('date', { ascending: false })
  .limit(50)
```

### Filter by Date Range

```typescript
const startDate = '2026-01-01'
const endDate = '2026-01-31'

const { data } = await supabase
  .from('food_prices')
  .select('*')
  .gte('date', startDate)
  .lte('date', endDate)
  .is('deleted_at', null)
  .order('date', { ascending: false })
```

### Get Specific Commodity History

```typescript
const { data } = await supabase
  .from('food_prices')
  .select('date, price')
  .eq('commodity', 'Daging Ayam Ras')
  .is('deleted_at', null)
  .order('date', { ascending: false })
  .limit(30)
```

---

## 🎨 UI Components Examples

### Price Card Component

```vue
<script setup lang="ts">
import { CATEGORY_FOOD_PRICES_LABELS } from '@/constants/enum'
import type { Tables } from '@/types/database.types'

const props = defineProps<{
  price: Tables<'food_prices'>
}>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="price-card">
    <h3>{{ props.price.commodity }}</h3>
    <span class="category">
      {{ CATEGORY_FOOD_PRICES_LABELS[props.price.category] }}
    </span>
    <p class="price">{{ formatPrice(props.price.price) }}</p>
    <time>{{ formatDate(props.price.date) }}</time>
  </div>
</template>
```

### Price Trend Chart

```vue
<script setup lang="ts">
const props = defineProps<{
  commodity: string
}>()

const supabase = useSupabase()
const chartData = ref([])

onMounted(async () => {
  const { data } = await supabase
    .rpc('get_food_price_trend', {
      p_commodity: props.commodity,
      p_days: 30
    })
  
  chartData.value = data
})
</script>

<template>
  <div class="price-chart">
    <h3>Grafik Harga {{ commodity }}</h3>
    <!-- Use your favorite chart library -->
    <LineChart :data="chartData" />
  </div>
</template>
```

---

## 🔍 Search & Filter Pattern

```typescript
export const useFoodPriceSearch = () => {
  const supabase = useSupabase()
  
  const search = async (filters: {
    commodity?: string
    category?: string
    dateFrom?: string
    dateTo?: string
    limit?: number
  }) => {
    let query = supabase
      .from('food_prices')
      .select('*')
      .is('deleted_at', null)
    
    if (filters.commodity) {
      query = query.ilike('commodity', `%${filters.commodity}%`)
    }
    
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters.dateFrom) {
      query = query.gte('date', filters.dateFrom)
    }
    
    if (filters.dateTo) {
      query = query.lte('date', filters.dateTo)
    }
    
    query = query
      .order('date', { ascending: false })
      .limit(filters.limit || 50)
    
    const { data, error } = await query
    return { data, error }
  }
  
  return { search }
}
```

---

## 📈 Performance Tips

### ✅ DO:
```typescript
// 1. Use RPC functions for complex queries
await supabase.rpc('get_food_price_trend', { ... })

// 2. Filter deleted records
.is('deleted_at', null)

// 3. Use pagination
.range(0, 19)

// 4. Select specific columns
.select('commodity, price, date')

// 5. Use indexes (automatic)
.eq('category', 'peternakan')
.order('date', { ascending: false })
```

### ❌ DON'T:
```typescript
// 1. Don't fetch all records
.select('*') // without range()

// 2. Don't filter on client
const all = await fetch()
const filtered = all.filter(...)

// 3. Don't ignore deleted_at
// Always check: .is('deleted_at', null)
```

---

## 🧪 Testing Examples

```typescript
describe('Food Prices', () => {
  it('should get latest price', async () => {
    const { data } = await supabase
      .rpc('get_latest_food_price', {
        p_commodity: 'Daging Ayam Ras'
      })
    
    expect(data).toBeDefined()
    expect(data.commodity).toBe('Daging Ayam Ras')
    expect(data.price).toBeGreaterThan(0)
  })
  
  it('should calculate price trend correctly', async () => {
    const { data } = await supabase
      .rpc('get_food_price_trend', {
        p_commodity: 'Daging Ayam Ras',
        p_days: 7
      })
    
    expect(Array.isArray(data)).toBe(true)
    expect(data[0]).toHaveProperty('price_change_percent')
  })
})
```

---

## 📝 Initial Data (Already Inserted)

- **Daging Ayam Ras**: 12 records (Jan 05 - Feb 12, 2026)
- **Telur Ayam Ras**: 12 records (Jan 05 - Feb 12, 2026)
- **Daging Sapi Murni**: 12 records (Jan 05 - Feb 12, 2026)
- **Category**: All are 'peternakan' (Livestock)
- **Total**: 36 records

---

## 🔄 Future Enhancements

### Planned Features:
1. **Price Alerts** - Notify when price changes significantly
2. **Price Predictions** - ML-based price forecasting
3. **Regional Prices** - Add location/region field
4. **Market Sources** - Track price sources
5. **Bulk Import** - CSV import for admins
6. **API Export** - JSON/CSV export functionality

---

**Quick Reference Version**: 1.0.0  
**Last Updated**: February 2026  
**Table Status**: ✅ Ready to use
