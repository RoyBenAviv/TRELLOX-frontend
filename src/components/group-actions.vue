<template>
   <section class="group-actions">
       <div class="grp-act-header"><p>List actions</p> <span><i class="fa-solid fa-xmark"></i></span></div>
      <ul>
          <li><a>Add card...</a></li>
          <li><a>Copy list...</a></li>
          <li><a>Move list...</a></li>
      </ul>
      <ul>
          <hr>
          <li><a>Sort By...</a></li>
          <hr>
      </ul>
      <ul>
        <li><a>Move all cards in this list...</a></li>
          <li><a>Archive all cards in this list...</a></li>
      </ul>
      <ul>
          <hr>
          <li><a>Archive this list</a></li>
      </ul>
  </section>
</template>
 
<script>
 
export default {
 
name: 'group-actions',
 data() {
return {
 
};
 },
methods: {
},
computed: {
},
components: {
}
};
</script>
 
<style>
 
</style>