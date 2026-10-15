import { IconType } from "react-icons";
import { LucideIcon } from "lucide-react";

export interface NavChild {
    id: number;
    title: string;
    description: string;
    url: string;
}

export interface NavItem {
    title: string;
    url: string;
    id: number;
    icon?: LucideIcon | IconType;
    children?: NavChild[];
}
