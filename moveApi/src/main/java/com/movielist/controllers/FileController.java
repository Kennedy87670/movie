package com.movielist.controllers;

import com.movielist.service.File.FileService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/file/")
public class FileController {
    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @Value("${project.poster}")
    private String path;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFileHandler(@RequestPart MultipartFile file) throws IOException {
        String uploadedFileUrl = fileService.uploadFile(path, file);
        return ResponseEntity.ok("File uploaded: " + uploadedFileUrl);
    }

    @GetMapping(value = "/{fileName}")
    public void serveFileHandler(@PathVariable String fileName, HttpServletResponse response) throws IOException {
        // Construct the Cloudinary URL directly using the filename
        String cloudinaryUrl = "https://res.cloudinary.com/dn0bqllkd/image/upload/" + path + "/" + fileName;
        response.sendRedirect(cloudinaryUrl);
    }
}

