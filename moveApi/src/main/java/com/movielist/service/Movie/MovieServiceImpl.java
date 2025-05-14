package com.movielist.service.Movie;

import com.movielist.dto.MovieDto;
import com.movielist.dto.MoviePageResponse;
import com.movielist.entities.Movie;
import com.movielist.entities.MovieCast;
import com.movielist.exceptions.MovieNotFoundException;
import com.movielist.repositories.MovieRepository;
import com.movielist.service.File.FileService;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final FileService fileService;

    @Value("${project.poster}")
    private String posterPath;

    public MovieServiceImpl(MovieRepository movieRepository, FileService fileService) {
        this.movieRepository = movieRepository;
        this.fileService = fileService;
    }

    @Override
    @Transactional
    public MovieDto addMovie(MovieDto movieDto, MultipartFile file) {
        try {
            // 1. Upload the file to Cloudinary
            String posterUrl = fileService.uploadFile(posterPath, file);

            // 2. Set the poster field as the original filename
            String posterFileName = file.getOriginalFilename();
            movieDto.setPoster(posterFileName);

            // 3. Map DTO to Movie entity (without movieCast initially)
            Movie movie = new Movie();
            movie.setTitle(movieDto.getTitle());
            movie.setDirector(movieDto.getDirector());
            movie.setStudio(movieDto.getStudio());
            movie.setReleaseYear(movieDto.getReleaseYear());
            movie.setPoster(posterFileName);
            movie.setPosterUrl(posterUrl);

            // 4. Save the Movie object to generate the movieId
            movie = movieRepository.save(movie);

            // 5. Create and set the MovieCast entities
            if (movieDto.getMovieCast() != null && !movieDto.getMovieCast().isEmpty()) {
                Set<MovieCast> movieCasts = new HashSet<>();
                for (String castMember : movieDto.getMovieCast()) {
                    MovieCast movieCast = new MovieCast();
                    movieCast.setMovie(movie);
                    movieCast.setCastMember(castMember);
                    movieCasts.add(movieCast);
                }
                movie.setMovieCast(movieCasts);
            } else {
                movie.setMovieCast(new HashSet<>());
            }

            // 6. Save the Movie entity again to persist the MovieCast relationship
            Movie savedMovie = movieRepository.save(movie);

            // 7. Map saved Movie back to DTO and return it
            return mapMovieToDto(savedMovie);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload poster to Cloudinary", e);
        }
    }

    @Override
    public MovieDto getMovie(Integer movieId) throws MovieNotFoundException {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with ID: " + movieId));
        return mapMovieToDto(movie);
    }

    @Override
    public List<MovieDto> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        return movies.stream()
                .map(this::mapMovieToDto)
                .collect(Collectors.toList());
    }


    @Override
    @Transactional
    public MovieDto updateMovie(Integer movieId, MovieDto movieDto, MultipartFile file) throws MovieNotFoundException {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with ID: " + movieId));

        try {
            // Update basic movie details
            movie.setTitle(movieDto.getTitle());
            movie.setDirector(movieDto.getDirector());
            movie.setStudio(movieDto.getStudio());
            movie.setReleaseYear(movieDto.getReleaseYear());

            // Update poster if a new file is provided
            if (file != null && !file.isEmpty()) {
                String posterUrl = fileService.uploadFile(posterPath, file);
                String posterFileName = file.getOriginalFilename();
                movie.setPoster(posterFileName);
                movie.setPosterUrl(posterUrl);
            }

            // Clear existing cast and add new ones
            movie.getMovieCast().clear();

            if (movieDto.getMovieCast() != null && !movieDto.getMovieCast().isEmpty()) {
                Set<MovieCast> updatedCast = new HashSet<>();
                for (String castMember : movieDto.getMovieCast()) {
                    MovieCast movieCast = new MovieCast();
                    movieCast.setMovie(movie);
                    movieCast.setCastMember(castMember);
                    updatedCast.add(movieCast);
                }
                movie.setMovieCast(updatedCast);
            }

            Movie updatedMovie = movieRepository.save(movie);
            return mapMovieToDto(updatedMovie);
        } catch (IOException e) {
            throw new RuntimeException("Failed to update movie poster", e);
        }
    }

    @Override
    @Transactional
    public void deleteMovie(Integer movieId) throws MovieNotFoundException {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with ID: " + movieId));

        // Deleting the movie will automatically delete associated MovieCast entities
        // due to CascadeType.ALL and orphanRemoval=true configuration
        movieRepository.delete(movie);
    }

    @Override
    public MoviePageResponse getAllMoviesWithPagination(Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        Page<Movie> moviePages = movieRepository.findAll(pageable);
        List<Movie> movies = moviePages.getContent();

        List<MovieDto> movieDtos = movies.stream()
                .map(this::mapMovieToDto)
                .collect(Collectors.toList());

        return new MoviePageResponse(movieDtos, pageNumber, pageSize,
                moviePages.getTotalElements(),
                moviePages.getTotalPages(),
                moviePages.isLast());
    }

    @Override
    public MoviePageResponse getAllMoviesWithPaginationAndSorting(Integer pageNumber, Integer pageSize, String sortBy, String dir) {
        Sort sort = dir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Movie> moviePages = movieRepository.findAll(pageable);
        List<Movie> movies = moviePages.getContent();

        List<MovieDto> movieDtos = movies.stream()
                .map(this::mapMovieToDto)
                .collect(Collectors.toList());

        return new MoviePageResponse(movieDtos, pageNumber, pageSize,
                moviePages.getTotalElements(),
                moviePages.getTotalPages(),
                moviePages.isLast());
    }

    @Override
    public MoviePageResponse searchMovies(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String dir) {
        Sort sort = dir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Movie> moviePages;
        if (keyword != null && !keyword.trim().isEmpty()) {
            moviePages = movieRepository.searchMovies(keyword, pageable);
        } else {
            moviePages = movieRepository.findAll(pageable);
        }

        List<Movie> movies = moviePages.getContent();

        List<MovieDto> movieDtos = movies.stream()
                .map(this::mapMovieToDto)
                .collect(Collectors.toList());

        return new MoviePageResponse(movieDtos, pageNumber, pageSize,
                moviePages.getTotalElements(),
                moviePages.getTotalPages(),
                moviePages.isLast());
    }

    // Helper method to map Movie entity to MovieDto
    private MovieDto mapMovieToDto(Movie movie) {
        MovieDto movieDto = new MovieDto();
        movieDto.setMovieId(movie.getMovieId());
        movieDto.setTitle(movie.getTitle());
        movieDto.setDirector(movie.getDirector());
        movieDto.setStudio(movie.getStudio());

        // Map MovieCast entities to Set<String>
        if (movie.getMovieCast() != null) {
            Set<String> castMembers = movie.getMovieCast().stream()
                    .map(MovieCast::getCastMember)
                    .collect(Collectors.toSet());
            movieDto.setMovieCast(castMembers);
        } else {
            movieDto.setMovieCast(new HashSet<>());
        }

        movieDto.setReleaseYear(movie.getReleaseYear());
        movieDto.setPoster(movie.getPoster());
        movieDto.setPosterUrl(movie.getPosterUrl());

        return movieDto;
    }
}