import type { NuxtLinkProps } from '#app';

export interface PageNavigation {
  title: string;
  to: NuxtLinkProps['to'];
}
