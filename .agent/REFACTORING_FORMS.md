# Refactoring Form Components - Documentation

## Overview
Refactored `News/Modal/Form.vue` and `Product/Modal/Form.vue` to use reusable composables for better code maintainability and reusability.

## New Composables Created

### 1. `useFileUpload.ts`
**Purpose**: Handle file uploads to Supabase Storage with validation and preview functionality.

**Key Functions**:
- `uploadFile()` - Upload file to Supabase Storage with validation
- `handleImageSelection()` - Handle image file selection with automatic validation and preview
- `validateFile()` - Validate file type and size
- `createImagePreview()` - Create base64 preview for images
- `deleteFile()` - Delete file from Supabase Storage
- `generateFilePath()` - Generate unique file path with timestamp

**Usage Example**:
```typescript
const { uploadFile, handleImageSelection } = useFileUpload()

// Handle image selection
const handleImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  const result = await handleImageSelection(file || null, { maxSizeMB: 5 })
  
  if (result) {
    form.value.imageFile = result.file
    imagePreview.value = result.preview
  }
}

// Upload file
const result = await uploadFile(file, {
  bucket: 'news-images',
  folder: 'images',
  maxSizeMB: 5,
  allowedTypes: ['image/*']
})
```

### 2. `useFormValidation.ts`
**Purpose**: Provide reusable validation rules and helpers for form validation.

**Key Functions**:
- `validateRules()` - Process validation rules and return errors
- `hasErrors()` - Check if form has errors
- `isValidUrl()` - Validate URL format
- `isValidEmail()` - Validate email format
- `isValidPhone()` - Validate phone number (Indonesian format)
- `isRequired()` - Check if field is required
- `rules` - Pre-built validation rule builders

**Usage Example**:
```typescript
const { validateRules, hasErrors, rules } = useFormValidation()

const validateForm = (): boolean => {
  const validationRules = [
    rules.required('title', form.value.title, 'Judul berita'),
    rules.required('content', form.value.content, 'Konten berita'),
    rules.url('link', form.value.link, 'Link referensi')
  ]

  errors.value = validateRules(validationRules)
  return !hasErrors(errors.value)
}
```

## Changes Made

### News/Modal/Form.vue
**Before**:
- Inline file upload logic with manual validation
- Inline URL validation
- Manual error handling
- Using `<template #content>` for form

**After**:
- Uses `useFileUpload` composable for file handling
- Uses `useFormValidation` composable for validation
- Cleaner, more maintainable code
- Proper `UForm` component with `:state` binding
- Added `name` attribute to all `UFormField` components
- Removed unnecessary `<template #content>` wrapper
- Fixed button colors to use `neutral` instead of `gray`

### Product/Modal/Form.vue
**Before**:
- Inline file upload logic
- Inline validation logic
- Native `<input>` for file upload
- Using `<form>` instead of `UForm`

**After**:
- Uses `useFileUpload` composable
- Uses `useFormValidation` composable
- Uses `UInput` for file upload (consistent with Nuxt UI)
- Proper `UForm` component with `:state` binding
- Added `name` attribute to all `UFormField` components
- Fixed button colors to use `neutral` instead of `gray`
- Changed icon from `heroicons:home` to `heroicons:building-storefront` for seller field

## Benefits

1. **Reusability**: File upload and validation logic can now be used across the entire application
2. **Maintainability**: Changes to validation or upload logic only need to be made in one place
3. **Consistency**: Same validation and upload behavior across all forms
4. **Testability**: Composables can be tested independently
5. **Type Safety**: Full TypeScript support with proper types
6. **Cleaner Components**: Form components are now much cleaner and focused on UI logic

## Future Improvements

1. Consider adding more validation rules (e.g., date validation, number range)
2. Add file compression for images before upload
3. Add progress tracking for file uploads
4. Consider creating a generic form composable that combines both validation and submission logic
