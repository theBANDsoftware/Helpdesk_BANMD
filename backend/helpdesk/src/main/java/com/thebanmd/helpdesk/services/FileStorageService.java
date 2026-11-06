package com.thebanmd.helpdesk.services;

/**
 * Var bifogade filer sparas (beslut 11). Just nu finns bara S3FileStorageService,
 * som sparar i Backblaze B2. Ska vi byta lagring skriver vi en ny klass som
 * implementerar det här interfacet, och resten av koden behöver inte ändras.
 */
public interface FileStorageService {

    /** Sparar filen under nyckeln, t.ex. "tickets/12/3f2a….png". */
    void save(String key, byte[] content, String contentType);

    /** Hämtar filen. Kastar AttachmentNotFoundException om den inte finns i lagringen. */
    byte[] load(String key);

    /** Tar bort filen. Gör inget om den inte finns. */
    void delete(String key);
}
