<script setup lang="ts">
const route = useRoute();
const projectId = route.params.projectId as string;

await navigateTo(`/app/projects/${projectId}/board`, { replace: true });
</script>
