// State management
let surveyAnswers = {}; // key: question ID (16~39), value: int (1~5)
let analysisResult = null;

// Initialize elements
document.addEventListener("DOMContentLoaded", () => {
    // 1. Build survey options for all 24 questions
    const surveyQuestions = document.querySelectorAll(".survey-question");
    surveyQuestions.forEach(qDiv => {
        const qId = parseInt(qDiv.dataset.q);
        surveyAnswers[qId] = 3; // Default score: 3 ( 보통 )
        
        const optionsContainer = qDiv.querySelector(".survey-options");
        for (let score = 1; score <= 5; score++) {
            const opt = document.createElement("div");
            opt.classList.add("survey-opt");
            if (score === 3) opt.classList.add("selected");
            opt.innerText = score;
            opt.onclick = () => selectSurveyOption(qId, score, optionsContainer);
            optionsContainer.appendChild(opt);
        }
    });

    // 2. Slider event listeners for real-time value updates
    setupSlider("current_height", "val-height", " cm");
    setupSlider("current_weight", "val-weight", " kg");
    setupSlider("skeletal_muscle", "val-muscle", " kg");
    setupSlider("body_fat", "val-fat", " %");
    setupSlider("wingspan", "val-wingspan", " cm");

    // 3. Setup OCR Drag & Drop Upload
    setupOCR();

    // 4. Setup Mobile Swipe & Initialize Wizard
    setupReportSwipe();
    updateWizardUI();

    // 5. Load last input values from localStorage if exist
    loadLastInputs();

    // 6. Register auto-save on input change
    const allInputs = document.querySelectorAll("input, select");
    allInputs.forEach(input => {
        input.addEventListener("change", saveLastInputs);
        input.addEventListener("input", saveLastInputs);
    });
});

// Input event helper
function setupSlider(sliderId, valId, unit) {
    const slider = document.getElementById(sliderId);
    const label = document.getElementById(valId);
    if (!slider) return;
    slider.addEventListener("input", (e) => {
        if (label) label.innerText = e.target.value + unit;
    });
}

// Survey selection helper
function selectSurveyOption(qId, score, container) {
    surveyAnswers[qId] = score;
    const opts = container.querySelectorAll(".survey-opt");
    opts.forEach(opt => opt.classList.remove("selected"));
    opts[score - 1].classList.add("selected");
    saveLastInputs(); // Auto-save on survey check
}

// View switching helper
function switchView(viewId) {
    const panels = document.querySelectorAll(".view-panel");
    panels.forEach(p => p.classList.remove("active"));
    document.getElementById(viewId).classList.add("active");

    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => item.classList.remove("active"));
    
    // Match nav item
    if (viewId === 'input-view') {
        navItems[0].classList.add("active");
    } else {
        navItems[1].classList.add("active");
    }
}

// OCR module setup
function setupOCR() {
    const zone = document.getElementById("ocr-upload-zone");
    const fileInput = document.getElementById("ocr-file-input");
    const status = document.getElementById("ocr-status");

    zone.onclick = () => fileInput.click();

    zone.ondragover = (e) => {
        e.preventDefault();
        zone.classList.add("dragover");
    };

    zone.ondragleave = () => zone.classList.remove("dragover");

    zone.ondrop = (e) => {
        e.preventDefault();
        zone.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) {
            handleOCRFile(e.dataTransfer.files[0]);
        }
    };

    fileInput.onchange = (e) => {
        if (e.target.files.length > 0) {
            handleOCRFile(e.target.files[0]);
        }
    };

    async function handleOCRFile(file) {
        status.style.display = "block";
        status.className = "ocr-status";
        status.innerText = "🔍 로컬 Gemma Vision OCR 판독 중...";

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/ocr", {
                method: "POST",
                headers: { "bypass-tunnel-reminder": "true" },
                body: formData
            });

            if (!res.ok) throw new Error("OCR 서버 통신 실패");
            const data = await res.json();
            
            if (data.success) {
                // Update sliders
                updateSliderVal("current_height", "val-height", data.height, " cm");
                updateSliderVal("current_weight", "val-weight", data.weight, " kg");
                updateSliderVal("skeletal_muscle", "val-muscle", data.muscle, " kg");
                updateSliderVal("body_fat", "val-fat", data.fat, " %");
                
                status.innerText = data.is_mock 
                    ? `⚠️ ${data.message}` 
                    : "✅ 인바디 데이터가 정상적으로 추출되었습니다!";
            } else {
                throw new Error("OCR 판독 데이터가 올바르지 않습니다.");
            }
        } catch (err) {
            status.className = "ocr-status error";
            status.innerText = `❌ OCR 실패: ${err.message}. 직접 슬라이더를 통해 입력해주세요.`;
        }
    }
}

function updateSliderVal(sliderId, valId, val, unit) {
    const slider = document.getElementById(sliderId);
    const label = document.getElementById(valId);
    if (slider) slider.value = val;
    if (label) label.innerText = val + unit;
}

// Submit Data to Engine
async function submitAnalysis() {
    const name = document.getElementById("name").value.strip ? document.getElementById("name").value.trim() : document.getElementById("name").value;
    if (!name) {
        alert("학생 이름을 입력해주세요.");
        return;
    }

    const payload = {
        name: name,
        gender: document.getElementById("gender").value,
        birth_date: document.getElementById("birth_date").value,
        grade: document.getElementById("grade").value,
        sports: document.getElementById("sports").value,
        position: document.getElementById("position").value,
        phone: document.getElementById("phone").value,
        father_height: parseFloat(document.getElementById("father_height").value) || 175.0,
        mother_height: parseFloat(document.getElementById("mother_height").value) || 162.0,
        current_height: parseFloat(document.getElementById("current_height").value),
        current_weight: parseFloat(document.getElementById("current_weight").value),
        body_fat: parseFloat(document.getElementById("body_fat").value),
        skeletal_muscle: parseFloat(document.getElementById("skeletal_muscle").value),
        wingspan: parseFloat(document.getElementById("wingspan").value) || null,
        survey_responses: Object.keys(surveyAnswers).sort().map(k => surveyAnswers[k])
    };

    try {
        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "bypass-tunnel-reminder": "true"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("분석 API 호출에 실패했습니다.");
        const data = await response.json();
        
        analysisResult = data;
        // Keep input payload together inside analysis result for report printing
        analysisResult.inputs = payload;

        // Save to LocalStorage for PDF printing page to retrieve
        localStorage.setItem("physicalup_analysis", JSON.stringify(analysisResult));

        // Bind results to Dashboard UI
        bindResultsToUI(data);

        // Enable and switch to results view
        const resNav = document.getElementById("result-nav-item");
        resNav.style.opacity = "1";
        resNav.style.pointerEvents = "auto";
        switchView("result-view");

    } catch (err) {
        alert("에러 발생: " + err.message);
    }
}

function bindResultsToUI(data) {
    document.getElementById("res-persona").innerText = data.pattern_name;
    document.getElementById("res-biocode").innerText = data.biocode;
    document.getElementById("res-constitution").innerText = data.constitution;
    
    // Scores
    document.getElementById("res-body-score").innerText = data.body_score;
    document.getElementById("res-metab-score").innerText = data.metab_score;
    document.getElementById("res-behavior-score").innerText = data.behavior_score;
    
    // Grades classes
    updateGradeBadge("res-body-grade", data.body_grade);
    updateGradeBadge("res-metab-grade", data.metab_grade);
    updateGradeBadge("res-behavior-grade", data.behavior_grade);
    
    // Charts
    document.getElementById("chart-five-elements").src = data.chart_five_elements;
    document.getElementById("chart-comparison").src = data.chart_comparison;
    
    // Gap Tracking Banner
    const gapBanner = document.getElementById("res-gap-banner");
    const gapTitle = document.getElementById("res-gap-title");
    const gapDesc = document.getElementById("res-gap-desc");
    
    if (data.height_gap < 0) {
        gapBanner.className = "gap-banner";
        gapTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> 유전적 예상키 대비 약 ${Math.abs(data.height_gap).toFixed(1)}cm 뒤처진 상태입니다.`;
        gapDesc.innerHTML = `부모님 유전에 따른 만 ${data.inputs ? calculateAge(data.inputs.birth_date) : 14}세 예상 키는 ${data.expected_height_now.toFixed(1)}cm이나, 현재 실측 키는 ${data.inputs ? data.inputs.current_height.toFixed(1) : 160}cm입니다. 저해 원인은 <b>${data.lag_cause}</b>로 추정됩니다.`;
    } else {
        gapBanner.className = "gap-banner positive";
        gapTitle.innerHTML = `<i class="fa-solid fa-circle-check"></i> 유전적 예상키 대비 약 +${data.height_gap.toFixed(1)}cm 우수하게 성장하고 있습니다.`;
        gapDesc.innerHTML = `부모님 유전에 따른 현재 예상 키(${data.expected_height_now.toFixed(1)}cm)를 넘어서 훌륭하게 자라나고 있습니다! 현재의 생활습관과 영양흡수 상태를 유지하는 것을 권장합니다.`;
    }
    
    // Prescriptions text bind
    document.getElementById("res-sol-current").innerText = data.pattern_current;
    document.getElementById("res-sol-flaw").innerText = data.pattern_flaw;
    document.getElementById("res-sol-solution").innerText = data.pattern_solution;
}

function updateGradeBadge(elementId, grade) {
    const el = document.getElementById(elementId);
    el.className = "score-grade grade-" + grade;
    el.innerText = grade === 3 ? "3단계 (High)" : grade === 2 ? "2단계 (Medium)" : "1단계 (Low)";
}

function calculateAge(birthStr) {
    const birthDate = new Date(birthStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Redirect and trigger Chrome print view with cache bypass
function printReport() {
    if (!analysisResult) {
        alert("먼저 성장분석 실행을 마쳐야 보고서를 인쇄할 수 있습니다.");
        return;
    }
    window.open("/static/report.html?t=" + new Date().getTime(), "_blank");
}

// Submit online request application
async function submitOnlineApplication() {
    const name = document.getElementById("name").value.trim();
    if (!name) {
        alert("학생 이름을 입력해주세요.");
        return;
    }

    const email = document.getElementById("phone").value.trim();
    if (!email || !email.includes("@")) {
        alert("온라인 접수를 위해 보호자 연락처 란에 발송받으실 [이메일 주소]를 입력해 주세요.");
        return;
    }

    const payload = {
        name: name,
        gender: document.getElementById("gender").value,
        birth_date: document.getElementById("birth_date").value,
        grade: document.getElementById("grade").value,
        sports: document.getElementById("sports").value,
        position: document.getElementById("position").value,
        phone: email, // use phone input for email recipient
        father_height: parseFloat(document.getElementById("father_height").value) || 175.0,
        mother_height: parseFloat(document.getElementById("mother_height").value) || 162.0,
        current_height: parseFloat(document.getElementById("current_height").value),
        current_weight: parseFloat(document.getElementById("current_weight").value),
        body_fat: parseFloat(document.getElementById("body_fat").value),
        skeletal_muscle: parseFloat(document.getElementById("skeletal_muscle").value),
        wingspan: parseFloat(document.getElementById("wingspan").value) || null,
        survey_responses: Object.keys(surveyAnswers).sort().map(k => surveyAnswers[k])
    };

    try {
        const response = await fetch("/api/online/apply", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "bypass-tunnel-reminder": "true"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("온라인 접수 API 호출 실패");
        const data = await response.json();
        
        if (data.success) {
            alert(`✅ 온라인 성장분석 신청이 완료되었습니다!\n대기 번호: ${data.id.substring(0, 8)}\n\n관리자가 데이터 검토 및 소견 수정을 마친 후, 입력하신 이메일(${email})로 18페이지 프리미엄 PDF 보고서를 자동 발송해 드립니다.`);
            // Reset form name
            document.getElementById("name").value = "";
        } else {
            throw new Error(data.message || "원인 불명");
        }
    } catch (err) {
        alert("온라인 신청 중 에러 발생: " + err.message);
    }
}

// ================= WIZARD & REPORT SLIDER LOGIC =================

// Wizard Navigation
function nextWizardStep(step) {
    // 1. Validation before moving forward
    if (step === 1) {
        const name = document.getElementById("name").value.trim();
        if (!name) {
            alert("학생 이름을 입력해주세요.");
            return;
        }
        const birthDate = document.getElementById("birth_date").value;
        if (!birthDate) {
            alert("생년월일을 입력해주세요.");
            return;
        }
        const grade = document.getElementById("grade").value.trim();
        if (!grade) {
            alert("학년을 입력해주세요.");
            return;
        }
        const phone = document.getElementById("phone").value.trim();
        if (!phone) {
            alert("보호자 연락처(이메일)를 입력해주세요.");
            return;
        }
    } else if (step === 2) {
        // Step 2 has default values on sliders, always proceeds
    } else if (step === 3) {
        // Verify all 24 questions (ID: 16 to 39) are answered
        const unanswered = [];
        for (let qId = 16; qId <= 39; qId++) {
            if (surveyAnswers[qId] === undefined || surveyAnswers[qId] === null) {
                unanswered.push(qId - 15); // Human-readable index (1~24)
            }
        }
        if (unanswered.length > 0) {
            alert(`아직 답변하지 않은 문항이 있습니다.\n(미답변 문항: ${unanswered.join(", ")}번)`);
            return;
        }
        
        // Prepare summary data for Step 4
        bindSummaryData();
    }

    currentWizardStep = step + 1;
    updateWizardUI();
    
    // Scroll back to top of the wizard container on mobile
    document.querySelector('.header-area').scrollIntoView({ behavior: 'smooth' });
}

function prevWizardStep(step) {
    currentWizardStep = step - 1;
    updateWizardUI();
    document.querySelector('.header-area').scrollIntoView({ behavior: 'smooth' });
}

function updateWizardUI() {
    // 1. Show/hide wizard steps
    const steps = document.querySelectorAll(".wizard-step");
    steps.forEach((stepEl, idx) => {
        if (idx + 1 === currentWizardStep) {
            stepEl.classList.add("active");
        } else {
            stepEl.classList.remove("active");
        }
    });

    // 2. Update Progress indicators
    const progressSteps = document.querySelectorAll(".progress-step");
    progressSteps.forEach((stepEl) => {
        const stepNum = parseInt(stepEl.dataset.step);
        if (stepNum === currentWizardStep) {
            stepEl.className = "progress-step active";
        } else if (stepNum < currentWizardStep) {
            stepEl.className = "progress-step completed";
        } else {
            stepEl.className = "progress-step";
        }
    });

    // 3. Update Progress Line Fill
    const fillPercent = ((currentWizardStep - 1) / 3) * 100;
    const progressFill = document.getElementById("wizard-progress-fill");
    if (progressFill) {
        progressFill.style.width = fillPercent + "%";
    }
}

function bindSummaryData() {
    document.getElementById("summary-name").innerText = document.getElementById("name").value.trim();
    document.getElementById("summary-gender-birth").innerText = 
        (document.getElementById("gender").value === "남" ? "남성" : "여성") + " / " + document.getElementById("birth_date").value;
    document.getElementById("summary-grade-sports").innerText = 
        document.getElementById("grade").value.trim() + " / " + document.getElementById("sports").value + 
        (document.getElementById("position").value.trim() ? ` (${document.getElementById("position").value.trim()})` : "");
    document.getElementById("summary-phone").innerText = document.getElementById("phone").value.trim();
    document.getElementById("summary-height-weight").innerText = 
        document.getElementById("current_height").value + " cm / " + document.getElementById("current_weight").value + " kg";
    document.getElementById("summary-muscle-fat").innerText = 
        document.getElementById("skeletal_muscle").value + " kg / " + document.getElementById("body_fat").value + " %";
}

// Report Slide controls
function goToReportSlide(slideIdx) {
    const slides = document.querySelectorAll(".report-slide");
    if (slideIdx < 0 || slideIdx >= slides.length) return;
    
    currentReportSlide = slideIdx;
    
    // Toggle active slide
    slides.forEach((slide, idx) => {
        if (idx === currentReportSlide) {
            slide.classList.add("active");
        } else {
            slide.classList.remove("active");
        }
    });

    // Toggle active dot
    const dots = document.querySelectorAll(".slider-dots .dot");
    dots.forEach((dot, idx) => {
        if (idx === currentReportSlide) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}

function nextReportSlide() {
    const slides = document.querySelectorAll(".report-slide");
    if (currentReportSlide < slides.length - 1) {
        goToReportSlide(currentReportSlide + 1);
    }
}

function prevReportSlide() {
    if (currentReportSlide > 0) {
        goToReportSlide(currentReportSlide - 1);
    }
}

// Swipe Support for mobile touch devices
let touchstartX = 0;
let touchendX = 0;

function setupReportSwipe() {
    const container = document.getElementById("report-slides-container");
    if (!container) return;

    container.addEventListener("touchstart", (e) => {
        touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener("touchend", (e) => {
        touchendX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });
}

function handleSwipeGesture() {
    // Only trigger swipe on mobile resolution
    if (window.innerWidth > 768) return;
    
    const swipeThreshold = 50; // pixels
    if (touchstartX - touchendX > swipeThreshold) {
        // Swiped Left -> Next Slide
        nextReportSlide();
    } else if (touchendX - touchstartX > swipeThreshold) {
        // Swiped Right -> Prev Slide
        prevReportSlide();
    }
}

// Auto-save form data to localStorage
function saveLastInputs() {
    try {
        const inputs = {
            name: document.getElementById("name").value,
            gender: document.getElementById("gender").value,
            birth_date: document.getElementById("birth_date").value,
            grade: document.getElementById("grade").value,
            sports: document.getElementById("sports").value,
            position: document.getElementById("position").value,
            phone: document.getElementById("phone").value,
            father_height: document.getElementById("father_height").value,
            mother_height: document.getElementById("mother_height").value,
            current_height: document.getElementById("current_height").value,
            current_weight: document.getElementById("current_weight").value,
            skeletal_muscle: document.getElementById("skeletal_muscle").value,
            body_fat: document.getElementById("body_fat").value,
            wingspan: document.getElementById("wingspan").value
        };
        localStorage.setItem("physicalup_last_inputs", JSON.stringify(inputs));
        localStorage.setItem("physicalup_last_survey", JSON.stringify(surveyAnswers));
    } catch (e) {
        console.error("입력값 자동 저장 실패", e);
    }
}

// Restore saved form data from localStorage
function loadLastInputs() {
    try {
        const savedInputs = localStorage.getItem("physicalup_last_inputs");
        if (savedInputs) {
            const inputs = JSON.parse(savedInputs);
            for (const key in inputs) {
                const el = document.getElementById(key);
                if (el) {
                    el.value = inputs[key];
                    // Update any display labels if they exist (compatibility fallback)
                    const labelId = key === "current_height" ? "val-height" :
                                    key === "current_weight" ? "val-weight" :
                                    key === "skeletal_muscle" ? "val-muscle" :
                                    key === "body_fat" ? "val-fat" :
                                    key === "wingspan" ? "val-wingspan" : null;
                    if (labelId) {
                        const label = document.getElementById(labelId);
                        const unit = key === "body_fat" ? " %" : (key === "current_height" || key === "wingspan" ? " cm" : " kg");
                        if (label) label.innerText = inputs[key] + unit;
                    }
                }
            }
        }

        const savedSurvey = localStorage.getItem("physicalup_last_survey");
        if (savedSurvey) {
            const survey = JSON.parse(savedSurvey);
            surveyAnswers = survey;
            
            // Reapply selected classes to survey buttons in the UI
            const surveyQuestions = document.querySelectorAll(".survey-question");
            surveyQuestions.forEach(qDiv => {
                const qId = parseInt(qDiv.dataset.q);
                const savedScore = surveyAnswers[qId];
                if (savedScore) {
                    const options = qDiv.querySelectorAll(".survey-opt");
                    options.forEach(opt => {
                        if (parseInt(opt.innerText) === savedScore) {
                            opt.classList.add("selected");
                        } else {
                            opt.classList.remove("selected");
                        }
                    });
                }
            });
        }
    } catch (e) {
        console.error("이전 입력값 복구 실패", e);
    }
}
