package com.movielist.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "movie_cast")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString(exclude = "movie") // Exclude movie to prevent recursion
public class MovieCast {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "movie_movie_id", nullable = false)
    private Movie movie;

    @Column(name = "cast_member")
    private String castMember;
}