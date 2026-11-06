package com.thebanmd.helpdesk.mappers;

import com.thebanmd.helpdesk.dtos.AttachmentResponse;
import com.thebanmd.helpdesk.entities.Attachment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AttachmentMapper {

    @Mapping(target = "filename", source = "originalFilename")
    @Mapping(target = "uploadedBy", source = "uploadedBy.name")
    AttachmentResponse toResponse(Attachment attachment);
}
