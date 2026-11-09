package com.thebanmd.helpdesk.controllers;

import com.thebanmd.helpdesk.dtos.CommentResponse;
import com.thebanmd.helpdesk.dtos.CreateCommentRequest;
import com.thebanmd.helpdesk.services.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /** Alla kommentarer på ett ärende, äldst först. */
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.getComments(id));
    }

    /** Skapar en ny kommentar på ett ärende. Svarar 201 med den nya kommentaren. */
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(
        @PathVariable Long id,
        @RequestHeader("X-User-Id") Long userId,
        @Valid @RequestBody CreateCommentRequest request
    ) {
        CommentResponse response = commentService.createComment(id, userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
