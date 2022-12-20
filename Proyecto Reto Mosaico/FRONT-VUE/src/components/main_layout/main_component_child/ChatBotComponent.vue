<script setup lang="ts">
</script>

<template>
  <div>
	<q-chat-message name="me" avatar="https://cdn.quasar.dev/img/avatar4.jpg" :text="['hey, how are you?']" sent
	  stamp="7 minutes ago" />
	<q-chat-message name="Jane" avatar="https://cdn.quasar.dev/img/avatar3.jpg" :text="[`doing fine, how r you?`]"
	  stamp="4 minutes ago" />
  </div>
</template>
