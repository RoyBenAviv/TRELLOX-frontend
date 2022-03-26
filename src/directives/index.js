export const focusDirective = {
    mounted: (el) => {
      el.focus()
    },
  }

export const clickOutside = {
  beforeMount(el, binding, vnode) {
    el.clickOutsideEvent = evt => {
      if (!(el === evt.target || el.contains(evt.target))) {
        binding.value(evt, el);
        }
    };
    window.requestAnimationFrame(() => {
      document.addEventListener('click', el.clickOutsideEvent)
    })
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}