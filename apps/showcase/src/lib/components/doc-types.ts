export interface ComponentPropDoc {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  kind?: "prop" | "bindable" | "event" | "snippet";
}

export interface ComponentApiGroup {
  title: string;
  props: ComponentPropDoc[];
}
