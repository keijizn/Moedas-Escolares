package com.example.moeda.moedaestudantil.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:no-reply@moedasescolares.com}")
    private String from;

    /**
     * Envia e-mail HTML de forma assíncrona (não bloqueia a thread do request).
     * Caso haja falha, apenas registra; não quebra o fluxo de cadastro.
     */
    @Async
    public void sendHtml(String to, String subject, String html) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(msg);
        } catch (Exception e) {
            // Log simples; se preferir, troque por um logger
            e.printStackTrace();
        }
    }

    /** Versão texto puro (útil para testes/alternativa). */
    @Async
    public void sendText(String to, String subject, String text) {
        sendHtml(to, subject, "<pre style=\"font-family:monospace\">" + escape(text) + "</pre>");
    }

    private String escape(String s) {
        return s == null ? "" : s
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }
}
