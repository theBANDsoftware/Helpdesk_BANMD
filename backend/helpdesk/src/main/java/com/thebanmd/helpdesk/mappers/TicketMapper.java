package com.thebanmd.helpdesk.mappers;

import com.thebanmd.helpdesk.dtos.CreateTicketRequest;
import com.thebanmd.helpdesk.dtos.TicketDetailResponse;
import com.thebanmd.helpdesk.dtos.TicketSummaryResponse;
import com.thebanmd.helpdesk.entities.Ticket;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface TicketMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "assignedTo", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Ticket toEntity(CreateTicketRequest request);

    @Mapping(target = "createdBy", source = "createdBy.name")
    @Mapping(target = "assignedTo", source = "assignedTo.name")
    TicketDetailResponse toDetailResponse(Ticket ticket);

    TicketSummaryResponse toSummaryResponse(Ticket ticket);
    List<TicketSummaryResponse> toSummaryResponseList(List<Ticket> tickets);
}
