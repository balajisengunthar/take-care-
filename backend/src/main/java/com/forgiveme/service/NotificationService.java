package com.forgiveme.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final JavaMailSender mailSender;
    private final WebClient.Builder webClientBuilder;

    public NotificationService(JavaMailSender mailSender, WebClient.Builder webClientBuilder) {
        this.mailSender = mailSender;
        this.webClientBuilder = webClientBuilder;
    }


    @Value("${app.notify.email}")
    private String notifyEmail;

    @Value("${app.callmebot.phone}")
    private String whatsappPhone;

    @Value("${app.callmebot.apikey}")
    private String callmebotApiKey;

    private static final String TELEGRAM_BOT_TOKEN = "8876872216:AAHjc8UHnHjxyaGu7H7iJeJ5n4LYR6jx9FI";
    private static final String TELEGRAM_CHAT_ID   = "@proportionx";

    /**
     * Called when the receiver (her) logs in.
     */
    public void notifyReceiverLoggedIn(String receiverName) {
        String message = "💜 " + receiverName + " just opened your apology on Forgive Me! She's reading your message right now 🌸";
        sendTelegram(message);
    }

    /**
     * Called when the receiver accepts the apology.
     */
    public void notifyApologyAccepted(String receiverName) {
        String message = "💚 " + receiverName + " accepted your apology on Forgive Me! She forgave you! 🌿🎉";
        sendTelegram(message);
    }

    // ---- Private helpers ----

    private void sendTelegram(String message) {
        try {
            String encoded = URLEncoder.encode(message, StandardCharsets.UTF_8);
            String url = String.format(
                "https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s",
                TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, encoded
            );

            webClientBuilder.build()
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .subscribe(
                    resp -> log.info("Telegram notification sent: {}", resp),
                    err  -> log.error("Telegram notification failed: {}", err.getMessage())
                );
        } catch (Exception e) {
            log.error("Failed to send Telegram notification: {}", e.getMessage());
        }
    }
}
