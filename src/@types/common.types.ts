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