# Types Directory

This directory contains all TypeScript interface and type definitions used throughout the application.

## Structure

```
types/
├── index.ts           # Central export point for all types
├── chat.ts            # Chat-related types (Message, Conversation, etc.)
├── content.ts         # Content-related types (ContentListOptions, SortOption, etc.)
├── user.ts            # User profile types
├── social.ts          # Social sharing types
├── navigation.ts      # Navigation menu types
├── hero.ts            # Hero section types
└── toast.ts           # Toast notification types
```

## Usage

### Importing Types

You can import types in two ways:

1. **From specific type files:**
```typescript
import type { UserProfile } from '~/types/user'
import type { ContentListOptions } from '~/types/content'
```

2. **From the central index:**
```typescript
import type { UserProfile, ContentListOptions, Message } from '~/types'
```

## Type Categories

### Chat Types (`chat.ts`)
- `Message` - Chat message structure
- `Conversation` - Conversation structure
- `ChatState` - Chat state management
- `ImageUploadOptions` - Image upload configuration
- `UserSearchResult` - User search result
- `GroupedMessages` - Grouped messages by date

### Content Types (`content.ts`)
- `ContentListOptions` - Configuration for content list composable
- `SortOption` - Sort option structure
- `FilterState` - Filter state for content lists
- `ContentDetailOptions` - Configuration for content detail composable

### User Types (`user.ts`)
- `UserProfile` - User profile from database

### Social Types (`social.ts`)
- `ShareOptions` - Social sharing options
- `SharePlatform` - Social platform configuration

### Navigation Types (`navigation.ts`)
- `NavItem` - Navigation item structure
- `NavMenu` - Navigation menu structure

### Hero Types (`hero.ts`)
- `HeroData` - Hero section data structure

### Toast Types (`toast.ts`)
- `Toast` - Toast notification structure

## Best Practices

1. **Always use type imports** when importing only types:
   ```typescript
   import type { UserProfile } from '~/types/user'
   ```

2. **Keep types close to their domain** - Each type file should contain related types

3. **Export types from composables** for backward compatibility:
   ```typescript
   import type { UserProfile } from '~/types/user'
   export type { UserProfile }
   ```

4. **Document complex types** with JSDoc comments

## Migration Notes

All interfaces have been moved from composables to this centralized `types` directory for better organization and reusability. Composables now import and re-export these types for backward compatibility.

### Files Affected:
- `useContentList.ts` → `types/content.ts`
- `useContentDetail.ts` → `types/content.ts`
- `useUserProfile.ts` → `types/user.ts`
- `useSocialShare.ts` → `types/social.ts`
- `useNavMenu.ts` → `types/navigation.ts`
- `useHeroData.ts` → `types/hero.ts`
- `useJuruTaniToast.ts` → `types/toast.ts`
- `useChat.ts` → Already using `types/chat.ts`
- `useChatSearch.ts` → Already using `types/chat.ts`
- `useChatUtils.ts` → Already using `types/chat.ts`
