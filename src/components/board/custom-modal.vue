<template>
  <article class="custom-modal-container">
    <header class="custom-modal-header">
      <p>
        <slot name="header"></slot>
      </p>
      <span><i class="fa-solid fa-xmark"></i></span>
    </header>
    <main>
      <slot name="default"></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </article>
</template>
