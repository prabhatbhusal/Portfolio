interface Button {
  id: number;
  text: string;
  href: string;
  primary: boolean;
}

export interface heroData {
  id: number;
  status: string;
  firstName: string;
  lastName: string;
  description: string;
  buttons: Button[];
}
export interface SkillsData{
  id:number;
  title:string;
  stack:Stack[]
}
interface Stack{
  lang:string
}