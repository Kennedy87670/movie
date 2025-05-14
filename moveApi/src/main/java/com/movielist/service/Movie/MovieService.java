package com.movielist.service.Movie;

import com.movielist.dto.MovieDto;
import com.movielist.dto.MoviePageResponse;
import com.movielist.exceptions.MovieNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface MovieService {

    MovieDto addMovie(MovieDto movieDto, MultipartFile file) throws IOException;

    MovieDto getMovie(Integer movieId) throws MovieNotFoundException;

    List<MovieDto> getAllMovies();

    MovieDto updateMovie(Integer movieId, MovieDto movieDto, MultipartFile file) throws IOException, MovieNotFoundException;
    void deleteMovie(Integer movieId) throws MovieNotFoundException;

    MoviePageResponse getAllMoviesWithPagination(Integer pageNumber, Integer pageSize);

    MoviePageResponse getAllMoviesWithPaginationAndSorting(Integer pageNumber, Integer pageSize,
                                                           String sortBy, String dir);

    MoviePageResponse searchMovies(String keyword, Integer pageNumber, Integer pageSize,
                                   String sortBy, String dir);
}
