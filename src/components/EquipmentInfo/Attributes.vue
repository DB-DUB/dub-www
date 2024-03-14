<template>
  <div class="attrs-wrap">
    <AttributeItem
      v-for="(attr, index) in attrs"
      :key="index"
      :added-points="attr.addedPoints"
      :attr-key="attr.attrKey"
      :attr-name="attr.attrName"
      :attr-value="attr.attrValue"
      :attr-tip="attr.attrTip"
      :crit-upgrade="attr.critUpgrade"
      :available-points="availablePoints"
      :enable-edit="info.free_attribute > 0"
      :loading="loading"
      :track-color="themeColor"
      @onUpdateAddedPoints="onUpdateAddedPoints"
      v-model:show-tip-attr-key='showTipKey'
    />
    <div class="available-points-wrap">
      <div class="available-points">
        {{ 'Available Points:'
        }}<span :style="{ color: info.free_attribute > 0 ? '#EA4335' : '#ffffff' }">{{
          info.free_attribute
        }}</span>
      </div>
      <div v-if="info.free_attribute > 0" class="btn-wrap">
        <Button
          @click="confirmReq"
          size="mini"
          title="Confirm"
          :loading="loading"
          :disabled="!enableConfirm"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EquipmentModel } from '@/api/model/equipment'
import { computed, ref, watch } from 'vue'
import { useEqptStore } from '@/stores/modules/eqpt'

interface Props {
  info: EquipmentModel
  themeColor: string
}

const props = withDefaults(defineProps<Props>(), {})

interface AttrData {
  attrName: string
  attrValue: number
  attrKey: string
  attrTip: string
  addedPoints: number
  critUpgrade: boolean
}

const attrs = ref<AttrData[]>([])
const loading = ref<Boolean>(false)

const showTipKey = ref('')

const updateShowTipKey = (attrKey: string) => {
  showTipKey.value = attrKey
}


const initAttrs = () => {
  attrs.value = [
    {
      attrName: 'Power',
      attrValue: props.info.power,
      attrKey: 'power',
      addedPoints: 0,
      critUpgrade: false,
      attrTip: 'Power determines how many LOL points you earn with each dub.'
    },
    {
      attrName: 'Shell',
      attrValue: props.info.endurance,
      attrKey: 'endurance',
      addedPoints: 0,
      critUpgrade: false,
      attrTip: 'Shell guards against durability damage taken for dubbing.'
    },
    {
      attrName: 'Luck',
      attrValue: props.info.luck,
      attrKey: 'luck',
      addedPoints: 0,
      critUpgrade: false,
      attrTip: 'Luck increases crit amount and chance for each dub.'
    }
  ]
}

watch(
  () => props.info.id || props.info.mint_address,
  () => {
    attrs.value = [
      {
        attrName: 'Power',
        attrValue: props.info.power,
        attrKey: 'power',
        addedPoints: 0,
        critUpgrade: false,
        attrTip: 'Power determines how many LOL points you earn with each dub.'
      },
      {
        attrName: 'Shell',
        attrValue: props.info.endurance,
        attrKey: 'endurance',
        addedPoints: 0,
        critUpgrade: false,
        attrTip: 'Shell guards against durability damage taken for dubbing.'
      },
      {
        attrName: 'Luck',
        attrValue: props.info.luck,
        attrKey: 'luck',
        addedPoints: 0,
        critUpgrade: false,
        attrTip: 'Luck increases crit amount and chance for each dub.'
      }
    ]
  },
  { immediate: true }
)

/***
 * button is clickable
 * addedPoints > 0
 */
const enableConfirm = computed(() => {
  return attrs.value.some(item => item.addedPoints > 0)
})

const availablePoints = computed(() => {
  let totalAddedPoint = 0
  attrs.value.forEach(item => (totalAddedPoint += item.addedPoints))
  return props.info.free_attribute - totalAddedPoint
})

const onUpdateAddedPoints = (params: {
  type: 'subtract' | 'add'
  value: number
  attrKey: string
}) => {
  const targetAttrIndex = attrs.value.findIndex(item => item.attrKey === params.attrKey)
  const targetAttr = attrs.value[targetAttrIndex]

  if (params.type === 'subtract') {
    attrs.value[targetAttrIndex] = {
      ...targetAttr,
      addedPoints: targetAttr.addedPoints -= params.value,
      critUpgrade: false
    }
  } else {
    attrs.value[targetAttrIndex] = {
      ...targetAttr,
      addedPoints: targetAttr.addedPoints += params.value,
      critUpgrade: false
    }
  }
}

const confirmReq = () => {
  let params: any = {
    id: props.info.id
  }
  attrs.value.forEach(item => {
    params[item.attrKey] = item.addedPoints
  })
  loading.value = true

  useEqptStore()
    .addEqptAttrPoint(props.info.id, params)
    .then(({ resp, infoResp }) => {
      attrs.value.forEach((item, index) => {
        if (item.attrKey === 'power') {
          attrs.value[index] = {
            ...item,
            attrValue: infoResp.power,
            critUpgrade: resp.power_crit === 2,
            addedPoints: 0
          }
        } else if (item.attrKey === 'endurance') {
          attrs.value[index] = {
            ...item,
            attrValue: infoResp.endurance,
            critUpgrade: resp.endurance_crit === 2,
            addedPoints: 0
          }
        } else if (item.attrKey === 'luck') {
          attrs.value[index] = {
            ...item,
            attrValue: infoResp.luck,
            critUpgrade: resp.luck_crit === 2,
            addedPoints: 0
          }
        }
      })
    })
    .catch(e => {})
    .finally(() => {
      loading.value = false
    })
}

defineExpose({
  initAttrs,
  updateShowTipKey
})
</script>

<style lang="less" scoped>
div {
  display: flex;
}
.attrs-wrap {
  flex-direction: column;
  margin-bottom: 1.4rem;

  .available-points-wrap {
    margin-top: 0.6rem;
    align-items: center;
    justify-content: space-between;

    .available-points {
      font-size: 1.2rem;
      line-height: 2rem;
      color: #ffffff;
      align-items: center;
      font-family: PixeloidSans;
      span {
        color: #ea4335;
        margin-left: 0.2rem;
      }
    }

    .btn-wrap {
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
