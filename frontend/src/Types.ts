export type categoryTicket = "COMPUTER"|"PRINTER"|"NETWORK"|"ACCOUNT"|"OTHER"

export type CreateTicket = {

    title: string
    description: string
    category: categoryTicket
    createdBy: number

};


export type TicketStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED';

// datatype för detaljer till ärende
export type TicketDetail = {
  id: number;
  title: string;
  description: string;
  category: categoryTicket;
  status: TicketStatus;
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TicketSummary = {
  id: number;
  title: string;
  category: categoryTicket;
  status: TicketStatus;
  createdAt: string;
};