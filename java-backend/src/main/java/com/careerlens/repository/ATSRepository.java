package com.careerlens.repository;

import com.careerlens.entity.ATSResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ATSRepository extends JpaRepository<ATSResult, Long> {

    Optional<ATSResult> findByResumeIdAndUserId(Long resumeId, Long userId);

    List<ATSResult> findByUserIdOrderByAnalysisDateDesc(Long userId);

    long countByUserId(Long userId);
}
