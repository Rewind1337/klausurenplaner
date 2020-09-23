package com.rewind.backend.controller;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.rewind.backend.entities.User;
import com.rewind.backend.rest.UserRepository;

@RestController
@CrossOrigin
public class UserController {

	@Autowired
	private UserRepository ur;

	@GetMapping("/users")
    Collection<User> getUsers() {
        return ur.findAll();
    }
	
	@GetMapping("/users/id/{id}")
    Optional<User> getUserById(@PathVariable Long id) {
        return ur.findById(id);
    }
	
	@GetMapping("/users/findByFullName/{firstname}/{lastname}")
    Optional<User> getUserById(@PathVariable String firstname, @PathVariable String lastname) {
        return ur.findByFullName(firstname, lastname);
    }
	
	@GetMapping("/users/username/{username}")
    User getUserByUsername(@PathVariable String username) {
        return ur.findByUsername(username);
    }

	@PostMapping("/users/add")
    User addUser(@RequestBody User u) {
        return ur.saveAndFlush(u);
    }

	@PostMapping("/users/batchadd")
    List<User> addUsers(@RequestBody Collection<User> u) {
        return ur.saveAll(u);
    }
	
	@GetMapping("/users/role/{id}")
    Collection<User> getUserWithRole(@PathVariable Long id) {
        return ur.findByUserrole(id);
    }

	@PostMapping("/users/edit")
    User editUserWithId(@RequestBody User u) {
        return ur.saveAndFlush(u);
    }

	@DeleteMapping("/users/delete/{id}")
	ResponseEntity<Long> deleteUserById(@PathVariable Long id) {
		if (ur.findById(id) != null) {
	        ur.deleteById(id);
			return new ResponseEntity<Long>(id, HttpStatus.OK);
		} else {
			return new ResponseEntity<Long>(id, HttpStatus.NOT_FOUND);
		}
    }
}
