<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGuidingSessionsStore } from '@/stores/guidingSessions'
import SvgIcon from '@/components/helpers/SvgIcon.vue'

const guidingSessionsStore = useGuidingSessionsStore()
const { importFileDateToStore } = guidingSessionsStore
const { accounts, sessions, meta } = storeToRefs(guidingSessionsStore)

const dataStr = computed(() => {
  const store = {
    accounts: accounts.value,
    sessions: sessions.value,
    meta: meta.value,
  }

  return `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(store))}`
})

const fileUpload = ref()
const importContent = ref({})

const upload = () => {
  const files = fileUpload.value.files

  if (files.length <= 0) {
    return false
  }

  const fr = new FileReader()

  fr.onload = event => {
    const result = JSON.parse(event?.target?.result as string)
    importContent.value = result
    importFileDateToStore(result)
  }

  fr.readAsText(files.item(0))
}
</script>

<template>
  <nav class="nav-secondary">
    <ul class="nav-secondary__list">
      <li class="nav-secondary__list-item">
        <a class="btn" :href="dataStr" :download="`sessions-${meta.id}.json`">
          <SvgIcon name="material/save" />
        </a>
      </li>
      <li>
        <input type="file" ref="fileUpload">
        <button class="btn btn-primary" @click="upload">Upload</button>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss">
.nav-secondary__list,
.nav-secondary__list-item {
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-secondary__list {
  display: flex;
  gap: 1rem;
  justify-content: start;
}
</style>