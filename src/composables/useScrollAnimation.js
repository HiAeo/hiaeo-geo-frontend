import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable for scroll-triggered animations using Intersection Observer
 * @param {Object} options - Configuration options
 * @param {string} options.threshold - Visibility threshold (default: '0.15')
 * @param {string} options.rootMargin - Root margin (default: '0px')
 * @param {boolean} options.once - Only animate once (default: true)
 */
export function useScrollAnimation(options = {}) {
  const {
    threshold = '0.15',
    rootMargin = '0px',
    once = true
  } = options

  const observedElements = ref([])
  let observer = null

  const initObserver = () => {
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for browsers without IntersectionObserver
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
            if (once) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            entry.target.classList.remove('animate-in')
          }
        })
      },
      {
        threshold: parseFloat(threshold),
        rootMargin
      }
    )
  }

  const observe = (element) => {
    if (observer && element) {
      observer.observe(element)
      observedElements.value.push(element)
    }
  }

  const observeAll = (selector, container = document) => {
    const elements = container.querySelectorAll(selector)
    elements.forEach((el) => observe(el))
  }

  const disconnect = () => {
    if (observer) {
      observer.disconnect()
      observedElements.value = []
    }
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    observe,
    observeAll,
    initObserver,
    disconnect,
    observedElements
  }
}

/**
 * Directive for scroll animation
 */
export const vScrollAnimate = {
  mounted(el, binding) {
    el.classList.add('scroll-animate')
    el.classList.add(binding.value?.delay ? `delay-${binding.value.delay}` : '')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('animate-in')
            if (binding.value?.once !== false) {
              observer.unobserve(el)
            }
          } else if (binding.value?.once === false) {
            el.classList.remove('animate-in')
          }
        })
      },
      {
        threshold: binding.value?.threshold || 0.15,
        rootMargin: binding.value?.rootMargin || '0px'
      }
    )

    observer.observe(el)
  }
}
