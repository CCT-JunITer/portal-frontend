<template>
  <div class="container">
    <div class="sidebar">
      sidebar
    </div>
    <div class="mainView">
      mainView
    </div>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: row;
    align-content:stretch;
    height:100%;
    width:100%;
    flex: 0 0 0;
    background:#008000;
  }

.sidebar {
  background:#FF0000;
  height:100%;
}

.mainView {
  margin-left:5px; 
  width:100%;
  height: 100%;
  background:#0000FF
}

</style>