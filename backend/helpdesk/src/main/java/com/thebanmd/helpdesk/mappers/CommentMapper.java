package com.thebanmd.helpdesk.mappers;

import com.thebanmd.helpdesk.dtos.CommentResponse;
import com.thebanmd.helpdesk.entities.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CommentMapper {

    // Berättar att fältet "author" i CommentResponse ska hämta sitt värde från "author.name" i Comment-entiteten
    @Mapping(target = "author", source = "author.name")
    CommentResponse toResponse(Comment comment);
}
