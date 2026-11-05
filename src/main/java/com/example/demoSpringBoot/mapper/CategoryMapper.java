package com.example.demoSpringBoot.mapper;

import com.example.demoSpringBoot.dto.CategoryRequest;
import com.example.demoSpringBoot.dto.CategoryResponse;
import com.example.demoSpringBoot.model.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public Category toEntity(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        return category;
    }

    public CategoryResponse toResponse(Category category) {
        if (category == null) {
            return null;
        }
        return new CategoryResponse(category.getId(), category.getName(), category.getDescription());
    }
}
