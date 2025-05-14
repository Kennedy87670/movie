
package com.movielist.service.File;

import com.cloudinary.Cloudinary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

@Service
public class FileServiceImpl implements FileService {
    private final Cloudinary cloudinary;

    public FileServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public String uploadFile(String path, MultipartFile file) throws IOException {
        // Upload file to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), Map.of("folder", path));
        // Return the secure URL of the uploaded file
        return (String) uploadResult.get("secure_url");
    }

    @Override
    public InputStream getResourceFile(String path, String fileName) {
        // For Cloudinary, you typically use the URL directly instead of streaming
        throw new UnsupportedOperationException("Use Cloudinary URL directly instead of streaming");
    }
}
