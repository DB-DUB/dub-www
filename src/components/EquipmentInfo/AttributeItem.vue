<template>
  <div class="attr-item-wrap">
    <div class="attr-item-top-wrap">
      <span>{{ attrName }}</span>
      <div>
        <span v-if="critUpgrade" class="crit">{{ `Crit Upgrade!` }}</span>
        {{ attrValue }}
        <span v-if="addedPoints > 0" class="add-value">{{ `+${addedPoints}` }}</span>
      </div>
    </div>
    <div class="progress-wrap">
      <div class="progress-bar">
        <div class="edit-track" :style="{ width: addedProgress + '%' }"></div>
        <div class="track" :style="{ backgroundColor: trackColor, width: progress + '%' }"></div>
      </div>

      <div v-if="enableEdit">
        <div
          :style="{
            pointerEvents: addedPoints > 0 && !loading ? 'auto' : 'none',
            opacity: addedPoints > 0 ? 1 : 0.3
          }"
          class="subtract-btn"
          @click="updateAddedPoints('subtract', 1)"
        >
          <img src="@/assets/equipment/subtract.png" />
        </div>
        <div
          :style="{
            pointerEvents: availablePoints > 0 && !loading ? 'auto' : 'none',
            opacity: availablePoints > 0 ? 1 : 0.3
          }"
          class="add-btn"
          @click="updateAddedPoints('add', 1)"
        >
          <img src="@/assets/equipment/add.png" />
        </div>
      </div>
    </div>


    <div class="tip-container" :style="{zIndex: attrKey === showTipAttrKey ? 11 : 10}">
      <span>{{ attrName }}</span>
      <div class="tip-wrap">
        <div class="tip-icon-wrap" @click.stop="emit('update:showTipAttrKey', attrKey)">
          <img class="tip-icon" src="@/assets/equipment/tip-icon.svg" alt="">
        </div>
        <div  class="tip-content-wrap" @click.stop v-if="attrKey === showTipAttrKey">
          <div class="tip-content-border"></div>
          <div class="tip-content">{{attrTip}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, Ref, ref } from 'vue'

interface Props {
  loading: boolean
  /** Attribute key */
  attrKey: string
  /** Attribute tip */
  attrTip: string
  /** Attribute name */
  attrName: string
  /** Attribute value */
  attrValue: number
  /** Points to be added */
  addedPoints: number
  /** Critical upgrade */
  critUpgrade: boolean
  /** Whether points can be edited */
  enableEdit: boolean
  /** Available points */
  availablePoints: number
  /** Progress bar track color */
  trackColor: string
  showTipAttrKey: string
}

const props = withDefaults(defineProps<Props>(), {})

/**
 * @param type Decrease/Increase
 * @param value Value of single operation Decrease/Increase
 * @param attrKey Attribute key
 */
const emit = defineEmits<{
  (
    e: 'onUpdateAddedPoints',
    params: { type: 'subtract' | 'add'; value: number; attrKey: string }
  ): void
  (e: 'update:showTipAttrKey'): void
}>()

const progress = computed(() => {
  return Math.min((props.attrValue / 110) * 100, 100)
})

const addedProgress = computed(() => {
  return Math.min(((props.attrValue + props.addedPoints) / 110) * 100, 100)
})

const updateAddedPoints = (type: 'subtract' | 'add', value) => {
  emit('onUpdateAddedPoints', {
    type,
    value,
    attrKey: props.attrKey
  })
}
</script>

<style lang="less" scoped>
div {
  display: flex;
}

.attr-item-wrap {
  flex-direction: column;
  margin-bottom: 0.5rem;
  width: 100%;
  position: relative;

  .attr-item-top-wrap {
    align-items: center;
    justify-content: space-between;
    font-size: 1.4rem;
    line-height: 2.4rem;
    font-family: PixeloidSans;

    .crit {
      color: #ea4335;
      margin-right: 0.5rem;
    }

    .add-value {
      color: #ea4335;
      margin-left: 0.2rem;
    }
  }

  .progress-wrap {
    width: 100%;
    height: 2rem;
    overflow: hidden;
    background-color: #333333;
    align-items: center;
    position: relative;

    .progress-bar {
      flex: 1;
      height: 100%;
      position: relative;

      .track,
      .edit-track {
        position: absolute;
        width: 100%;
        height: 100%;
        transition: width, background-color;
        transition-duration: 0.5s;
      }

      .track {
        z-index: 2;
      }

      .edit-track {
        z-index: 1;
        background-color: #b5bfc9;
      }
    }

    .subtract-btn,
    .add-btn {
      width: 2rem;
      height: 2rem;
      background-color: #ffffff;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .subtract-btn {
      margin-right: 0.6rem;
    }
  }
}


.tip-container {
  position: absolute;
  width: 100%;
  z-index: 10;
  display: flex;

  span {
    font-size: 1.4rem;
    line-height: 2.4rem;
    font-family: PixeloidSans;
    opacity: 0
  }

  .tip-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .tip-icon-wrap {
      padding: 0.6rem 0.6rem 0.6rem 0.2rem;
      img {
        width: 1.2rem;
        height: 1.2rem;
      }
    }

    .tip-content-wrap {
      position: relative;
      max-width: 100%;
      margin-left: -1.1rem;
      margin-top: -0.1rem;
      .tip-content-border {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 18px solid transparent;
        border-width: 18px 32px;
        border-image: url('@/assets/equipment/tip-bg.svg') 18 32 18 32 fill stretch;
        z-index: 1;
      }
      .tip-content {
        z-index: 2;
        position: relative;
        margin: 1.7rem 1.4rem 0.9rem;
        width: 100%;
        color: #B5BFC9;
        font-size: 1rem;
        line-height: 1.2rem;
        font-family: PixeloidSans;
      }
    }
  }
}
</style>
