<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useSupabase } from '~/composables/useSupabase';
import { CreateButton, DiscussionsCategoryFilter, CourseCardContent } from '#components';

const { supabase } = useSupabase();

// Data
const courseList = ref([]);
const loading = ref(true);
const error = ref(null);

// Filter and pagination
const currentCategory = ref('all');
const categories = ['all', 'Pertanian', 'Peternakan', 'Teknologi', 'Lainya'];
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);

// Fetch courses with filters
const fetchCourses = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    let query = supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value - 1);
    
    // Apply category filter if not 'all'
    if (currentCategory.value !== 'all') {
      query = query.eq('category', currentCategory.value);
    }
    
    const { data, error: fetchError, count } = await query;

    if (fetchError) {
      console.error(fetchError);
      error.value = fetchError;
    } else {
      courseList.value = data || [];
      totalPages.value = Math.ceil((count || 0) / pageSize.value);
    }
  } catch (err) {
    console.error(err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

// Reset to page 1 when category changes
watch(currentCategory, () => {
  currentPage.value = 1;
  fetchCourses();
});

// Refetch when page changes
watch(currentPage, () => {
  fetchCourses();
});

// Initial fetch
onMounted(() => {
  fetchCourses();
});
</script>

<template>
  <div class="course-page container mx-auto px-4">
    
    <!-- Category Filter -->
     <div class="flex justify-center items-center mt-4">
    <DiscussionsCategoryFilter 
      :categories="categories" 
      :model-value="currentCategory" 
      @update:model-value="currentCategory = $event" 
    />
     </div>
    <!-- Course Content -->
    <div class="mt-8">
      <LoadingData v-if="loading"/>      
        <ErrorData v-else-if="error" />
        <NotFoundData v-else-if="courseList.length === 0" />
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CourseCardContent 
          v-for="course in courseList" 
          :key="course.id" 
          :course="course" 
        />
      </div>
    </div>
    
    <!-- Pagination -->
    <Pagination 
      v-if="!loading && courseList.length > 0" 
      :current-page="currentPage" 
      :total-pages="totalPages" 
      @prev="currentPage > 1 ? currentPage-- : null" 
      @next="currentPage < totalPages ? currentPage++ : null" 
      @goto="page => currentPage = page" 
    />
    <CreateButton />
  </div>
</template>