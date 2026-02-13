# 📚 JuruTani Database Documentation

Welcome to the comprehensive database documentation for JuruTani project. This documentation contains everything you need to understand, implement, and maintain the database structure.

---

## 📖 Documentation Index

### 🎯 Getting Started
Start here if you're new to the project:

1. **[DATABASE_ANALYSIS.md](./DATABASE_ANALYSIS.md)** - Complete analysis and optimization strategy
   - Executive summary
   - Database structure overview
   - RLS strategy
   - Performance optimization
   - Best practices
   - Monitoring & maintenance

### 🗺️ Understanding the Database
For understanding the database structure:

2. **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Detailed schema and relationships
   - Entity relationship diagram
   - Table categories
   - Relationship details
   - Constraints & rules
   - Index strategy
   - Data size estimates

### ⚡ Daily Reference
Quick reference for developers:

3. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Frequently used patterns and code snippets
   - Common queries
   - Enum usage
   - Performance tips
   - Troubleshooting
   - Real-time subscriptions
   - Testing examples

### 🚀 Implementation
Step-by-step implementation guide:

4. **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Complete implementation steps
   - Pre-implementation checklist
   - Phase-by-phase deployment
   - Testing procedures
   - Troubleshooting guide
   - Rollback plan
   - Success metrics

---

## 📁 File Structure

```
jurutanibackup/
├── app/
│   ├── constants/
│   │   └── enum.ts                    # Enums and constants
│   ├── types/
│   │   └── database.types.ts          # TypeScript types
│   └── composables/
│       ├── useAuth.ts
│       ├── useDatabase.ts
│       └── ...
├── docs/
│   ├── README.md                      # 👈 You are here
│   ├── DATABASE_ANALYSIS.md           # Comprehensive analysis
│   ├── DATABASE_SCHEMA.md             # Schema documentation
│   ├── QUICK_REFERENCE.md             # Quick reference guide
│   └── IMPLEMENTATION_GUIDE.md        # Implementation steps
├── supabase/
│   ├── migrations/
│   │   ├── 001_helper_functions.sql   # Helper functions & indexes
│   │   └── 002_rls_policies.sql       # RLS policies
│   └── schema.sql                     # Initial schema
└── README.md
```

---

## 🎯 Quick Navigation

### For New Team Members
1. Read [DATABASE_ANALYSIS.md](./DATABASE_ANALYSIS.md) - Overview
2. Study [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Understanding structure
3. Bookmark [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Daily usage

### For Developers
1. Use [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Code patterns
2. Check [DATABASE_ANALYSIS.md#best-practices](./DATABASE_ANALYSIS.md#-best-practices) - Best practices
3. Import from `app/constants/enum.ts` - Use enums

### For Database Administrators
1. Review [DATABASE_SCHEMA.md#index-strategy](./DATABASE_SCHEMA.md#-index-strategy) - Indexes
2. Follow [DATABASE_ANALYSIS.md#monitoring--maintenance](./DATABASE_ANALYSIS.md#-monitoring--maintenance) - Monitoring
3. Check `supabase/migrations/` - Migration files

### For DevOps/Deployment
1. Follow [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Step-by-step
2. Review [IMPLEMENTATION_GUIDE.md#rollback-plan](./IMPLEMENTATION_GUIDE.md#-rollback-plan) - Rollback
3. Monitor [IMPLEMENTATION_GUIDE.md#success-metrics](./IMPLEMENTATION_GUIDE.md#-success-metrics) - Metrics

### For QA/Testing
1. Use [IMPLEMENTATION_GUIDE.md#phase-3-testing](./IMPLEMENTATION_GUIDE.md#phase-3-testing-2-3-hours) - Test cases
2. Check [QUICK_REFERENCE.md#testing-checklist](./QUICK_REFERENCE.md#-testing-checklist) - Test patterns
3. Verify [DATABASE_ANALYSIS.md#security-considerations](./DATABASE_ANALYSIS.md#️-security-considerations) - Security

---

## 🔑 Key Features

### ✅ Row Level Security (RLS)
- **21 tables** with RLS enabled
- **60+ policies** for granular access control
- **Performance optimized** with STABLE functions
- **Defense in depth** security strategy

### ⚡ Performance Optimization
- **22+ indexes** for query optimization
- **Partial indexes** for filtered queries
- **Composite indexes** for complex queries
- **STABLE functions** for query-level caching

### 🎯 Helper Functions
- **15+ helper functions** for common operations
- **Authorization checks** (is_admin, is_owner, etc.)
- **Business logic** (create_or_get_conversation, etc.)
- **Utility functions** (search_users, get_stats, etc.)

### 📦 Enums & Constants
- **9 enum categories** for type safety
- **Centralized constants** in `app/constants/enum.ts`
- **Type-safe** with TypeScript
- **Validation helpers** included

---

## 🚀 Quick Start

### 1. Apply Database Migrations
```bash
# Apply helper functions
psql -f supabase/migrations/001_helper_functions.sql

# Apply RLS policies
psql -f supabase/migrations/002_rls_policies.sql
```

### 2. Import Enums in Code
```typescript
import { 
  USER_ROLES, 
  NEWS_STATUS, 
  CATEGORY_MARKETS 
} from '@/constants/enum'

// Use in your code
if (user.role === USER_ROLES.ADMIN) {
  // Admin logic
}
```

### 3. Use Helper Functions
```typescript
// Create conversation
const { data } = await supabase
  .rpc('create_or_get_conversation', { 
    other_user_id: userId 
  })

// Get unread count
const { data: count } = await supabase
  .rpc('get_unread_messages_count')
```

### 4. Query with RLS
```typescript
// RLS automatically filters data
const { data } = await supabase
  .from('notifications')
  .select('*')
// Returns only current user's notifications
```

---

## 📊 Database Overview

### Tables by Category

#### 🟦 Core User (3 tables)
- `profiles` - User accounts
- `experts` - Expert profiles
- `instructors` - Instructor profiles

#### 🟩 Content (7 tables)
- `markets` - Marketplace
- `news` - News articles
- `courses` - Educational courses
- `videos` - Video content
- `meetings` - Events
- `banner` - Banners
- `hero_data` - Hero section

#### 🟨 Communication (4 tables)
- `conversations` - Chats
- `messages` - Messages
- `participants` - Members
- `notifications` - Notifications

#### 🟧 Reference (5 tables)
- `category*` - Categories (4 tables)
- `districts` - Districts

#### 🟪 Analytics (2 tables)
- `visit_stats` - Visit statistics
- `device_tokens` - Push tokens

**Total: 21 tables**

---

## 🔐 Security Model

### Access Levels

| Level | Access | Tables |
|-------|--------|--------|
| **Public** | Read only | banner, category*, districts, hero_data |
| **Authenticated** | Read published | markets, news, courses, videos |
| **Owner** | Full control | notifications, device_tokens, own content |
| **Participant** | Read/write | conversations, messages |
| **Admin** | Full access | All tables |

### Security Layers
1. **Authentication** - Supabase Auth
2. **RLS Policies** - Row-level security
3. **Application Logic** - Business rules
4. **Database Constraints** - Data integrity

---

## ⚡ Performance

### Before Optimization
- Query time: ~200-500ms
- Server load: High
- Database CPU: 70-80%

### After Optimization (Expected)
- Query time: ~20-50ms (10x faster)
- Server load: Low-Medium
- Database CPU: 20-30%
- Index hit rate: >95%

### Key Improvements
1. **Indexes** - 22+ optimized indexes
2. **RLS Functions** - Cached per query
3. **Partial Indexes** - Smaller index size
4. **STABLE Functions** - Query-level caching

---

## 📝 Code Examples

### Get Published News
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

### Create Market Item
```typescript
import { MARKET_STATUS, CATEGORY_MARKETS } from '@/constants/enum'

const { data } = await supabase
  .from('markets')
  .insert({
    name: 'Product Name',
    category: CATEGORY_MARKETS.BENIH,
    description: 'Description',
    price: 50000,
    status: MARKET_STATUS.PUBLISHED,
    user_id: user.id
  })
```

### Send Message
```typescript
// Create or get conversation
const { data: convId } = await supabase
  .rpc('create_or_get_conversation', { 
    other_user_id: recipientId 
  })

// Send message
await supabase
  .from('messages')
  .insert({
    conversation_id: convId,
    sender_id: user.id,
    content: messageText
  })
```

---

## 🛠️ Maintenance

### Daily
- Monitor query performance
- Check error logs
- Review slow queries

### Weekly
- Analyze database statistics
- Review index usage
- Check for unused indexes

### Monthly
- Clean up soft-deleted records (>90 days)
- Review and optimize queries
- Update documentation

### Quarterly
- Security audit
- Performance review
- Capacity planning

---

## 📞 Support & Resources

### Documentation
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

### Tools
- Supabase Dashboard
- pgAdmin
- DBeaver
- Supabase CLI

### Getting Help
1. Check documentation first
2. Review [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for common patterns
3. Check [IMPLEMENTATION_GUIDE.md#troubleshooting](./IMPLEMENTATION_GUIDE.md#-troubleshooting) for issues
4. Contact technical lead

---

## ✅ Implementation Checklist

### Phase 1: Database ✅
- [x] Helper functions created
- [x] RLS policies defined
- [x] Indexes optimized
- [x] Triggers implemented

### Phase 2: Application ⏳
- [ ] Apply migrations
- [ ] Update imports
- [ ] Replace magic strings
- [ ] Implement helper functions
- [ ] Test security

### Phase 3: Testing ⏳
- [ ] Unit tests
- [ ] Integration tests
- [ ] Security tests
- [ ] Performance tests
- [ ] User acceptance

### Phase 4: Deployment ⏳
- [ ] Staging deployment
- [ ] Production backup
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] Documentation complete

---

## 📈 Version History

### v1.0.0 (February 2026)
- ✅ Initial database analysis
- ✅ RLS policies implementation
- ✅ Helper functions created
- ✅ Enums and constants defined
- ✅ Performance optimization
- ✅ Complete documentation
- ✅ Implementation guide
- ✅ Quick reference guide

---

## 🎯 Next Steps

1. **Review Documentation**
   - Read [DATABASE_ANALYSIS.md](./DATABASE_ANALYSIS.md)
   - Understand [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

2. **Prepare for Implementation**
   - Review [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
   - Check prerequisites
   - Plan deployment

3. **Start Implementation**
   - Apply database migrations
   - Update application code
   - Run tests

4. **Deploy**
   - Deploy to staging
   - Verify functionality
   - Deploy to production

5. **Monitor**
   - Watch performance metrics
   - Check for errors
   - Gather feedback

---

## 👥 Contributors

- **Senior Backend Developer** - Database design & optimization
- **Development Team** - Implementation & testing
- **DBA Team** - Database maintenance
- **DevOps Team** - Deployment & monitoring

---

## 📄 License

This documentation is part of the JuruTani project.

---

**Documentation Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Ready for Implementation

---

## 🔗 Quick Links

- [Database Analysis](./DATABASE_ANALYSIS.md) - Complete analysis
- [Database Schema](./DATABASE_SCHEMA.md) - Schema & relationships
- [Quick Reference](./QUICK_REFERENCE.md) - Code patterns
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md) - Deployment steps
- [Enums](../app/constants/enum.ts) - Constants & enums
- [Types](../app/types/database.types.ts) - TypeScript types
- [Migrations](../supabase/migrations/) - SQL migrations

---

**Happy Coding! 🚀**
