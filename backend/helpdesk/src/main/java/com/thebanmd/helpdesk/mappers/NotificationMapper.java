package com.thebanmd.helpdesk.mappers;

import com.thebanmd.helpdesk.dtos.NotificationResponse;
import com.thebanmd.helpdesk.entities.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface NotificationMapper {

	@Mapping(target = "ticketId", source = "ticket.id")
	@Mapping(target = "read", expression = "java(notification.getReadAt() != null)")
	NotificationResponse toResponse(Notification notification);
}
