package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.AttachmentFile;
import com.thebanmd.helpdesk.dtos.AttachmentResponse;
import com.thebanmd.helpdesk.entities.Attachment;
import com.thebanmd.helpdesk.entities.Ticket;
import com.thebanmd.helpdesk.entities.User;
import com.thebanmd.helpdesk.enums.Role;
import com.thebanmd.helpdesk.exceptions.AttachmentNotFoundException;
import com.thebanmd.helpdesk.exceptions.ForbiddenActionException;
import com.thebanmd.helpdesk.exceptions.InvalidAttachmentException;
import com.thebanmd.helpdesk.exceptions.TicketNotFoundException;
import com.thebanmd.helpdesk.exceptions.UserNotFoundException;
import com.thebanmd.helpdesk.mappers.AttachmentMapper;
import com.thebanmd.helpdesk.repositories.AttachmentRepository;
import com.thebanmd.helpdesk.repositories.TicketRepository;
import com.thebanmd.helpdesk.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/** Bifogade skärmdumpar i ett ärende (TB-35). */
@Service
@RequiredArgsConstructor
public class AttachmentService {

    static final long MAX_SIZE_BYTES = 5L * 1024 * 1024; // 5 MB
    static final int MAX_PER_TICKET = 3;

    private final AttachmentRepository attachmentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final AttachmentMapper attachmentMapper;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public List<AttachmentResponse> getAttachments(Long ticketId) {
        if (!ticketRepository.existsById(ticketId)) {
            throw new TicketNotFoundException(ticketId);
        }
        return attachmentRepository.findByTicketIdOrderByCreatedAtAscIdAsc(ticketId)
                .stream()
                .map(attachmentMapper::toResponse)
                .toList();
    }

    @Transactional
    public AttachmentResponse upload(Long ticketId, Long userId, MultipartFile file) {
        // 1. Vem laddar upp, och till vilket ärende?
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));

        // 2. Bara den som anmält ärendet och IT-ansvariga får bifoga bilder.
        boolean isCreator = Objects.equals(ticket.getCreatedBy().getId(), userId);
        if (!isCreator && user.getRole() != Role.IT_ADMIN) {
            throw new ForbiddenActionException("Bara den som anmält ärendet och IT-ansvariga kan bifoga bilder.");
        }

        // 3. Kontrollera filen. Filtypen avgörs av innehållet, inte av filnamnet.
        if (file == null || file.isEmpty()) {
            throw new InvalidAttachmentException("Ingen fil valdes.");
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new InvalidAttachmentException("Filen är för stor. Max 5 MB.");
        }
        byte[] content = readBytes(file);
        String contentType = detectImageType(content);
        if (contentType == null) {
            throw new InvalidAttachmentException("Bara PNG- och JPG-bilder kan bifogas.");
        }
        if (attachmentRepository.countByTicketId(ticketId) >= MAX_PER_TICKET) {
            throw new InvalidAttachmentException("Ett ärende kan ha högst " + MAX_PER_TICKET + " bilder.");
        }

        // 4. Spara filen i B2 under ett slumpat namn, och informationen om den i databasen.
        String extension = contentType.equals("image/png") ? ".png" : ".jpg";
        String key = "tickets/" + ticketId + "/" + UUID.randomUUID() + extension;
        fileStorageService.save(key, content, contentType);

        Attachment attachment = new Attachment(
                ticket, user, cleanFilename(file.getOriginalFilename()), key, contentType, content.length);
        try {
            return attachmentMapper.toResponse(attachmentRepository.save(attachment));
        } catch (RuntimeException e) {
            // Gick det inte att spara i databasen ska filen inte ligga kvar i B2 utan koppling.
            fileStorageService.delete(key);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public AttachmentFile download(Long ticketId, Long attachmentId) {
        Attachment attachment = attachmentRepository.findByIdAndTicketId(attachmentId, ticketId)
                .orElseThrow(() -> new AttachmentNotFoundException(attachmentId));
        byte[] bytes = fileStorageService.load(attachment.getStorageKey());
        return new AttachmentFile(bytes, attachment.getContentType(), attachment.getOriginalFilename());
    }

    private static byte[] readBytes(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (IOException e) {
            throw new InvalidAttachmentException("Filen kunde inte läsas.");
        }
    }

    /** Känner igen PNG och JPG på de första bytena i filen. Returnerar null för allt annat. */
    static String detectImageType(byte[] content) {
        byte[] png = {(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A};
        if (startsWith(content, png)) {
            return "image/png";
        }
        byte[] jpg = {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF};
        if (startsWith(content, jpg)) {
            return "image/jpeg";
        }
        return null;
    }

    private static boolean startsWith(byte[] content, byte[] prefix) {
        if (content.length < prefix.length) {
            return false;
        }
        for (int i = 0; i < prefix.length; i++) {
            if (content[i] != prefix[i]) {
                return false;
            }
        }
        return true;
    }

    /** Tar bort sökvägar (t.ex. "C:\\bilder\\fel.png" blir "fel.png") och begränsar längden. */
    static String cleanFilename(String original) {
        if (original == null || original.isBlank()) {
            return "bild";
        }
        String name = original.substring(Math.max(original.lastIndexOf('/'), original.lastIndexOf('\\')) + 1).strip();
        if (name.isEmpty()) {
            return "bild";
        }
        return name.length() > 255 ? name.substring(name.length() - 255) : name;
    }
}
