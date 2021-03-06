<template>
  <component v-model="date" :placeholder="placeholder" :inputClass="inputClass" :is="wrap ? 'WrapperInput' : 'SingleInput'" v-click-outside="closePicker">
    <slot></slot>
  </component>
</template>

<script>
import Flatpickr from 'flatpickr'
import BaseInput from './BaseInput'
import SingleInput from './SingleInput'
import WrapperInput from './WrapperInput'
import ClickOutside from 'vue-click-outside'

function Datepicker (selector, config, l10n) {
  this.l10n = Object.assign({}, Flatpickr.prototype.l10n, l10n)
  return Flatpickr.call(this, selector, config)
}

Datepicker.prototype = Flatpickr.prototype

export default {
  mixins: [BaseInput],

  components: {
    SingleInput,
    WrapperInput
  },

  data () {
    return {
      datepicker: null
    }
  },

  mounted () {
    if (!this.datepicker) {
      this.datepicker = new Datepicker(this.$el, this.config, this.l10n)
      this.popupItem = this.datepicker.calendarContainer
    }
    this.$watch('config', this.redraw)
  },

  beforeDestroy () {
    if (this.datepicker && !this.static) {
      this.datepicker.destroy()
      this.datepicker = null
    }
  },
  
  methods: {
    redraw(newConfig) {
      this.datepicker.config = Object.assign(this.datepicker.config, newConfig)
      this.datepicker.redraw()
      this.datepicker.jumpToDate()
    }
  },

  computed: {
    wrap () {
      return !!this.config.wrap
    },
    static () {
      return !!this.config.static
    },
    name () {
      return this.wrap ? 'wrapperInput' : 'singleInput'
    }
  },

  methods: {
    closePicker () {
      this.datepicker && this.datepicker.close()
    }
  },

  directives: {
    ClickOutside
  }
}
</script>

<style lang="stylus">
$calendar_background = #ffffff
$calendar_border_color = #d3d6db

$months_color = #111
$months_background = transparent

$weekdays_background = transparent

$day_text_color = #222324
$day_hover_background_color = #d3d6db

$today_color = #ed6c63
$selected_day_background = #1fc8db

@import '~flatpickr/src/style/flatpickr'

.flatpickr-calendar.hasWeeks
  width: auto !important
</style>
