package com.careerlens.repository;

import com.careerlens.entity.InterviewAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewAnswerRepository extends JpaRepository<InterviewAnswer, Long> {

    List<InterviewAnswer> findByQuestionId(Long questionId);

    Optional<InterviewAnswer> findByQuestionId(Long questionId);
}
