# 🗺️ Database Schema & Relationships

## 📐 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        JuruTani Database                         │
│                       21 Tables Structure                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   profiles   │◄───────┤│    experts   │         │ instructors  │
│              │         │              │         │              │
│ * id         │         │ * id         │         │ * id         │
│   full_name  │         │   user_id FK │         │   user_id FK │
│   email      │         │   category   │         │   district   │
│   role       │         │   note       │         │   provinces  │
│   avatar_url │         └──────────────┘         └──────────────┘
│   is_admin   │                │                         │
└──────┬───────┘                │                         │
       │                        │                         │
       │ 1:N                    └─────────────────────────┘
       │                                   │
       ├───────────────┬──────────────────┼──────────────┬────────────┐
       │               │                  │              │            │
       ▼               ▼                  ▼              ▼            ▼
┌──────────┐    ┌──────────┐      ┌──────────┐   ┌──────────┐  ┌──────────┐
│  markets │    │   news   │      │ meetings │   │ messages │  │ notific. │
│          │    │          │      │          │   │          │  │          │
│ * id     │    │ * id     │      │ * id     │   │ * id     │  │ * id     │
│   name   │    │   title  │      │   title  │   │ content  │  │ title    │
│ user_id  │    │ user_id  │      │ author_id│   │ sender_id│  │ user_id  │
│ category │    │ category │      │ category │   │ conv_id  │  │ is_read  │
│ status   │    │ status   │      │ org.     │   │ is_read  │  └──────────┘
│ price    │    │ content  │      │ content  │   └────┬─────┘            
└──────────┘    └──────────┘      └──────────┘        │                  
                                                       │                  
      ┌────────────────────────────────────────────────┘                  
      │                                                                    
      ▼                                                                    
┌──────────────┐         ┌──────────────┐                                
│conversations │◄───────┤│ participants │                                
│              │         │              │                                
│ * id         │         │ conv_id FK   │                                
│ part1_id FK  │         │ user_id FK   │                                
│ part2_id FK  │         └──────────────┘                                
│ last_message │                                                          
└──────────────┘                                                          

┌─────────────────────────────────────────────────────────────────┐
│                       Content Tables                             │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   courses    │    │    videos    │    │    banner    │
│              │    │              │    │              │
│ * id         │    │ * id         │    │ * id         │
│   title      │    │   title      │    │   image_url  │
│   category   │    │   link_yt    │    └──────────────┘
│   desc.      │    │   category   │
│   files      │    └──────────────┘
└──────────────┘                       

┌─────────────────────────────────────────────────────────────────┐
│                      Reference Tables                            │
└─────────────────────────────────────────────────────────────────┘

┌────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   category     │  │ category_expert  │  │ category_markets │
│                │  │                  │  │                  │
│ * id           │  │ * id             │  │ * id             │
│   name         │  │   name           │  │   name           │
└────────────────┘  │   value          │  │   value          │
                    └──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
│  category_news   │  │  districts   │  │  hero_data   │
│                  │  │              │  │              │
│ * id             │  │ * id         │  │ * id         │
│   name           │  │   name       │  │   title      │
│   value          │  │   province   │  │   status     │
└──────────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐
│ visit_stats  │  │device_tokens │
│              │  │              │
│ * date       │  │ * id         │
│   count      │  │   user_id    │
└──────────────┘  │   token      │
                  │   platform   │
                  └──────────────┘
```

---

## 🔗 Relationship Details

### 1. User-Centric Relationships

#### profiles → experts (1:1)
```typescript
profiles.id === experts.user_id
```
- One user can be one expert
- Expert profile is optional
- Cascade delete when profile deleted

#### profiles → instructors (1:1)
```typescript
profiles.id === instructors.user_id
```
- One user can be one instructor
- Instructor profile is optional
- Cascade delete when profile deleted

#### profiles → markets (1:N)
```typescript
profiles.id === markets.user_id
```
- One user can have many market items
- User is the seller/owner
- Soft delete maintained

#### profiles → news (1:N)
```typescript
profiles.id === news.user_id
```
- One user can author many news articles
- User is the content creator
- Soft delete maintained

#### profiles → meetings (1:N)
```typescript
profiles.id === meetings.author_id
```
- One user can create many meetings
- User is the organizer
- Soft delete maintained

### 2. Communication Relationships

#### profiles → conversations (N:N)
```typescript
profiles.id === conversations.participant1_id
profiles.id === conversations.participant2_id
```
- Two-way relationship between users
- Each conversation has exactly 2 participants
- Bidirectional access

#### conversations → messages (1:N)
```typescript
conversations.id === messages.conversation_id
profiles.id === messages.sender_id
```
- One conversation has many messages
- Each message has one sender
- Ordered by created_at

#### conversations → participants (1:N)
```typescript
conversations.id === participants.conversation_id
profiles.id === participants.user_id
```
- Join table for conversation access
- Used for multi-participant support (future)

### 3. Notification Relationships

#### profiles → notifications (1:N)
```typescript
profiles.id === notifications.user_id
```
- One user receives many notifications
- Each notification belongs to one user

#### profiles → device_tokens (1:N)
```typescript
profiles.id === device_tokens.user_id
```
- One user can have multiple devices
- Used for push notifications

---

## 📊 Table Categories & Purpose

### 🟦 Core User Tables
| Table | Purpose | Access Pattern |
|-------|---------|----------------|
| profiles | User accounts & authentication | Public read, owner write |
| experts | Expert/specialist profiles | Public read, owner/admin write |
| instructors | Instructor/educator profiles | Public read, owner/admin write |

### 🟩 Content Tables
| Table | Purpose | Access Pattern |
|-------|---------|----------------|
| markets | Marketplace items for sale | Published: public, Draft: owner |
| news | News articles & posts | Published: public, Draft: owner/admin |
| courses | Educational courses | Public read, admin write |
| videos | Video content | Public read, admin write |
| meetings | Events & workshops | Public read, authenticated write |
| banner | Promotional banners | Public read, admin write |
| hero_data | Homepage hero content | Active: public, admin write |

### 🟨 Communication Tables
| Table | Purpose | Access Pattern |
|-------|---------|----------------|
| conversations | Chat conversations | Participants only |
| messages | Chat messages | Participants only |
| participants | Conversation members | Participants only |
| notifications | User notifications | Owner only |
| device_tokens | Push notification tokens | Owner only |

### 🟧 Reference Tables
| Table | Purpose | Access Pattern |
|-------|---------|----------------|
| category | General categories | Public read, admin write |
| category_expert | Expert categories | Public read, admin write |
| category_markets | Market categories | Public read, admin write |
| category_news | News categories | Public read, admin write |
| districts | Indonesian districts | Public read, admin write |

### 🟪 Analytics Tables
| Table | Purpose | Access Pattern |
|-------|---------|----------------|
| visit_stats | Website visit statistics | Public read, system write |

---

## 🔑 Key Constraints & Rules

### Primary Keys
All tables use `UUID` for primary keys (except `districts`, `experts`, `instructors`, `videos` which use `SERIAL`/`BIGSERIAL`)

### Foreign Keys
- All user references use `profiles.id`
- All conversation references use `conversations.id`
- Cascade rules applied where appropriate

### Unique Constraints
```sql
-- Username must be unique
ALTER TABLE profiles ADD CONSTRAINT uk_username UNIQUE (username);

-- Conversation participants must be unique
ALTER TABLE conversations ADD CONSTRAINT uk_conversation_participants 
  UNIQUE (participant1_id, participant2_id);

-- Device token must be unique
ALTER TABLE device_tokens ADD CONSTRAINT uk_device_token UNIQUE (token);
```

### Check Constraints
```sql
-- Email format validation
ALTER TABLE profiles ADD CONSTRAINT chk_email 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Price must be positive
ALTER TABLE markets ADD CONSTRAINT chk_price_positive 
  CHECK (price IS NULL OR price > 0);

-- Phone number format
ALTER TABLE profiles ADD CONSTRAINT chk_phone 
  CHECK (phone IS NULL OR phone ~* '^\+?[0-9]{10,15}$');
```

---

## 🎯 Index Strategy

### 1. **Primary Indexes** (Automatic)
- All primary keys have automatic indexes
- Used for direct lookups by ID

### 2. **Foreign Key Indexes**
```sql
-- User-related indexes
CREATE INDEX idx_markets_user ON markets(user_id);
CREATE INDEX idx_news_user ON news(user_id);
CREATE INDEX idx_experts_user ON experts(user_id);

-- Conversation indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_conversations_participant1 ON conversations(participant1_id);
CREATE INDEX idx_conversations_participant2 ON conversations(participant2_id);
```

### 3. **Query Optimization Indexes**
```sql
-- Status + deleted_at for content filtering
CREATE INDEX idx_news_published 
  ON news(published_at DESC) 
  WHERE deleted_at IS NULL AND status_news = 'published';

-- Unread messages/notifications
CREATE INDEX idx_messages_unread 
  ON messages(conversation_id, is_read) 
  WHERE is_read = false;

CREATE INDEX idx_notifications_unread 
  ON notifications(user_id, is_read) 
  WHERE is_read = false;
```

### 4. **Search Indexes**
```sql
-- Full-text search on profiles
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Slug indexes for SEO
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_markets_slug ON markets(slug);
CREATE INDEX idx_courses_slug ON courses(slug);
```

---

## 🔄 Cascade Rules

### DELETE CASCADE
```sql
-- When profile deleted, delete all related data
ALTER TABLE experts 
  ADD CONSTRAINT fk_experts_profile
  FOREIGN KEY (user_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;

-- When conversation deleted, delete all messages
ALTER TABLE messages 
  ADD CONSTRAINT fk_messages_conversation
  FOREIGN KEY (conversation_id) 
  REFERENCES conversations(id) 
  ON DELETE CASCADE;
```

### SET NULL
```sql
-- When user deleted, set news author to NULL (keep content)
ALTER TABLE news 
  ADD CONSTRAINT fk_news_user
  FOREIGN KEY (user_id) 
  REFERENCES profiles(id) 
  ON DELETE SET NULL;
```

---

## 📏 Data Size Estimates

### Small Tables (<1K rows)
- banner
- category*
- hero_data
- districts (~500 kabupaten)

### Medium Tables (1K-100K rows)
- profiles (users)
- experts
- instructors
- courses
- videos
- meetings
- device_tokens

### Large Tables (>100K rows)
- messages (high volume)
- notifications (high volume)
- markets (marketplace items)
- news (articles)
- visit_stats (daily records)

### Growth Patterns
```
messages: ~1000/day × 365 = 365K/year
notifications: ~2000/day × 365 = 730K/year
markets: ~100/day × 365 = 36.5K/year
news: ~10/day × 365 = 3.65K/year
```

---

## 🛠️ Maintenance Queries

### Clean up soft-deleted records (>90 days)
```sql
DELETE FROM markets 
WHERE deleted_at < NOW() - INTERVAL '90 days';

DELETE FROM news 
WHERE deleted_at < NOW() - INTERVAL '90 days';
```

### Archive old conversations (>1 year inactive)
```sql
UPDATE conversations 
SET archived_at = NOW()
WHERE last_message_at < NOW() - INTERVAL '1 year'
AND archived_at IS NULL;
```

### Rebuild indexes
```sql
REINDEX TABLE messages;
REINDEX TABLE notifications;
```

### Update statistics
```sql
ANALYZE profiles;
ANALYZE messages;
ANALYZE news;
```

---

## 🔐 Security Layers

### Layer 1: Authentication
- Supabase Auth handles user authentication
- JWT tokens for API access

### Layer 2: RLS Policies
- Row-level security on all tables
- User can only access authorized rows

### Layer 3: Application Logic
- Additional validation in application code
- Business rule enforcement

### Layer 4: Database Constraints
- Foreign keys prevent orphaned records
- Check constraints enforce data integrity
- Unique constraints prevent duplicates

---

**Schema Version**: 1.0.0  
**Last Updated**: February 2026  
**Total Tables**: 21  
**Total Relationships**: 18  
**Total Indexes**: 22+
