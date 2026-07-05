import cameraIcon from '../../../assets/svgs/stp1.svg'
import planIcon from '../../../assets/svgs/stp2.svg'
import sensorIcon from '../../../assets/svgs/stp3.svg'
import protectionIcon from '../../../assets/svgs/stp4.svg'
import planBadgeIcon from '../../../assets/svgs/planSvg.svg'
import deliveryIcon from '../../../assets/svgs/delivery.svg'
import satisfactionBadge from '../../../assets/svgs/SatisfactionBadge.svg'
import type { StepIcon } from '../types/bundle'

export const stepIcons: Record<StepIcon, string> = {
  camera: cameraIcon,
  plan: planIcon,
  sensor: sensorIcon,
  protection: protectionIcon,
}

export const reviewIcons = {
  planBadge: planBadgeIcon,
  delivery: deliveryIcon,
  satisfactionBadge,
}
