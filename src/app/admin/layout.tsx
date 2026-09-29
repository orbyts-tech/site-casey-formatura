import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Painel • Casey",
    template: "%s • Painel da Casey",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
