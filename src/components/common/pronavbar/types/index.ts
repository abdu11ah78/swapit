// components/common/pronavbar/types.ts
import { LucideIcon } from "lucide-react"

export interface DropdownItem {
    label: string
    href: string
    icon: LucideIcon
}

export interface MegaMenuSection {
    title: string
    items: DropdownItem[]
}

export interface MegaMenuFeatured {
    title: string
    image: string
    href: string
}

export interface NavItem {
    id: string
    label: string
    icon: LucideIcon
    mainHref: string
    type?: 'dropdown' | 'mega'
    items?: DropdownItem[]
    megaSections?: MegaMenuSection[]
    megaFeatured?: MegaMenuFeatured[]
}