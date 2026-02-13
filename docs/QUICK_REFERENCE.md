# 🚀 Quick Reference Guide - JuruTani Database

## 📌 Frequently Used Patterns

### 1. Get Current User Profile
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()
```

### 2. Create Conversation
```typescript
const { data: conversationId } = await supabase
  .rpc('create_or_get_conversation', { 
    other_user_id: recipientId 
  })
```

### 3. Send Message
```typescript
const { data } = await supabase
  .from('messages')
  .insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content: messageText
  })
```

### 4. Get Published News
```typescript
import { NEWS_STATUS } from '@/constants/enum'

const { data } = await supabase
  .from('news')
  .select('*, profiles(full_name, avatar_url)')
  .eq('status_news', NEWS_STATUS.PUBLISHED)
  .is('deleted_at', null)
  .order('published_at', { ascending: false })
  .range(0, 9)
```

### 5. Create Market Item
```typescript
import { MARKET_STATUS } from '@/constants/enum'

const { data } = await supabase
  .from('markets')
  .insert({
    name: 'Product Name',
    category: CATEGORY_MARKETS.BENIH,
    description: 'Description',
    price: 50000,
    status: MARKET_STATUS.DRAFT,
    user_id: user.id
  })
```

### 6. Search Users
```typescript
const { data } = await supabase
  .rpc('search_users', { 
    search_term: 'john',
    user_limit: 20
  })
```

### 7. Get User Stats
```typescript
const { data: stats } = await supabase
  .rpc('get_user_stats', { p_user_id: userId })
```

### 8. Mark Notifications as Read
```typescript
await supabase.rpc('mark_all_notifications_read')
```

### 9. Get Unread Counts
```typescript
const { data: msgCount } = await supabase
  .rpc('get_unread_messages_count')

const { data: notifCount } = await supabase
  .rpc('get_unread_notifications_count')
```

### 10. Publish Content
```typescript
import { NEWS_STATUS } from '@/constants/enum'

const { data } = await supabase
  .from('news')
  .update({ 
    status_news: NEWS_STATUS.PUBLISHED,
    published_at: new Date().toISOString()
  })
  .eq('id', newsId)
```

---

## 🔐 RLS Quick Check

### Who can access what?

| Table | Public Read | Owner Write | Admin Full |
|-------|-------------|-------------|------------|
| profiles | ✅ | ✅ | ✅ |
| conversations | ❌ (Participants) | ✅ | ❌ |
| messages | ❌ (Participants) | ✅ | ❌ |
| notifications | ❌ (Owner) | ✅ | ❌ |
| experts | ✅ | ✅ | ✅ |
| instructors | ✅ | ✅ | ✅ |
| markets | ✅ (Published) | ✅ | ✅ |
| news | ✅ (Published) | ✅ | ✅ |
| courses | ✅ | ❌ | ✅ |
| videos | ✅ | ❌ | ✅ |
| banner | ✅ | ❌ | ✅ |
| categories | ✅ | ❌ | ✅ |
| districts | ✅ | ❌ | ✅ |

---

## 🎯 Common Enums

### User Roles
```typescript
import { USER_ROLES } from '@/constants/enum'

USER_ROLES.USER        // 'user'
USER_ROLES.EXPERT      // 'expert'
USER_ROLES.INSTRUCTOR  // 'instructor'
USER_ROLES.ADMIN       // 'admin'
```

### Content Status
```typescript
import { NEWS_STATUS, MARKET_STATUS } from '@/constants/enum'

NEWS_STATUS.DRAFT      // 'draft'
NEWS_STATUS.PUBLISHED  // 'published'
NEWS_STATUS.ARCHIVED   // 'archived'

MARKET_STATUS.SOLD     // 'sold' (additional)
```

### Categories
```typescript
import { 
  CATEGORY_EXPERT, 
  CATEGORY_MARKETS, 
  CATEGORY_NEWS 
} from '@/constants/enum'

CATEGORY_EXPERT.PERTANIAN
CATEGORY_MARKETS.BENIH
CATEGORY_NEWS.ARTIKEL
```

---

## ⚡ Performance Tips

### ✅ DO:
```typescript
// 1. Select specific columns
.select('id, name, avatar_url')

// 2. Use pagination
.range(start, end)

// 3. Filter on server
.eq('status', 'published')

// 4. Use indexes (automatic)
.eq('user_id', userId)
.order('created_at', { ascending: false })

// 5. Use RPC for complex queries
.rpc('function_name', { params })
```

### ❌ DON'T:
```typescript
// 1. Select all columns unnecessarily
.select('*')

// 2. Fetch all records
.select('*') // without range()

// 3. Filter on client
const all = await fetch()
const filtered = all.filter()

// 4. Multiple sequential queries (N+1)
for (const item of items) {
  await fetch(item.id)
}

// 5. Complex logic on client
// Use database functions instead
```

---

## 🔧 Troubleshooting

### "Row violates RLS policy"
**Problem**: User can't access data  
**Solution**: Check if user is authenticated and has proper permissions

```typescript
// Check auth
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)

// Check role
const { data } = await supabase.rpc('get_user_role')
console.log('Role:', data)
```

### "No rows returned"
**Problem**: Data exists but not accessible  
**Solutions**:
1. Check RLS policies
2. Verify deleted_at IS NULL
3. Check status field (published vs draft)

```typescript
// Add logging
const { data, error } = await supabase
  .from('table')
  .select('*')
  
console.log('Data:', data)
console.log('Error:', error)
```

### "Slow query"
**Problem**: Query takes too long  
**Solutions**:
1. Add proper indexes (already done)
2. Reduce selected columns
3. Add pagination
4. Use proper filtering

```typescript
// Before (slow)
const { data } = await supabase
  .from('news')
  .select('*, profiles(*), comments(*)')

// After (fast)
const { data } = await supabase
  .from('news')
  .select('id, title, image_url, profiles(full_name)')
  .eq('status_news', 'published')
  .range(0, 9)
```

---

## 📱 Real-time Subscriptions

### Listen to New Messages
```typescript
const channel = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    },
    (payload) => {
      console.log('New message:', payload.new)
    }
  )
  .subscribe()
```

### Listen to Notifications
```typescript
const channel = supabase
  .channel('notifications')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${user.id}`
    },
    (payload) => {
      console.log('New notification:', payload.new)
    }
  )
  .subscribe()
```

---

## 🧪 Testing Checklist

### Security Testing:
```typescript
// 1. Test RLS - Try to access other user's data
const { data, error } = await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', 'other-user-id')
  
// Should return empty or error
expect(data).toEqual([])

// 2. Test role-based access
const { error } = await supabase
  .from('courses')
  .insert({ title: 'Test' })
  
// Should fail if not admin
expect(error).toBeTruthy()

// 3. Test soft delete
const { data } = await supabase
  .from('news')
  .select('*')
  .eq('id', deletedNewsId)
  
// Should not return deleted items
expect(data).toEqual([])
```

### Performance Testing:
```typescript
// 1. Measure query time
console.time('query')
const { data } = await supabase
  .from('news')
  .select('*')
  .range(0, 9)
console.timeEnd('query')
// Should be < 100ms

// 2. Check pagination
const page1 = await supabase
  .from('news')
  .select('*')
  .range(0, 9)

const page2 = await supabase
  .from('news')
  .select('*')
  .range(10, 19)

// Should not overlap
expect(page1.data).not.toEqual(page2.data)
```

---

## 🔄 Migration Commands

```bash
# Create new migration
supabase migration new migration_name

# Run migrations
supabase db push

# Reset database (local)
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > app/types/database.types.ts
```

---

## 📊 Useful Queries

### Get top contributors
```typescript
const { data } = await supabase
  .from('profiles')
  .select(`
    id,
    full_name,
    markets:markets(count),
    news:news(count)
  `)
  .order('markets(count)', { ascending: false })
  .limit(10)
```

### Get popular categories
```typescript
const { data } = await supabase
  .from('markets')
  .select('category')
  .eq('status', 'published')

const categoryCounts = data.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + 1
  return acc
}, {})
```

### Get recent activity
```typescript
const { data } = await supabase
  .from('news')
  .select('*, profiles(full_name)')
  .order('created_at', { ascending: false })
  .limit(20)
```

---

## 💡 Pro Tips

1. **Use TypeScript types**
```typescript
import type { Tables } from '@/types/database.types'

type Profile = Tables<'profiles'>
type News = Tables<'news'>
```

2. **Handle errors gracefully**
```typescript
const { data, error } = await supabase
  .from('news')
  .select('*')

if (error) {
  console.error('Error:', error)
  // Show user-friendly message
  return
}

// Process data
```

3. **Use optimistic updates**
```typescript
// Update UI immediately
setMessages([...messages, newMessage])

// Then sync with server
const { error } = await supabase
  .from('messages')
  .insert(newMessage)

if (error) {
  // Revert optimistic update
  setMessages(messages)
}
```

4. **Cache static data**
```typescript
// Cache categories, districts, etc.
const categories = await getCachedCategories()
```

5. **Use helper functions**
```typescript
// Don't reinvent the wheel
await supabase.rpc('mark_all_notifications_read')
// Instead of manual UPDATE query
```

---

**Quick Reference Version**: 1.0.0  
**Last Updated**: February 2026
