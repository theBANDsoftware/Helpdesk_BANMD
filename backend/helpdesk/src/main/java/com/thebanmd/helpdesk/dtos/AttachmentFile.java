package com.thebanmd.helpdesk.dtos;

/** Själva bilden, som den skickas tillbaka till webbläsaren. */
public record AttachmentFile(byte[] bytes, String contentType, String filename) {}
