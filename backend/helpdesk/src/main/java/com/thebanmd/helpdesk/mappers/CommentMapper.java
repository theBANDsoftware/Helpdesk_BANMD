package com.thebanmd.helpdesk.mappers;

import com.thebanmd.helpdesk.dtos.CommentResponse;
import com.thebanmd.helpdesk.entities.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CommentMapper {

    /** Gör om en kommentar till CommentResponse. Författarens namn hämtas från author.name. */
    @Mapping(target = "author", source = "author.name")
    CommentResponse toResponse(Comment comment);
}
