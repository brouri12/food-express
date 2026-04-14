package com.foodexpress.restaurant.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name = "opening_hours")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpeningHours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String restaurantId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek dayOfWeek; // MONDAY, TUESDAY...

    @Column(nullable = false)
    private LocalTime openTime;  // ex: 11:00

    @Column(nullable = false)
    private LocalTime closeTime; // ex: 22:30

    @Builder.Default
    private boolean closed = false; // true = fermé ce jour
}
