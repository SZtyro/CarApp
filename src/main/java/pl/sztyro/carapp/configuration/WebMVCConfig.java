package pl.sztyro.carapp.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;
import java.util.Arrays;

@Configuration

public class WebMVCConfig implements WebMvcConfigurer {

    @Autowired
    Environment env;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String resourceLocation;
        String fallbackIndex;

        if (Arrays.asList(env.getActiveProfiles()).contains("dev")) {
            resourceLocation = "file:src/main/webapp/browser/";
            fallbackIndex = "src/main/webapp/browser/index.html";
        } else {
            resourceLocation = "file:webapps/ROOT/browser/";
            fallbackIndex = "webapps/ROOT/browser/index.html";
        }

        registry.addResourceHandler( "/**/*")
                .addResourceLocations(resourceLocation)
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {

                        Resource requestedResource = location.createRelative(resourcePath);
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        Resource indexResource = new FileSystemResource(fallbackIndex);
                        return indexResource.exists() && indexResource.isReadable() ? indexResource : null;
                    }
                });
    }

}
