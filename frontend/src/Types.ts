export type categoryTicket = "COMPUTER"|"PRINTER"|"NETWORK"|"ACCOUNT"|"OTHER"

export type CreateTicket = {

    title: string
    description: string
    category: categoryTicket
    createdBy: number

};


