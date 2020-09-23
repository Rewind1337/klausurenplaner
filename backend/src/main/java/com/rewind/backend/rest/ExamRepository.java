package com.rewind.backend.rest;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.rewind.backend.entities.Exam;

public interface ExamRepository extends JpaRepositoryImplementation<Exam, Long> {
}