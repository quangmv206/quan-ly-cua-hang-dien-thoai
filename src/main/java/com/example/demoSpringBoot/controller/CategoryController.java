package com.example.demoSpringBoot.controller;

import com.example.demoSpringBoot.dto.CategoryRequest;
import com.example.demoSpringBoot.dto.CategoryResponse;
import com.example.demoSpringBoot.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // CREATE Category
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse createCategory(@Validated @RequestBody CategoryRequest request) {
        return categoryService.createCategory(request);
    }

    // READ all Categories
    @GetMapping
    public List<CategoryResponse> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // READ Category by id
    @GetMapping("/{id}")
    public CategoryResponse getCategoryById(@PathVariable Integer id) {
        return categoryService.getCategoryById(id);
    }

    // UPDATE Category
    @PutMapping("/{id}")
    public CategoryResponse updateCategory(
            @PathVariable Integer id,
            @Validated @RequestBody CategoryRequest request
    ) {
        return categoryService.updateCategory(id, request);
    }

    // DELETE Category
    @DeleteMapping("/{id}")
    public Map<String, String> deleteCategory(@PathVariable Integer id) {
        categoryService.deleteCategory(id);
        return Map.of(
                "message", "Xóa danh mục thành công",
                "categoryId", id.toString()
        );
    }
}
