package com.movielist.repositories;

import com.movielist.entities.Movie;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface MovieRepository extends JpaRepository<Movie, Integer> {

    @Query("SELECT DISTINCT m FROM Movie m LEFT JOIN m.movieCast mc WHERE " +
            "LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(m.director) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(m.studio) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(mc.castMember) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Movie> searchMovies(@Param("keyword") String keyword, Pageable pageable);

}
