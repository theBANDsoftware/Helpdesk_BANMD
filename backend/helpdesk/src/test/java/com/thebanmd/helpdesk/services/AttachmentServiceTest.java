package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.AttachmentFile;
import com.thebanmd.helpdesk.dtos.AttachmentResponse;
import com.thebanmd.helpdesk.entities.Attachment;
import com.thebanmd.helpdesk.entities.Ticket;
import com.thebanmd.helpdesk.entities.User;
import com.thebanmd.helpdesk.enums.Category;
import com.thebanmd.helpdesk.enums.Role;
import com.thebanmd.helpdesk.exceptions.AttachmentNotFoundException;
import com.thebanmd.helpdesk.exceptions.ForbiddenActionException;
import com.thebanmd.helpdesk.exceptions.InvalidAttachmentException;
import com.thebanmd.helpdesk.mappers.AttachmentMapper;
import com.thebanmd.helpdesk.repositories.AttachmentRepository;
import com.thebanmd.helpdesk.repositories.TicketRepository;
import com.thebanmd.helpdesk.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Testar AttachmentService utan databas och utan B2. Repositoryna är Mockito-mockar
 * och B2 ersätts av en lagring i minnet (FakeStorage längst ner).
 */
class AttachmentServiceTest {

    private static final byte[] PNG = {(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A, 1, 2, 3};

    private final AttachmentRepository attachmentRepository = mock(AttachmentRepository.class);
    private final TicketRepository ticketRepository = mock(TicketRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final FakeStorage storage = new FakeStorage();
    private final AttachmentService service = new AttachmentService(
            attachmentRepository, ticketRepository, userRepository,
            Mappers.getMapper(AttachmentMapper.class), storage);

    private final User anna = user(1L, "Anna Lind", Role.EMPLOYEE);
    private final User omar = user(2L, "Omar Haddad", Role.EMPLOYEE);
    private final User maria = user(5L, "Maria Nordin", Role.IT_ADMIN);
    private final Ticket annasTicket = new Ticket("Skrivaren skriver inte ut", "Felkod 42", Category.PRINTER, anna);

    @BeforeEach
    void setUp() {
        annasTicket.setId(10L);
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(annasTicket));
        when(userRepository.findById(1L)).thenReturn(Optional.of(anna));
        when(userRepository.findById(2L)).thenReturn(Optional.of(omar));
        when(userRepository.findById(5L)).thenReturn(Optional.of(maria));
        when(attachmentRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void anmalarenKanBifogaPng() {
        AttachmentResponse response = service.upload(10L, 1L, file("fel.png", PNG));

        assertThat(response.filename()).isEqualTo("fel.png");
        assertThat(response.contentType()).isEqualTo("image/png");
        assertThat(response.uploadedBy()).isEqualTo("Anna Lind");
        assertThat(storage.files).hasSize(1);
        assertThat(storage.files.keySet().iterator().next()).startsWith("tickets/10/").endsWith(".png");
    }

    @Test
    void itAnsvarigKanBifogaTillAndrasArende() {
        AttachmentResponse response = service.upload(10L, 5L, file("fel.png", PNG));

        assertThat(response.uploadedBy()).isEqualTo("Maria Nordin");
        assertThat(storage.files).hasSize(1);
    }

    @Test
    void annanAnstalldFarInteBifoga() {
        assertThatThrownBy(() -> service.upload(10L, 2L, file("fel.png", PNG)))
                .isInstanceOf(ForbiddenActionException.class);
        assertThat(storage.files).isEmpty();
        verify(attachmentRepository, never()).save(any());
    }

    @Test
    void filSomInteArBildNekasAvenOmDenHeterPng() {
        byte[] text = "det här är ingen bild".getBytes();

        assertThatThrownBy(() -> service.upload(10L, 1L, file("virus.png", text)))
                .isInstanceOf(InvalidAttachmentException.class)
                .hasMessage("Bara PNG- och JPG-bilder kan bifogas.");
        assertThat(storage.files).isEmpty();
    }

    @Test
    void forStorFilNekas() {
        byte[] big = new byte[(int) AttachmentService.MAX_SIZE_BYTES + 1];
        System.arraycopy(PNG, 0, big, 0, PNG.length);

        assertThatThrownBy(() -> service.upload(10L, 1L, file("stor.png", big)))
                .isInstanceOf(InvalidAttachmentException.class)
                .hasMessage("Filen är för stor. Max 5 MB.");
    }

    @Test
    void hogstTreBilderPerArende() {
        when(attachmentRepository.countByTicketId(10L)).thenReturn(3L);

        assertThatThrownBy(() -> service.upload(10L, 1L, file("fjarde.png", PNG)))
                .isInstanceOf(InvalidAttachmentException.class)
                .hasMessage("Ett ärende kan ha högst 3 bilder.");
        assertThat(storage.files).isEmpty();
    }

    @Test
    void filenTasBortFranLagringenOmDatabasenMisslyckas() {
        when(attachmentRepository.save(any())).thenThrow(new RuntimeException("databasen svarar inte"));

        assertThatThrownBy(() -> service.upload(10L, 1L, file("fel.png", PNG)))
                .hasMessage("databasen svarar inte");
        assertThat(storage.files).isEmpty();
    }

    @Test
    void downloadHamtarBildenFranLagringen() {
        Attachment attachment = new Attachment(annasTicket, anna, "fel.png", "tickets/10/abc.png", "image/png", PNG.length);
        storage.files.put("tickets/10/abc.png", PNG);
        when(attachmentRepository.findByIdAndTicketId(7L, 10L)).thenReturn(Optional.of(attachment));

        AttachmentFile result = service.download(10L, 7L);

        assertThat(result.bytes()).isEqualTo(PNG);
        assertThat(result.contentType()).isEqualTo("image/png");
    }

    @Test
    void downloadViaFelArendeGerNotFound() {
        when(attachmentRepository.findByIdAndTicketId(7L, 99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.download(99L, 7L))
                .isInstanceOf(AttachmentNotFoundException.class);
    }

    @Test
    void cleanFilenameTarBortSokvagar() {
        assertThat(AttachmentService.cleanFilename("C:\\Users\\anna\\fel.png")).isEqualTo("fel.png");
        assertThat(AttachmentService.cleanFilename("../../etc/passwd")).isEqualTo("passwd");
        assertThat(AttachmentService.cleanFilename(null)).isEqualTo("bild");
    }

    private static User user(Long id, String name, Role role) {
        User user = new User(name, role);
        ReflectionTestUtils.setField(user, "id", id);
        return user;
    }

    private static MockMultipartFile file(String name, byte[] content) {
        return new MockMultipartFile("file", name, "image/png", content);
    }

    /** Lagring i minnet i stället för B2. */
    private static class FakeStorage implements FileStorageService {
        final Map<String, byte[]> files = new HashMap<>();

        @Override
        public void save(String key, byte[] content, String contentType) {
            files.put(key, content);
        }

        @Override
        public byte[] load(String key) {
            byte[] content = files.get(key);
            if (content == null) {
                throw new AttachmentNotFoundException("Bilden finns inte i fillagringen");
            }
            return content;
        }

        @Override
        public void delete(String key) {
            files.remove(key);
        }
    }
}
