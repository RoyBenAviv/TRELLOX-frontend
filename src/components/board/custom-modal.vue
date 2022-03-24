<template>
  <article class="custom-modal-container">
    <section class="custom-modal-header">
      <p>
        <slot name="header"></slot>
      </p>
      <span><i class="fa-solid fa-xmark"></i></span>
    </section>
    <section>
      <slot name="default"></slot>
    </section>
    <section>
      <slot name="footer"></slot>
    </section>
  </article>
</template>
