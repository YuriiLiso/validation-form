<script setup lang="ts">
  import { reactive, ref, computed } from 'vue'
  import { toast } from 'vue3-toastify'
  import 'vue3-toastify/dist/index.css'

  const props = defineProps<{
    modelValue: string
    label: string
  }>()
  const emits = defineEmits(['update:modelValue'])

  const abvailableErrors = reactive<{ [key: string]: boolean }>({
    overSizeAfterDot: false, // 'Перевищено ліміт символів після крапки!'
    incorrectSymbols: false // 'Некоректні символи!'
  })

  const hasErrors = computed(() => {
    return Object.values(abvailableErrors).some((value) => value === true)
  })

  const handeInput = (event: Event) => {
    const input = event.target as HTMLInputElement
    const regex: RegExp = /^[0-9]*\.?[0-9]{0,18}$/

    // console.log('input.value', input.value)

    if (!regex.test(input.value)) {
      detectTypeOfError(input.value)
      // just use last correct value if the test is not passed
      input.value = props.modelValue
    } else {
      resetErrors()
      emits('update:modelValue', input.value)
    }
  }

  const resetErrors = () => {
    abvailableErrors.overSizeAfterDot = false
    abvailableErrors.incorrectSymbols = false
  }
  const detectTypeOfError = (value: string) => {
    const indexOfDot = value.indexOf('.')
    const afterDotVulue = value.slice(indexOfDot + 1)
    if (afterDotVulue.length > 18) {
      abvailableErrors.overSizeAfterDot = true
    }

    if (isNaN(+value)) {
      abvailableErrors.incorrectSymbols = true
    }
  }

  const keyDown = async (event: KeyboardEvent) => {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab']
    // this shortcuts need to normal controlling of text for better user experience(selecting, pasting, undo etc.)
    const isTextShortcut =
      (event.metaKey || event.ctrlKey || event.shiftKey) &&
      ['v', 'a', 'c', 'x', 'z'].includes(event.key.toLowerCase())

    if (isTextShortcut) {
      return
    }

    const target = event.target as HTMLInputElement
    const selectionStart = target.selectionStart as number
    const selectionEnd = target.selectionEnd as number

    const isDigit = event.key >= '0' && event.key <= '9'
    const isDot = event.key === '.' && !props.modelValue.includes('.')

    let predictedValue = props.modelValue
    if (isDigit || isDot) {
      predictedValue =
        props.modelValue.slice(0, selectionStart) + event.key + props.modelValue.slice(selectionEnd)
    }

    const predictedDotIndex = predictedValue.indexOf('.')
    const digitsAfterDot =
      predictedDotIndex !== -1 ? predictedValue.length - predictedDotIndex - 1 : 0

    console.log('digitsAfterDot', digitsAfterDot)

    if (
      (!isDigit && !isDot && !allowedKeys.includes(event.key)) ||
      (predictedDotIndex !== -1 && digitsAfterDot > 18)
    ) {
      event.preventDefault()
    }
  }

  const copyValue = (event: Event) => {
    event.preventDefault()
    window.navigator.clipboard.writeText(props.modelValue)

    toast('Copied!')
  }
</script>

<template>
  <div class="relative m-auto flex w-full max-w-[24rem]">
    <div class="relative h-12 w-full min-w-[200px]">
      <input
        class="placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer h-full w-full rounded-[7px] border border-white bg-transparent px-3 py-2.5 pr-16 font-sans text-sm font-normal !text-white outline outline-0 transition-all placeholder-shown:border focus:border-2 focus:border-white focus:border-t-transparent focus:outline-0 disabled:border-0"
        :value="modelValue"
        type="string"
        placeholder=""
        :class="{ 'border-red-500': false }"
        @input="handeInput"
        @keydown="keyDown"
        @focus="() => resetErrors()"
      />
      <p v-if="hasErrors" class="mt-1 text-sm text-red-500">
        {{
          abvailableErrors.overSizeAfterDot
            ? 'Перевищено ліміт символів після крапки! (18)'
            : abvailableErrors.incorrectSymbols
              ? 'Некоректні символи!'
              : ''
        }}
      </p>

      <label
        class="before:content[' '] after:content[' '] peer-placeholder-shown:text-blue-gray-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500 pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight !text-white transition-all before:pointer-events-none before:mr-1 before:mt-[6.5px] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:border-white before:transition-all after:pointer-events-none after:ml-1 after:mt-[6.5px] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-r after:border-t after:border-white after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.2] peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-white peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:before:!border-white peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:after:!border-white peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent"
      >
        {{ label }}
      </label>
    </div>
    <button
      class="bg-blue-gray-500 shadow-blue-gray-500/20 hover:shadow-blue-gray-500/40 !absolute right-1 top-1 select-none rounded px-4 py-3 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      type="button"
      @click="copyValue"
    >
      Copy
    </button>
  </div>
</template>

<style></style>
