export interface Customer {
  id: number;
  name: string;
  logoUrl: string;
  category: string;
}

export const customers: Customer[] = [
  { id: 1, name: "Acme Corp", logoUrl: "/logos/acme.png", category: "Tech" },
  { id: 2, name: "Beta Inc", logoUrl: "/logos/beta.png", category: "Finance" },
  { id: 3, name: "Gamma Ltd", logoUrl: "/logos/gamma.png", category: "Health" },
  { id: 4, name: "Delta LLC", logoUrl: "/logos/delta.png", category: "Tech" },
  // add more as needed
];
