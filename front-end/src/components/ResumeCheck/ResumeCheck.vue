<script setup lang="ts">
import { ref, computed } from "vue";
import "./ResumeCheck.scss";
import {
  checkResume,
  ResumeCheckResult,
} from "../../services/API/ResumeCheckApiCalls";

const isOpen = ref(false);
const resume = ref("");
const jobPosting = ref("");
const subtlety = ref(50);
const matchStrength = ref(50);
const loading = ref(false);
const error = ref("");
const result = ref<ResumeCheckResult | null>(null);

const subtletyLabel = computed(() => {
  if (subtlety.value < 33) return "Subtle";
  if (subtlety.value < 67) return "Moderate";
  return "Bold";
});

const matchLabel = computed(() => {
  if (matchStrength.value < 33) return "General";
  if (matchStrength.value < 67) return "Balanced";
  return "Exact Match";
});

async function analyze() {
  error.value = "";
  result.value = null;

  if (!resume.value.trim()) {
    error.value = "Please paste your resume or looking-for-work ad.";
    return;
  }
  if (!jobPosting.value.trim()) {
    error.value = "Please paste the job posting.";
    return;
  }

  loading.value = true;
  const data = await checkResume(
    resume.value,
    jobPosting.value,
    subtlety.value / 100,
    matchStrength.value / 100
  );
  loading.value = false;

  if (!data) {
    error.value =
      "Failed to reach the resume service. Make sure the Flask backend is running on port 5001.";
    return;
  }
  result.value = data;
}
</script>

<template>
  <section class="resumeCheck">
    <div class="resumeCheckHeader" @click="isOpen = !isOpen">
      <h2>Resume Check</h2>
      <span class="dropdownArrow" :class="{ open: isOpen }">▼</span>
    </div>

    <div v-if="isOpen" class="resumeCheckBody">
      <div class="resumeInputs">
        <div>
          <b>Job Posting</b>
          <textarea
            v-model="jobPosting"
            placeholder="Paste the job description here..."
          ></textarea>
        </div>
        <div>
          <b>Your Resume / Looking For Work Ad</b>
          <textarea
            v-model="resume"
            placeholder="Paste your resume or looking-for-work ad here..."
          ></textarea>
        </div>
      </div>

      <div class="sliders">
        <div class="sliderGroup">
          <label>Change Intensity: {{ subtletyLabel }}</label>
          <input type="range" min="0" max="100" v-model="subtlety" />
          <div class="sliderDescription">
            Subtle (minimal tweaks) ←→ Bold (full rewrite)
          </div>
        </div>
        <div class="sliderGroup">
          <label>Job Match Strength: {{ matchLabel }}</label>
          <input type="range" min="0" max="100" v-model="matchStrength" />
          <div class="sliderDescription">
            General improvements ←→ Mirror job posting exactly
          </div>
        </div>
      </div>

      <div class="analyzeButton">
        <button @click="analyze" :disabled="loading">
          {{ loading ? "Analyzing..." : "Analyze Resume" }}
        </button>
      </div>

      <p v-if="error" class="errorMessage">{{ error }}</p>

      <p v-if="loading" class="loadingText">
        Analyzing your resume against the job posting...
      </p>

      <div v-if="result" class="results">
        <div class="resultBox">
          <h3>Suggested Improvements</h3>
          <div
            v-for="(item, index) in result.suggestions"
            :key="index"
            class="suggestionItem"
          >
            <div class="originalText">{{ item.original }}</div>
            <div class="suggestedText">→ {{ item.suggested }}</div>
          </div>
        </div>

        <div class="resultBox">
          <h3>Pros &amp; Cons</h3>
          <div
            v-for="(item, index) in result.analysis"
            :key="index"
            class="analysisItem"
          >
            <div class="originalText">{{ item.original }}</div>
            <div class="proText">✓ {{ item.pro }}</div>
            <div class="conText">✗ {{ item.con }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
