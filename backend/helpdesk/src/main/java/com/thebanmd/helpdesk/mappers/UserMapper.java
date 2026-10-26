package com.thebanmd.helpdesk.mappers;

import com.thebanmd.helpdesk.entities.User;
import com.thebanmd.helpdesk.repositories.TicketRepository;
import com.thebanmd.helpdesk.services.UserService;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserMapper {

    private final TicketRepository ticketRepository;
    private final UserService userService;

    public UserMapper(TicketRepository ticketRepository, UserService userService) {
        this.ticketRepository = ticketRepository;
        this.userService = userService;
    }

//    public Ticket DTOToTicket(CreateTicketRequest ticketDTO) {
//        UserResponse userResponse = userService.findById(0L);
//        User user = DTOToUser(userResponse);
//
//        return new Ticket(
//            ticketDTO.title(),
//            ticketDTO.description(),
//            ticketDTO.category(),
//            user
//        );
//    }

    public static User DTOToUser(User userResponse) {
        return new User(
            userResponse.name(),
            userResponse.role()
        );
    }
}
