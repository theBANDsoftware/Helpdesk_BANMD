package com.thebanmd.helpdesk.controllers;

import com.thebanmd.helpdesk.dtos.AttachmentFile;
import com.thebanmd.helpdesk.dtos.AttachmentResponse;
import com.thebanmd.helpdesk.services.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;

/** Bifogade skärmdumpar i ett ärende (TB-35). */
@RestController
@RequestMapping("/api/tickets/{ticketId}/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    // Lista med information om ärendets bilder
    @GetMapping
    public List<AttachmentResponse> getAttachments(@PathVariable Long ticketId) {
        return attachmentService.getAttachments(ticketId);
    }

    // Laddar upp en bild. Skickas som multipart/form-data med fältet "file".
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AttachmentResponse> upload(
            @PathVariable Long ticketId,
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam("file") MultipartFile file) {
        AttachmentResponse response = attachmentService.upload(ticketId, userId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Själva bilden. Används direkt i <img src="…"> i frontend.
    @GetMapping("/{attachmentId}")
    public ResponseEntity<byte[]> download(@PathVariable Long ticketId, @PathVariable Long attachmentId) {
        AttachmentFile file = attachmentService.download(ticketId, attachmentId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline().filename(file.filename(), StandardCharsets.UTF_8).build().toString())
                .header("X-Content-Type-Options", "nosniff")
                .cacheControl(CacheControl.maxAge(Duration.ofHours(1)).cachePrivate())
                .body(file.bytes());
    }
}
