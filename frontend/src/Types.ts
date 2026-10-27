export type categoryTicket = "COMPUTER"|"PRINTER"|"NETWORK"|"ACCOUNT"|"OTHER"

export type CreateTicket = {

    title: string
    description: string
    category: categoryTicket
    createdBy: number

};

export const categoryLabels: Record<categoryTicket, string> = {
  COMPUTER: 'Dator',
  PRINTER: 'Skrivare',
  NETWORK: 'Nätverk',
  ACCOUNT: 'Konto',
  OTHER: 'Övrigt',
};


