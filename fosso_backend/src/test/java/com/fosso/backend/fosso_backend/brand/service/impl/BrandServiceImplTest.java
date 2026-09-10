package com.fosso.backend.fosso_backend.brand.service.impl;

import com.fosso.backend.fosso_backend.brand.model.Brand;
import com.fosso.backend.fosso_backend.brand.repository.BrandRepository;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BrandServiceImplTest {

    @Mock
    private BrandRepository brandRepository;

    @InjectMocks
    private BrandServiceImpl brandService;

    @Test
    void attachLogoImage_setsLogoImageIdAndSaves() {
        Brand brand = new Brand();
        brand.setBrandId("brand-1");
        when(brandRepository.findById("brand-1")).thenReturn(Optional.of(brand));
        when(brandRepository.save(any(Brand.class))).thenAnswer(invocation -> invocation.getArgument(0));

        brandService.attachLogoImage("brand-1", "image-1");

        assertThat(brand.getLogoImageId()).isEqualTo("image-1");
        verify(brandRepository).save(brand);
    }

    @Test
    void attachLogoImage_throwsWhenBrandNotFound() {
        when(brandRepository.findById("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> brandService.attachLogoImage("missing", "image-1"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void clearLogoImage_setsLogoImageIdToNullAndSaves() {
        Brand brand = new Brand();
        brand.setBrandId("brand-1");
        brand.setLogoImageId("image-1");
        when(brandRepository.findById("brand-1")).thenReturn(Optional.of(brand));
        when(brandRepository.save(any(Brand.class))).thenAnswer(invocation -> invocation.getArgument(0));

        brandService.clearLogoImage("brand-1");

        assertThat(brand.getLogoImageId()).isNull();
        verify(brandRepository).save(brand);
    }
}
