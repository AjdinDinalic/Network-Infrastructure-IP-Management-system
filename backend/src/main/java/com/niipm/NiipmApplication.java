package com.niipm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class NiipmApplication {
    public static void main(String[] args) {
        SpringApplication.run(NiipmApplication.class, args);
    }
}
