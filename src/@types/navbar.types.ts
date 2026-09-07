import { IconType } from "react-icons";
import { LucideIcon } from "lucide-react";

export interface navbarChild {
    id: number;
    title: string;
    description: string;
    url: string;
}

export interface navbar {
    title: string;
    url: string;
    id: number;
    icon?: LucideIcon | IconType;
    children?: navbarChild[];
}
