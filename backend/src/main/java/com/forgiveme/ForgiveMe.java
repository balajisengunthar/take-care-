package com.forgiveme;

import com.forgiveme.model.ApologyStatus;
import com.forgiveme.model.User;
import com.forgiveme.repository.ApologyStatusRepository;
import com.forgiveme.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ForgiveMe {

    public static void main(String[] args) {
        SpringApplication.run(ForgiveMe.class, args);
    }

    @Bean
    CommandLineRunner seedData(
            UserRepository userRepo,
            ApologyStatusRepository apologyRepo,
            @Value("${app.users.sender.name}") String senderName,
            @Value("${app.users.sender.password}") String senderPass,
            @Value("${app.users.receiver.name}") String receiverName,
            @Value("${app.users.receiver.password}") String receiverPass
    ) {
        return args -> {
            if (userRepo.count() == 0) {
                User sender   = new User(null, senderName,   senderPass,   "SENDER");
                User receiver = new User(null, receiverName, receiverPass, "RECEIVER");
                userRepo.save(sender);
                userRepo.save(receiver);
            }
            if (apologyRepo.count() == 0) {
                apologyRepo.save(new ApologyStatus(null, "WAITING"));
            }
        };
    }
}
