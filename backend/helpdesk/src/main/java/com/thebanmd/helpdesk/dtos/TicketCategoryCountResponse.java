package com.thebanmd.helpdesk.dtos;

import com.thebanmd.helpdesk.enums.Category;

public record TicketCategoryCountResponse(Category category, long count) {
}
