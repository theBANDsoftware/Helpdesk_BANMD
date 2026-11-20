package com.thebanmd.helpdesk.dtos;

import com.thebanmd.helpdesk.enums.Category;
import jakarta.validation.constraints.NotNull;

/** Det frontend skickar för att ändra kategori, t.ex. {"category": "PRINTER"}. */
public record UpdateCategoryRequest(@NotNull(message = "Kategori krävs") Category category) {
}
