<template>
  <div class="tabbar-wrap">
    <div
      v-for="tabbar in menuList"
      class="tabbar-item"
      :class="{ selected: selectedKey === tabbar.name }"
      @click="selectTab(tabbar.name)"
    >
      {{ tabbar.meta.menuName
      }}<span v-if="getDotInfo(tabbar).number > 0">
        <img v-if="getDotInfo(tabbar).type === 'dot'" class="reddot" src="@/assets/reddot.svg" />
        <span v-else-if="getDotInfo(tabbar).type === 'number'" class="reddot-num">
          {{ getDotInfo(tabbar).number > 99 ? '99+' : getDotInfo(tabbar).number }}
        </span>
      </span>
      <img v-if="tabbar.name === 'Shop' && showShopAirdrop" class="shop-extra-icon" src="@/assets/shop/airdrop.png">
      <img
        v-show="selectedKey === tabbar.name"
        class="selected-arrow"
        src="@/assets/tabbar-selected-arrow.svg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, unref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePermissionStore } from '@/stores/modules/permission'
import { useEqptStore } from '@/stores/modules/eqpt'
import { usePrankStore } from '@/stores/modules/prank'
import { SubName, pubSubUtil } from '@/utils/pub-sub'

interface Props {
  isLogin?: boolean
  menuList?: any[]
}
const props = withDefaults(defineProps<Props>(), {
  isLogin: false,
  menuList: []
})
const permissionStore = usePermissionStore()
const eqptStore = useEqptStore()
const prankStore = usePrankStore()
const menuList = computed(() => {
  if (props.isLogin) return props.menuList
  return permissionStore.addRouters.filter(item => !item.meta?.hidden)
})

const dotInfo = computed(() => {
  if (props.isLogin) return []
  return [
    {
      name: 'Prank',
      type: 'number',
      number: prankStore.unclaimedNum
    },
    {
      name: 'MyEggs',
      type: 'dot',
      number: eqptStore.eqptTabBadge
    }
  ]
})

const router = useRouter()
const { currentRoute } = useRouter()
const route = useRoute()
const selectedKey = ref('')
const emit = defineEmits(['clickMenu'])
const showShopAirdrop = ref(import.meta.env.VITE_FLAG_TOKEN_AIRDROP === 'true')

function getSelectKey() {
  const meta = unref(currentRoute).meta
  const currentActive = meta.activeMenu as RouteRecordName
  if (currentActive) selectedKey.value = currentActive
}

function selectTab(key: RouteRecordName) {
  if (props.isLogin) {
    emit('clickMenu', key)
  } else {
    pubSubUtil.emit(SubName.Sync)
    selectedKey.value = key
    router.push({ name: key })
  }
}

function getDotInfo(tabbar) {
  const info = dotInfo.value.find(item => item.name === tabbar.name)
  return (
    info || {
      type: 'dot',
      number: 0
    }
  )
}

onMounted(() => {
  getSelectKey()
})

watch(
  () => route.name,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      getSelectKey()
    }
  }
)
</script>

<style lang="less" scoped>
@import '@/styles/constant';
.tabbar-wrap {
  display: flex;
  padding: 1rem 2rem 1.8rem;
  align-items: flex-start;
  justify-content: space-between;
  .tabbar-item {
    line-height: 3.6rem;
    font-size: 1.8rem;
    font-family: PixeloidSans;
    padding: 0 1rem;
    position: relative;
    user-select: none;
    cursor: pointer;
    .selected-arrow {
      position: absolute;
      width: 1.8rem;
      height: 1.1rem;
      bottom: -1.1rem;
      left: 50%;
      transform: translateX(-50%);
    }
    .reddot {
      position: absolute;
      width: 1.8rem;
      height: 1.8rem;
    }
    .reddot-num {
      position: absolute;
      border: 5px solid transparent;
      border-image: url('@/assets/reddot.svg') 5 fill stretch;
      padding: 0;
      line-height: 1.2rem;
      font-size: 1.2rem;
      min-width: calc(1.2rem + 10px);
      text-align: center;
      color: #fff;
      font-family: PixeloidSans;
    }
    .shop-extra-icon {
      position: absolute;
      width: 2.8rem;
      height: 2.8rem;
      right: -1.2rem;
      top: -0.8rem;
    }
  }
  .tabbar-item.selected {
    font-family: PixeloidSans-Bold;
    color: @primaryColor;
    .reddot-num {
      color: #fff;
      font-family: PixeloidSans;
    }
  }
}
</style>
