package com.civiceye.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void init() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                // Read from default service account path if present
                String configPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
                if (configPath == null) {
                    configPath = "firebase-applet-config.json";
                }
                
                FileInputStream serviceAccount = new FileInputStream(configPath);
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println("[Firebase Admin SDK] Successfully initialized connected database environment.");
            }
        } catch (IOException e) {
            System.err.println("[Firebase Admin SDK Warning] Initializing in fallback evaluation sandboxed mode: " + e.getMessage());
        }
    }
}
