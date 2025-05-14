package com.movielist.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.movielist.dto.MovieDto;
import com.movielist.dto.MoviePageResponse;
import com.movielist.exceptions.EmptyFileException;
import com.movielist.exceptions.MovieNotFoundException;
import com.movielist.service.Movie.MovieService;
import com.movielist.utils.AppConstants;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {
    private final MovieService movieService;
    private final ObjectMapper objectMapper;

    public MovieController(MovieService movieService, ObjectMapper objectMapper) {
        this.movieService = movieService;
        this.objectMapper = objectMapper;
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<MovieDto> addMovieHandler(
            @RequestPart MultipartFile file,
            @RequestPart String movieDto) throws EmptyFileException, IOException {

            if(file.isEmpty()){
                throw  new EmptyFileException("File is empty! please add a file");
            }
            MovieDto dto = objectMapper.readValue(movieDto, MovieDto.class);
            MovieDto savedMovie = movieService.addMovie(dto, file);
            return new ResponseEntity<>(savedMovie, HttpStatus.CREATED);

    }

    @GetMapping("/{movieId}")
    public ResponseEntity<MovieDto> getMovie(@PathVariable Integer movieId) throws MovieNotFoundException {
            MovieDto movieDto = movieService.getMovie(movieId);
            return ResponseEntity.ok(movieDto);

    }

    @GetMapping
    public ResponseEntity<List<MovieDto>> getAllMovies() {
        List<MovieDto> movies = movieService.getAllMovies();
        return ResponseEntity.ok(movies);
    }

    @PutMapping("/{movieId}")
    public ResponseEntity<MovieDto> updateMovieHandler(
            @PathVariable Integer movieId,
            @RequestPart(required = false) MultipartFile file,
            @RequestPart String movieDto) throws IOException, MovieNotFoundException {

            MovieDto dto = objectMapper.readValue(movieDto, MovieDto.class);
            MovieDto updatedMovie = movieService.updateMovie(movieId, dto, file);
            return ResponseEntity.ok(updatedMovie);

    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @DeleteMapping("/{movieId}")
    public ResponseEntity<Map<String, String>> deleteMovie(@PathVariable Integer movieId) throws MovieNotFoundException {

            movieService.deleteMovie(movieId);
            return ResponseEntity.ok(Map.of("message", "Movie deleted successfully"));

    }

    @GetMapping("/allMoviesPage")
    public ResponseEntity<MoviePageResponse> getMoviesWithPagination(
            @RequestParam(defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize
    ) {
        return ResponseEntity.ok(movieService.getAllMoviesWithPagination(pageNumber, pageSize));
    }

    @GetMapping("/allMoviesPageSort")
    public ResponseEntity<MoviePageResponse> getMoviesWithPaginationAndSorting(
            @RequestParam(defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(defaultValue = AppConstants.SORT_BY, required = false) String sortBy,
            @RequestParam(defaultValue = AppConstants.SORT_DIR, required = false) String dir
    ) {
        return ResponseEntity.ok(movieService.getAllMoviesWithPaginationAndSorting(pageNumber, pageSize, sortBy, dir));
    }

    @GetMapping("/search")
    public ResponseEntity<MoviePageResponse> searchMovies(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(defaultValue = AppConstants.SORT_BY, required = false) String sortBy,
            @RequestParam(defaultValue = AppConstants.SORT_DIR, required = false) String dir
    ) {
        return ResponseEntity.ok(movieService.searchMovies(keyword, pageNumber, pageSize, sortBy, dir));
    }
}