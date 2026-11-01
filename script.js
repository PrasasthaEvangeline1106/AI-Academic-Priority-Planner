
/* =========================================================
   AI ACADEMIC PRIORITY PLANNER
   Main JavaScript / AI Priority Engine
========================================================= */


/* =========================================================
   DEMONSTRATION DATA
========================================================= */

let tasks = [
    {
        id: 1,
        name: "Computer Networks Quiz",
        subject: "Computer Networks",
        type: "Quiz",
        deadline: getDateAfter(1),
        hours: 1,
        difficulty: 1,
        importance: 7,
        completion: 0,
        completed: false
    },

    {
        id: 2,
        name: "Artificial Intelligence Assignment",
        subject: "Artificial Intelligence",
        type: "Assignment",
        deadline: getDateAfter(2),
        hours: 3,
        difficulty: 2,
        importance: 7,
        completion: 20,
        completed: false
    },

    {
        id: 3,
        name: "Operating Systems Assignment",
        subject: "Operating Systems",
        type: "Assignment",
        deadline: getDateAfter(5),
        hours: 6,
        difficulty: 3,
        importance: 8,
        completion: 20,
        completed: false
    },

    {
        id: 4,
        name: "Mathematics Midterm",
        subject: "Mathematics",
        type: "Examination",
        deadline: getDateAfter(7),
        hours: 8,
        difficulty: 3,
        importance: 10,
        completion: 0,
        completed: false
    }
];


/* =========================================================
   STUDENT LEARNING PROFILE
========================================================= */

let studentProfile = [
    {
        subject: "Computer Networks",
        confidence: 4,
        difficulty: 3,
        performance: 62,
        studyHours: 6
    },

    {
        subject: "Operating Systems",
        confidence: 5,
        difficulty: 3,
        performance: 68,
        studyHours: 7
    },

    {
        subject: "Artificial Intelligence",
        confidence: 8,
        difficulty: 1,
        performance: 86,
        studyHours: 4
    },

    {
        subject: "Mathematics",
        confidence: 6,
        difficulty: 2,
        performance: 74,
        studyHours: 8
    }
];


/* =========================================================
   CALENDAR STATE
========================================================= */

let calendarDate = new Date();


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    updateCurrentDate();

    renderDashboard();

    renderTasks();

    renderStudyPriority();

    renderProfile();

    renderCalendar();

    renderEvents();

});


/* =========================================================
   DATE FUNCTIONS
========================================================= */

function getDateAfter(days) {

    const date = new Date();

    date.setDate(date.getDate() + days);

    return formatDate(date);
}


function formatDate(date) {

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function parseDate(dateString) {

    const [year, month, day] = dateString
        .split("-")
        .map(Number);

    return new Date(year, month - 1, day);
}


function daysUntil(deadline) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const target = parseDate(deadline);

    const difference =
        target.getTime() - today.getTime();

    return Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );
}


function formatReadableDate(dateString) {

    const date = parseDate(dateString);

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


/* =========================================================
   CURRENT DATE
========================================================= */

function updateCurrentDate() {

    const today = new Date();

    document.getElementById("currentDate").textContent =
        today.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}


/* =========================================================
   NAVIGATION
========================================================= */

function showSection(sectionId) {

    document.querySelectorAll(".page-section")
        .forEach(section => {
            section.classList.remove("active-section");
        });

    document.getElementById(sectionId)
        .classList.add("active-section");


    document.querySelectorAll(".nav-item")
        .forEach(button => {
            button.classList.remove("active");
        });


    const buttons = document.querySelectorAll(".nav-item");

    const sectionNames = [
        "dashboard",
        "tasks",
        "calendar",
        "study",
        "profile"
    ];

    const index = sectionNames.indexOf(sectionId);

    if (index >= 0) {
        buttons[index].classList.add("active");
    }


    const titles = {
        dashboard: "Good evening, Student 👋",
        tasks: "Your Academic Tasks",
        calendar: "Academic Calendar",
        study: "Your Study Priorities",
        profile: "Your Learning Profile"
    };

    document.getElementById("pageTitle").textContent =
        titles[sectionId];
}


/* =========================================================
   AI PRIORITY ENGINE
========================================================= */

/*
    The priority engine does NOT simply sort by deadline.

    It considers:

    1. Deadline urgency
    2. Workload
    3. Difficulty
    4. Importance
    5. Completion
    6. Student confidence
    7. Previous performance
*/


function calculateTaskPriority(task) {

    const days = Math.max(
        0,
        daysUntil(task.deadline)
    );


    /* -----------------------------------------
       1. DEADLINE URGENCY
    ----------------------------------------- */

    let urgencyScore;

    if (days <= 0) {

        urgencyScore = 100;

    } else if (days === 1) {

        urgencyScore = 95;

    } else if (days === 2) {

        urgencyScore = 85;

    } else if (days <= 4) {

        urgencyScore = 70;

    } else if (days <= 7) {

        urgencyScore = 55;

    } else {

        urgencyScore = 30;
    }


    /* -----------------------------------------
       2. WORKLOAD
    ----------------------------------------- */

    const workloadScore =
        Math.min(task.hours / 8, 1) * 100;


    /* -----------------------------------------
       3. DIFFICULTY
    ----------------------------------------- */

    const difficultyScore =
        (task.difficulty / 3) * 100;


    /* -----------------------------------------
       4. IMPORTANCE
    ----------------------------------------- */

    const importanceScore =
        (task.importance / 10) * 100;


    /* -----------------------------------------
       5. REMAINING WORK
    ----------------------------------------- */

    const remainingWork =
        100 - task.completion;


    /* -----------------------------------------
       6. STUDENT WEAKNESS
    ----------------------------------------- */

    const profile = studentProfile.find(
        item =>
            item.subject.toLowerCase() ===
            task.subject.toLowerCase()
    );


    let weaknessScore = 50;


    if (profile) {

        const confidenceScore =
            100 - (profile.confidence * 10);

        const performanceScore =
            100 - profile.performance;

        weaknessScore =
            (confidenceScore * 0.6) +
            (performanceScore * 0.4);
    }


    /* -----------------------------------------
       FINAL AI SCORE
    ----------------------------------------- */

    let score =
        (urgencyScore * 0.30) +
        (workloadScore * 0.18) +
        (difficultyScore * 0.12) +
        (importanceScore * 0.15) +
        (remainingWork * 0.10) +
        (weaknessScore * 0.15);


    /*
        Long and difficult tasks get an
        early-start bonus.

        This prevents the AI from waiting
        until the last moment.
    */

    if (
        days >= 3 &&
        task.hours >= 4 &&
        task.difficulty >= 2
    ) {

        score += 10;
    }


    /*
        Completed tasks should never become
        the main recommendation.
    */

    if (task.completed) {

        score = 0;
    }


    return Math.round(
        Math.min(score, 100)
    );
}


/* =========================================================
   PRIORITY CLASSIFICATION
========================================================= */

function getPriority(score) {

    if (score >= 70) {

        return {
            level: "HIGH",
            className: "high"
        };

    } else if (score >= 45) {

        return {
            level: "MEDIUM",
            className: "medium"
        };

    } else {

        return {
            level: "LOW",
            className: "low"
        };
    }
}


/* =========================================================
   AI EXPLANATION GENERATOR
========================================================= */

function generateTaskReason(task) {

    const reasons = [];

    const days = daysUntil(task.deadline);


    if (days <= 1) {

        reasons.push(
            "the deadline is very close"
        );

    } else if (days <= 3) {

        reasons.push(
            `it is due in ${days} days`
        );
    }


    if (task.hours >= 4) {

        reasons.push(
            `it has a high workload of approximately ${task.hours} hours`
        );
    }


    if (task.difficulty === 3) {

        reasons.push(
            "it is a difficult task"
        );
    }


    if (task.completion < 30) {

        reasons.push(
            `only ${task.completion}% is completed`
        );
    }


    const profile = studentProfile.find(
        item =>
            item.subject.toLowerCase() ===
            task.subject.toLowerCase()
    );


    if (profile) {

        if (profile.confidence <= 5) {

            reasons.push(
                `your confidence in ${task.subject} is only ${profile.confidence}/10`
            );
        }

        if (profile.performance < 70) {

            reasons.push(
                `your recent performance is ${profile.performance}%`
            );
        }
    }


    if (reasons.length === 0) {

        reasons.push(
            "it currently has the strongest overall priority score"
        );
    }


    return (
        "Start this task because " +
        reasons.join(", ") +
        "."
    );
}


/* =========================================================
   FIND BEST CURRENT TASK
========================================================= */

function getBestTask() {

    const activeTasks = tasks
        .filter(task => !task.completed)
        .map(task => {

            return {
                ...task,

                score:
                    calculateTaskPriority(task)
            };

        });


    activeTasks.sort(
        (a, b) => b.score - a.score
    );


    return activeTasks[0];
}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    const recommendation =
        getBestTask();


    if (recommendation) {

        const priority =
            getPriority(
                recommendation.score
            );


        document.getElementById(
            "recommendedTask"
        ).textContent =
            recommendation.name;


        document.getElementById(
            "recommendedDuration"
        ).textContent =
            `Recommended duration: ${Math.min(
                recommendation.hours,
                2
            )} hour(s)`;


        document.getElementById(
            "recommendedDeadline"
        ).textContent =
            formatReadableDate(
                recommendation.deadline
            );


        document.getElementById(
            "recommendedScore"
        ).textContent =
            `${recommendation.score}/100`;


        const badge =
            document.getElementById(
                "recommendationPriority"
            );


        badge.textContent =
            `${priority.level} PRIORITY`;

        badge.className =
            `priority-badge ${priority.className}`;


        document.getElementById(
            "recommendationReason"
        ).textContent =
            generateTaskReason(
                recommendation
            );

    }


    updateStatistics();

    renderUpcomingTasks();

    renderWorkload();
}


/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics() {

    const active =
        tasks.filter(
            task => !task.completed
        );


    document.getElementById(
        "activeTasksCount"
    ).textContent =
        active.length;


    const high =
        active.filter(
            task =>
                calculateTaskPriority(task) >= 70
        );


    document.getElementById(
        "highPriorityCount"
    ).textContent =
        high.length;


    const exams =
        tasks.filter(
            task =>
                task.type === "Examination" &&
                !task.completed
        );


    document.getElementById(
        "examCount"
    ).textContent =
        exams.length;


    const hours =
        active.reduce(
            (total, task) =>
                total +
                task.hours *
                ((100 - task.completion) / 100),
            0
        );


    document.getElementById(
        "totalHours"
    ).textContent =
        `${Math.round(hours * 10) / 10}h`;
}


/* =========================================================
   UPCOMING TASKS
========================================================= */

function renderUpcomingTasks() {

    const container =
        document.getElementById(
            "upcomingTasks"
        );


    const upcoming =
        tasks
            .filter(task => !task.completed)
            .sort(
                (a, b) =>
                    parseDate(a.deadline) -
                    parseDate(b.deadline)
            )
            .slice(0, 5);


    container.innerHTML = "";


    upcoming.forEach(task => {

        const days =
            daysUntil(task.deadline);


        const item =
            document.createElement("div");

        item.className =
            "upcoming-item";


        item.innerHTML = `

            <div class="upcoming-left">

                <span class="subject-dot"></span>

                <div>

                    <h4>${task.name}</h4>

                    <span>
                        ${task.subject}
                        • ${task.hours}h estimated
                    </span>

                </div>

            </div>

            <span>
                ${days <= 0
                    ? "Due today"
                    : `Due in ${days}d`
                }
            </span>

        `;


        container.appendChild(item);

    });


    if (upcoming.length === 0) {

        container.innerHTML =
            `<p style="color:#6b7280;font-size:12px">
                No upcoming tasks.
            </p>`;
    }
}


/* =========================================================
   WORKLOAD FORECAST
========================================================= */

function renderWorkload() {

    const chart =
        document.getElementById(
            "workloadChart"
        );


    chart.innerHTML = "";


    let workloadValues = [];


    for (let i = 0; i < 7; i++) {

        const date =
            new Date();

        date.setDate(
            date.getDate() + i
        );


        const dateString =
            formatDate(date);


        const hours =
            tasks
                .filter(
                    task =>
                        task.deadline ===
                        dateString &&
                        !task.completed
                )
                .reduce(
                    (sum, task) =>
                        sum +
                        task.hours *
                        ((100 - task.completion) / 100),
                    0
                );


        workloadValues.push(hours);


        const day =
            document.createElement("div");

        day.className =
            "chart-day";


        const container =
            document.createElement("div");

        container.className =
            "chart-bar-container";


        const bar =
            document.createElement("div");

        bar.className =
            "chart-bar";


        const height =
            Math.min(
                100,
                Math.max(
                    5,
                    hours * 12
                )
            );


        bar.style.height =
            `${height}%`;


        container.appendChild(bar);


        const label =
            document.createElement("span");


        label.textContent =
            date.toLocaleDateString(
                "en-IN",
                { weekday: "short" }
            );


        day.appendChild(container);

        day.appendChild(label);

        chart.appendChild(day);

    }


    const peak =
        Math.max(...workloadValues);


    const warning =
        document.getElementById(
            "workloadWarning"
        );


    if (peak >= 6) {

        warning.textContent =
            "⚠️ High workload period detected. Consider starting some tasks earlier.";

    } else if (peak >= 3) {

        warning.textContent =
            "⚠ Moderate workload ahead. Planning early can prevent last-minute pressure.";

    } else {

        warning.textContent =
            "✓ Workload is currently manageable.";
    }
}


/* =========================================================
   TASK MANAGEMENT
========================================================= */

function renderTasks(filter = "all") {

    const container =
        document.getElementById(
            "taskList"
        );


    let filteredTasks = [...tasks];


    if (filter === "high") {

        filteredTasks =
            filteredTasks.filter(
                task =>
                    calculateTaskPriority(task) >= 70
            );

    } else if (filter === "pending") {

        filteredTasks =
            filteredTasks.filter(
                task => !task.completed
            );

    } else if (filter === "completed") {

        filteredTasks =
            filteredTasks.filter(
                task => task.completed
            );
    }


    filteredTasks.sort(
        (a, b) =>
            calculateTaskPriority(b) -
            calculateTaskPriority(a)
    );


    container.innerHTML = "";


    filteredTasks.forEach(task => {

        const score =
            calculateTaskPriority(task);


        const priority =
            getPriority(score);


        const card =
            document.createElement("div");


        card.className =
            `task-card ${
                task.completed
                    ? "completed"
                    : ""
            }`;


        card.innerHTML = `

            <div>

                <div class="task-top">

                    <div>

                        <div class="task-title">
                            ${task.name}
                        </div>

                        <div class="task-meta">

                            <span class="meta-tag">
                                ${task.subject}
                            </span>

                            <span class="meta-tag">
                                ${task.type}
                            </span>

                            <span class="meta-tag">
                                ${task.hours}h
                            </span>

                            <span class="meta-tag">
                                ${task.difficulty === 3
                                    ? "Hard"
                                    : task.difficulty === 2
                                        ? "Moderate"
                                        : "Easy"
                                }
                            </span>

                        </div>

                    </div>

                    <span class="priority-badge ${priority.className}">
                        ${priority.level}
                    </span>

                </div>


                <div class="task-progress">

                    <div class="progress-header">

                        <span>
                            Completion
                        </span>

                        <span>
                            ${task.completion}%
                        </span>

                    </div>

                    <div class="progress-track">

                        <div
                            class="progress-fill"
                            style="width:${task.completion}%"
                        ></div>

                    </div>

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="action-button"
                    onclick="toggleTask(${task.id})"
                >
                    ${task.completed
                        ? "Reopen"
                        : "Complete"
                    }
                </button>

                <button
                    class="action-button"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>

        `;


        container.appendChild(card);

    });
}


/* =========================================================
   TASK FILTER
========================================================= */

function filterTasks(filter, button) {

    document.querySelectorAll(".filter")
        .forEach(
            item =>
                item.classList.remove("active")
        );


    button.classList.add("active");


    renderTasks(filter);
}


/* =========================================================
   COMPLETE TASK
========================================================= */

function toggleTask(id) {

    const task =
        tasks.find(
            item => item.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    task.completion =
        task.completed
            ? 100
            : task.completion;


    refreshApplication();
}


/* =========================================================
   DELETE TASK
========================================================= */

function deleteTask(id) {

    tasks =
        tasks.filter(
            task => task.id !== id
        );


    refreshApplication();
}


/* =========================================================
   MODAL
========================================================= */

function openTaskModal() {

    document
        .getElementById("taskModal")
        .classList.add("show");


    document
        .getElementById("taskDeadline")
        .value =
        getDateAfter(3);
}


function closeTaskModal() {

    document
        .getElementById("taskModal")
        .classList.remove("show");
}


/* =========================================================
   ADD TASK
========================================================= */

document
    .getElementById("taskForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const newTask = {

                id:
                    Date.now(),

                name:
                    document
                        .getElementById(
                            "taskName"
                        )
                        .value,

                subject:
                    document
                        .getElementById(
                            "taskSubject"
                        )
                        .value,

                type:
                    document
                        .getElementById(
                            "taskType"
                        )
                        .value,

                deadline:
                    document
                        .getElementById(
                            "taskDeadline"
                        )
                        .value,

                hours:
                    Number(
                        document
                            .getElementById(
                                "taskHours"
                            )
                            .value
                    ),

                difficulty:
                    Number(
                        document
                            .getElementById(
                                "taskDifficulty"
                            )
                            .value
                    ),

                importance:
                    Number(
                        document
                            .getElementById(
                                "taskImportance"
                            )
                            .value
                    ),

                completion:
                    Number(
                        document
                            .getElementById(
                                "taskCompletion"
                            )
                            .value
                    ),

                completed: false
            };


            tasks.push(newTask);


            this.reset();


            closeTaskModal();


            refreshApplication();

        }
    );


/* =========================================================
   STUDY PRIORITIZATION ENGINE
========================================================= */

function calculateStudyPriority(subject) {

    const relatedTasks =
        tasks.filter(
            task =>
                task.subject ===
                subject.subject &&
                !task.completed
        );


    let nearestDeadline = 30;

    if (relatedTasks.length > 0) {

        nearestDeadline =
            Math.min(
                ...relatedTasks.map(
                    task =>
                        Math.max(
                            0,
                            daysUntil(
                                task.deadline
                            )
                        )
                )
            );
    }


    /* Deadline urgency */

    let deadlineScore;

    if (nearestDeadline <= 1) {

        deadlineScore = 100;

    } else if (nearestDeadline <= 3) {

        deadlineScore = 85;

    } else if (nearestDeadline <= 7) {

        deadlineScore = 65;

    } else {

        deadlineScore = 30;
    }


    /* Confidence weakness */

    const confidenceScore =
        100 -
        subject.confidence * 10;


    /* Previous performance */

    const performanceScore =
        100 -
        subject.performance;


    /* Difficulty */

    const difficultyScore =
        (subject.difficulty / 3) *
        100;


    /* Estimated study workload */

    const studyWorkload =
        Math.min(
            subject.studyHours / 10,
            1
        ) * 100;


    /*
        Final study score
    */

    const score =
        (deadlineScore * 0.30) +
        (confidenceScore * 0.25) +
        (performanceScore * 0.15) +
        (difficultyScore * 0.15) +
        (studyWorkload * 0.15);


    return Math.round(
        Math.min(score, 100)
    );
}


/* =========================================================
   STUDY EXPLANATION
========================================================= */

function generateStudyReason(subject) {

    const reasons = [];


    const relatedTasks =
        tasks.filter(
            task =>
                task.subject ===
                subject.subject &&
                !task.completed
        );


    if (relatedTasks.length > 0) {

        const nearest =
            Math.min(
                ...relatedTasks.map(
                    task =>
                        daysUntil(
                            task.deadline
                        )
                )
            );


        if (nearest <= 3) {

            reasons.push(
                `an important assessment is approaching in ${nearest} days`
            );
        }
    }


    if (subject.confidence <= 5) {

        reasons.push(
            `your confidence is ${subject.confidence}/10`
        );
    }


    if (subject.performance < 70) {

        reasons.push(
            `your recent performance is ${subject.performance}%`
        );
    }


    if (subject.difficulty === 3) {

        reasons.push(
            "you consider this subject difficult"
        );
    }


    if (reasons.length === 0) {

        reasons.push(
            "it currently has the strongest study priority score"
        );
    }


    return (
        "Study this first because " +
        reasons.join(", ") +
        "."
    );
}


/* =========================================================
   RENDER STUDY PRIORITY
========================================================= */

function renderStudyPriority() {

    const ranked =
        studentProfile
            .map(subject => {

                return {

                    ...subject,

                    score:
                        calculateStudyPriority(
                            subject
                        )
                };

            })
            .sort(
                (a, b) =>
                    b.score - a.score
            );


    if (ranked.length === 0) return;


    const top =
        ranked[0];


    document.getElementById(
        "studyTopSubject"
    ).textContent =
        `Study ${top.subject} first`;


    document.getElementById(
        "studyTopReason"
    ).textContent =
        generateStudyReason(top);


    const container =
        document.getElementById(
            "studyRanking"
        );


    container.innerHTML = "";


    ranked.forEach(
        (subject, index) => {

            const priority =
                getPriority(
                    subject.score
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "study-card";


            card.innerHTML = `

                <div class="rank-number">
                    ${index + 1}
                </div>


                <div>

                    <h3>
                        ${subject.subject}
                    </h3>

                    <p>
                        ${generateStudyReason(
                            subject
                        )}
                    </p>

                </div>


                <div class="study-score">

                    <strong>
                        ${subject.score}
                    </strong>

                    <span>
                        ${priority.level} PRIORITY
                    </span>

                </div>

            `;


            container.appendChild(card);

        }
    );
}


/* =========================================================
   LEARNING PROFILE
========================================================= */

function renderProfile() {

    const container =
        document.getElementById(
            "profileList"
        );


    container.innerHTML = "";


    studentProfile.forEach(
        (subject, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "profile-card";


            card.innerHTML = `

                <h3>
                    ${subject.subject}
                </h3>


                <div class="profile-field">

                    <label>
                        <span>Confidence</span>
                        <strong>
                            ${subject.confidence}/10
                        </strong>
                    </label>

                    <input
                        type="range"
                        min="1"
                        max="10"
                        value="${subject.confidence}"
                        onchange="
                            updateProfileValue(
                                ${index},
                                'confidence',
                                this.value
                            )
                        "
                    >

                </div>


                <div class="profile-field">

                    <label>
                        <span>Difficulty</span>
                    </label>

                    <select
                        onchange="
                            updateProfileValue(
                                ${index},
                                'difficulty',
                                this.value
                            )
                        "
                    >

                        <option
                            value="1"
                            ${subject.difficulty === 1
                                ? "selected"
                                : ""}
                        >
                            Easy
                        </option>

                        <option
                            value="2"
                            ${subject.difficulty === 2
                                ? "selected"
                                : ""}
                        >
                            Moderate
                        </option>

                        <option
                            value="3"
                            ${subject.difficulty === 3
                                ? "selected"
                                : ""}
                        >
                            Hard
                        </option>

                    </select>

                </div>


                <div class="profile-field">

                    <label>
                        <span>
                            Recent Performance
                        </span>

                        <strong>
                            ${subject.performance}%
                        </strong>
                    </label>

                    <input
                        type="number"
                        min="0"
                        max="100"
                        value="${subject.performance}"
                        onchange="
                            updateProfileValue(
                                ${index},
                                'performance',
                                this.value
                            )
                        "
                    >

                </div>


                <div class="profile-field">

                    <label>
                        <span>
                            Estimated Study Hours
                        </span>

                    </label>

                    <input
                        type="number"
                        min="1"
                        value="${subject.studyHours}"
                        onchange="
                            updateProfileValue(
                                ${index},
                                'studyHours',
                                this.value
                            )
                        "
                    >

                </div>

            `;


            container.appendChild(card);

        }
    );
}


/* =========================================================
   UPDATE PROFILE
========================================================= */

function updateProfileValue(
    index,
    property,
    value
) {

    if (
        property === "confidence" ||
        property === "difficulty" ||
        property === "performance" ||
        property === "studyHours"
    ) {

        value = Number(value);
    }


    studentProfile[index][property] =
        value;


    renderStudyPriority();

    renderDashboard();

}


/* =========================================================
   SAVE PROFILE
========================================================= */

function saveProfile() {

    alert(
        "Learning profile saved. The AI priority engine has been updated."
    );


    renderDashboard();

    renderStudyPriority();
}


/* =========================================================
   CALENDAR
========================================================= */

function renderCalendar() {

    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    document.getElementById(
        "calendarMonth"
    ).textContent =
        calendarDate.toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric"
            }
        );


    const grid =
        document.getElementById(
            "calendarGrid"
        );


    grid.innerHTML = "";


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );

        grid.appendChild(empty);
    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            "calendar-day";


        const date =
            new Date(
                year,
                month,
                day
            );


        const dateString =
            formatDate(date);


        const todayString =
            formatDate(
                new Date()
            );


        if (
            dateString ===
            todayString
        ) {

            cell.classList.add(
                "today"
            );
        }


        const events =
            tasks.filter(
                task =>
                    task.deadline ===
                    dateString
            );


        if (events.length > 0) {

            cell.classList.add(
                "has-event"
            );
        }


        cell.innerHTML = `

            <div class="calendar-day-number">
                ${day}
            </div>

            ${
                events.length > 0
                    ? `
                        <div style="
                            margin-top:7px;
                            color:#6b7280;
                            font-size:8px;
                        ">
                            <span class="calendar-event-dot"></span>
                            ${events.length} event(s)
                        </div>
                    `
                    : ""
            }

        `;


        grid.appendChild(cell);
    }
}


/* =========================================================
   CHANGE CALENDAR MONTH
========================================================= */

function changeMonth(amount) {

    calendarDate.setMonth(
        calendarDate.getMonth() +
        amount
    );


    renderCalendar();
}


/* =========================================================
   EVENT LIST
========================================================= */

function renderEvents() {

    const container =
        document.getElementById(
            "eventList"
        );


    const upcoming =
        [...tasks]
            .filter(
                task => !task.completed
            )
            .sort(
                (a, b) =>
                    parseDate(a.deadline) -
                    parseDate(b.deadline)
            );


    container.innerHTML = "";


    upcoming.forEach(task => {

        const priority =
            getPriority(
                calculateTaskPriority(task)
            );


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "upcoming-item";


        item.innerHTML = `

            <div class="upcoming-left">

                <span
                    class="subject-dot"
                    style="
                        background:
                        ${
                            priority.level === "HIGH"
                                ? "#dc2626"
                                : priority.level === "MEDIUM"
                                    ? "#d97706"
                                    : "#059669"
                        };
                    "
                ></span>

                <div>

                    <h4>
                        ${task.name}
                    </h4>

                    <span>
                        ${task.subject}
                        •
                        ${formatReadableDate(
                            task.deadline
                        )}
                    </span>

                </div>

            </div>

            <span class="
                priority-badge
                ${priority.className}
            ">
                ${priority.level}
            </span>

        `;


        container.appendChild(item);
    });
}


/* =========================================================
   REFRESH EVERYTHING
========================================================= */

function refreshApplication() {

    renderDashboard();

    renderTasks();

    renderStudyPriority();

    renderCalendar();

    renderEvents();

    renderProfile();
}
