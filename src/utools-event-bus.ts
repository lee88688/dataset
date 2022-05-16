import { useEventBus, EventBusKey } from '@vueuse/core'

type OnPluginEnterEvent = Parameters<Parameters<typeof utools.onPluginEnter>[0]>[0]
export const onPluginEnterKey: EventBusKey<OnPluginEnterEvent> = Symbol('onPluginEnter')

const onPluginEnterBus = useEventBus(onPluginEnterKey)
utools.onPluginEnter((e) => {
  onPluginEnterBus.emit(e)
})

export const onPluginOutKey: EventBusKey<void> = Symbol('onPluginOut')

const onPluginOutBus = useEventBus(onPluginOutKey)
utools.onPluginOut(() => {
  onPluginOutBus.emit()
})
