# useUserBadge Composable

Composable untuk mengelola badge user berdasarkan role. Menyediakan fungsi-fungsi untuk mendapatkan warna, nama, dan deskripsi badge yang konsisten di seluruh aplikasi.

## Import

```typescript
import { useUserBadge } from '~/composables/useUserBadge'
```

## Usage

```typescript
const { getBadgeColor, getBadgeName, getBadgeDescription, isExpertRole, isAdminRole } = useUserBadge()
```

## Functions

### `getBadgeColor(role: string | undefined | null): RoleBadgeColor`

Mendapatkan warna badge untuk UBadge component berdasarkan role user.

**Parameters:**
- `role`: Role user (pakar, penyuluh, admin, petani, dll)

**Returns:** `'success' | 'info' | 'warning' | 'primary' | 'neutral'`

**Role Mapping:**
- `pakar`, `expert` → `'success'` (hijau)
- `penyuluh`, `instructor` → `'info'` (biru)
- `admin` → `'warning'` (kuning)
- `petani`, `farmer` → `'primary'` (primary color)
- others → `'neutral'` (abu-abu)

**Example:**
```vue
<UBadge :color="getBadgeColor(user.role)" variant="soft">
  {{ user.role }}
</UBadge>
```

---

### `getBadgeName(role: string | undefined | null): string`

Mendapatkan display name yang user-friendly untuk role.

**Parameters:**
- `role`: Role user

**Returns:** Display name dalam Bahasa Indonesia

**Role Mapping:**
- `pakar`, `expert` → `'Pakar'`
- `penyuluh`, `instructor` → `'Penyuluh'`
- `admin` → `'Admin'`
- `petani`, `farmer` → `'Petani'`
- `null`, `undefined` → `'User'`
- others → Capitalize first letter

**Example:**
```vue
<UBadge :color="getBadgeColor(user.role)">
  {{ getBadgeName(user.role) }}
</UBadge>
```

---

### `getBadgeDescription(role: string | undefined | null): string`

Mendapatkan deskripsi lengkap untuk role (untuk tooltip atau detail).

**Parameters:**
- `role`: Role user

**Returns:** Deskripsi lengkap dalam Bahasa Indonesia

**Role Mapping:**
- `pakar`, `expert` → `'Ahli Pertanian Bersertifikat'`
- `penyuluh`, `instructor` → `'Penyuluh Pertanian'`
- `admin` → `'Administrator Sistem'`
- `petani`, `farmer` → `'Petani'`
- others → Same as `getBadgeName()`

**Example:**
```vue
<UBadge 
  :color="getBadgeColor(user.role)"
  :title="getBadgeDescription(user.role)"
>
  {{ getBadgeName(user.role) }}
</UBadge>
```

---

### `isExpertRole(role: string | undefined | null): boolean`

Mengecek apakah role adalah role expert/professional.

**Parameters:**
- `role`: Role user

**Returns:** `true` jika role adalah pakar, expert, penyuluh, atau instructor

**Example:**
```typescript
if (isExpertRole(user.role)) {
  console.log('User is an expert!')
}
```

---

### `isAdminRole(role: string | undefined | null): boolean`

Mengecek apakah role adalah admin.

**Parameters:**
- `role`: Role user

**Returns:** `true` jika role adalah admin

**Example:**
```typescript
if (isAdminRole(user.role)) {
  // Show admin features
}
```

---

## Complete Example

```vue
<script setup lang="ts">
import { useUserBadge } from '~/composables/useUserBadge'

const { getBadgeColor, getBadgeName, getBadgeDescription, isExpertRole } = useUserBadge()

const user = ref({
  id: '1',
  name: 'John Doe',
  role: 'pakar'
})
</script>

<template>
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    
    <!-- Badge with color and name -->
    <UBadge 
      :color="getBadgeColor(user.role)" 
      variant="soft"
      :title="getBadgeDescription(user.role)"
    >
      {{ getBadgeName(user.role) }}
    </UBadge>
    
    <!-- Conditional rendering based on role -->
    <div v-if="isExpertRole(user.role)" class="expert-badge">
      ⭐ Verified Expert
    </div>
  </div>
</template>
```

## Where It's Used

Composable ini digunakan di:
- ✅ `components/Chat/NewChatModal.vue` - Search dan pilih user untuk chat
- ✅ `components/Chat/ConversationItem.vue` - List conversations dengan badge role
- ✅ `pages/room-chat/[id].vue` - Chat room dengan partner info
- ✅ `pages/room-chat/admin/[id].vue` - Admin chat room
- ✅ `composables/useProfile.ts` - Profile user display
- ✅ Dan tempat lain yang menampilkan badge user

## Benefits

1. **Konsistensi** - Warna dan nama role sama di seluruh aplikasi
2. **Maintainability** - Ubah di satu tempat, apply ke semua
3. **Type Safety** - Return type yang jelas dengan TypeScript
4. **Reusability** - Mudah digunakan di component manapun
5. **Extensibility** - Mudah menambah role baru
