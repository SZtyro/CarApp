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
import java.util.List;

@Configuration

public class WebMVCConfig implements WebMvcConfigurer {

    @Autowired
    Environment env;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**/*")
                .addResourceLocations("file:webapps/ROOT/browser/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        List<String> list = Arrays.stream(env.getActiveProfiles()).filter("dev"::equals).toList();
                        String path = null;
                        if(list.size() == 1)
                            path = "src/main/webapp/browser/index.html";
                        else
                            path = "webapps/ROOT/browser/index.html";
                        return requestedResource.exists() && requestedResource.isReadable()
                                ? requestedResource
                                : new FileSystemResource(path);
                    }
                });
    }
}
