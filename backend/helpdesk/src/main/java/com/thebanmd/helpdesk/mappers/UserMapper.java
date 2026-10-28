package com.thebanmd.helpdesk.mappers;

import com.thebanmd.helpdesk.dtos.UserResponse;
import com.thebanmd.helpdesk.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface UserMapper {

    UserResponse toResponse(User user);

    List<UserResponse> toResponseList(List<User> users);
}
