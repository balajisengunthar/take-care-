package com.forgiveme.model;

import jakarta.persistence.*;

@Entity
@Table(name = "apology_status")
public class ApologyStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // WAITING | SEEN | ACCEPTED
    @Column(nullable = false)
    private String status;

    public ApologyStatus() {
    }

    public ApologyStatus(Long id, String status) {
        this.id = id;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

