package com.fosso.backend.fosso_backend.user.mapper;

import com.fosso.backend.fosso_backend.user.dto.AddressDTO;
import com.fosso.backend.fosso_backend.user.model.Address;

public class AddressMapper {
    public static AddressDTO toDTO(Address address) {
        AddressDTO addressDTO = new AddressDTO();
        addressDTO.setAddressId(address.getAddressId());
        addressDTO.setAddressType(address.getAddressType());
        addressDTO.setPhoneNumber(address.getPhoneNumber());
        addressDTO.setAddressLine1(address.getAddressLine1());
        addressDTO.setAddressLine2(address.getAddressLine2());
        addressDTO.setCity(address.getCity());
        addressDTO.setState(address.getState());
        addressDTO.setPostalCode(address.getPostalCode());
        addressDTO.setIsDefault(address.isDefault());
        addressDTO.setCountry(address.getCountry());
        return addressDTO;
    }
    public static Address toEntity(AddressDTO addressDTO) {
        Address address = new Address();
        address.setAddressId(addressDTO.getAddressId());
        address.setAddressType(addressDTO.getAddressType());
        address.setPhoneNumber(addressDTO.getPhoneNumber());
        address.setAddressLine1(addressDTO.getAddressLine1());
        address.setAddressLine2(addressDTO.getAddressLine2());
        address.setCity(addressDTO.getCity());
        address.setState(addressDTO.getState());
        address.setPostalCode(addressDTO.getPostalCode());
        address.setDefault(addressDTO.getIsDefault());
        address.setCountry(addressDTO.getCountry());
        return address;
    }

    public static void updateAddressFromAddressDTO(Address address, AddressDTO addressDTO) {
        address.setPhoneNumber(addressDTO.getPhoneNumber());
        address.setAddressType(addressDTO.getAddressType());
        address.setAddressLine1(addressDTO.getAddressLine1());
        address.setAddressLine2(addressDTO.getAddressLine2());
        address.setCity(addressDTO.getCity());
        address.setState(addressDTO.getState());
        address.setPostalCode(addressDTO.getPostalCode());
        address.setCountry(addressDTO.getCountry());
    }
}

