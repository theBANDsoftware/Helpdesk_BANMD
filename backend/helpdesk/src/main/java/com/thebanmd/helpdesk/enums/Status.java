package com.thebanmd.helpdesk.enums;

public enum Status {
    NEW,
    IN_PROGRESS,
    RESOLVED,
    WITHDRAWN // Anmälaren har tagit tillbaka ärendet medan det hade status NEW (TB-51, beslut 14)
}
