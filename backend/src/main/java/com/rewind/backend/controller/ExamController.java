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

import com.rewind.backend.entities.Exam;
import com.rewind.backend.entities.User;
import com.rewind.backend.rest.ExamRepository;

@RestController
@CrossOrigin
public class ExamController {

	@Autowired
	private ExamRepository er;

	@GetMapping("/exams")
    Collection<Exam> getExams() {
        return er.findAll();
    }
	
	@GetMapping("/exams/id/{id}")
    Optional<Exam> getExamById(@PathVariable Long id) {
        return er.findById(id);
    }
	
	@PostMapping("/exams/add")
    Exam addExam(@RequestBody Exam u) {
        return er.saveAndFlush(u);
    }

	@PostMapping("/exams/batchadd")
    List<Exam> addExams(@RequestBody Collection<Exam> e) {
        return er.saveAll(e);
    }
	
	@PostMapping("/exams/edit")
    Exam editExamWithId(@RequestBody Exam u) {
        return er.saveAndFlush(u);
    }

	@DeleteMapping("/exams/delete/{id}")
	ResponseEntity<Long> deleteExamById(@PathVariable Long id) {
		if (er.findById(id) != null) {
	        er.deleteById(id);
			return new ResponseEntity<Long>(id, HttpStatus.OK);
		} else {
			return new ResponseEntity<Long>(id, HttpStatus.NOT_FOUND);
		}
    }
}
