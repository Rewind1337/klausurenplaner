package com.rewind.backend.rest;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.rewind.backend.entities.User;

public interface UserRepository extends JpaRepositoryImplementation<User, Long> {
	User findByUsername(String username);
	
	@Query("SELECT u FROM User u WHERE u.userrole.id = ?1")
	Collection<User> findByUserrole (long userrole);
	
	@Query("SELECT u FROM User u WHERE u.firstname = ?1 AND u.lastname = ?2")
	Optional<User> findByFullName (String firstname, String lastname);
}