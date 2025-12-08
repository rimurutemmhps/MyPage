// ===============================
// sliders value updating
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const ratingInputs = document.querySelectorAll(".rating-input");

  ratingInputs.forEach((input) => {
    const valueSpan = input.parentElement.querySelector(".rating-value");
    if (!valueSpan) return;

    valueSpan.textContent = input.value;

    input.addEventListener("input", () => {
      valueSpan.textContent = input.value;
    });
  });
});

// ===============================
// Contact form: validation + mask + popup
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".php-email-form");
  if (!form) return;

  const output = document.getElementById("form-output");
  const avgOutput = document.getElementById("rating-average");
  const popup = document.getElementById("form-popup");

  const firstName   = document.getElementById("firstName");
  const lastName    = document.getElementById("lastName");
  const emailInput  = document.getElementById("emailAddress");
  const phoneInput  = document.getElementById("phoneNumber");
  const addressInput= document.getElementById("address");
  const subjectInput= document.getElementById("subject");
  const messageInput= document.getElementById("projectMessage");

  const submitBtn   = form.querySelector(".submit-btn");

  const ratingAi       = document.getElementById("rating-ai");
  const ratingUx       = document.getElementById("rating-ux");
  const ratingSupport  = document.getElementById("rating-support");

  function setFieldError(input, message) {
    const group = input.closest(".form-group");
    if (!group) return;

    let error = group.querySelector(".field-error");
    if (!error) {
      error = document.createElement("small");
      error.className = "field-error";
      group.appendChild(error);
    }

    if (message) {
      group.classList.add("has-error");
      input.setAttribute("aria-invalid", "true");
      error.textContent = message;
      error.style.display = "block";
    } else {
      group.classList.remove("has-error");
      input.removeAttribute("aria-invalid");
      error.textContent = "";
      error.style.display = "none";
    }
  }

  function validateName(input) {
    const value = input.value.trim();
    if (!value) {
      setFieldError(input, "This field cannot be empty.");
      return false;
    }
    if (!/^[A-Za-zÀ-ž'\-\s]+$/.test(value)) {
      setFieldError(input, "Use letters only.");
      return false;
    }
    setFieldError(input, "");
    return true;
  }

  function validateEmail(input) {
    const value = input.value.trim();
    if (!value) {
      setFieldError(input, "Email is required.");
      return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) {
      setFieldError(input, "Please enter a valid email.");
      return false;
    }
    setFieldError(input, "");
    return true;
  }

  function validateAddress(input) {
    const value = input.value.trim();
    if (!value) {
      setFieldError(input, "Address is required.");
      return false;
    }
    if (value.length < 5) {
      setFieldError(input, "Address looks too short.");
      return false;
    }
    setFieldError(input, "");
    return true;
  }

  function validateNonEmpty(input, label) {
    const value = input.value.trim();
    if (!value) {
      setFieldError(input, `${label} is required.`);
      return false;
    }
    setFieldError(input, "");
    return true;
  }

  function validatePhone(input) {
    const value = input.value.trim();
    const re = /^\+370 6\d{2} \d{4}$/;
    if (!re.test(value)) {
      setFieldError(
        input,
        "Phone must be in format +370 6xx xxxx."
      );
      return false;
    }
    setFieldError(input, "");
    return true;
  }

  function validateField(input) {
    if (input === firstName || input === lastName) return validateName(input);
    if (input === emailInput) return validateEmail(input);
    if (input === addressInput) return validateAddress(input);
    if (input === subjectInput) return validateNonEmpty(input, "Subject");
    if (input === messageInput) return validateNonEmpty(input, "Message");
    if (input === phoneInput) return validatePhone(input);
    return true;
  }

  function validateForm(showErrors = true) {
    let isValid = true;

    const fields = [
      firstName,
      lastName,
      emailInput,
      phoneInput,
      addressInput,
      subjectInput,
      messageInput,
    ];

    fields.forEach((field) => {
      if (!field) return;
      const ok = validateField(field);
      if (!ok) isValid = false;
      if (!showErrors && !ok) {
        setFieldError(field, field.closest(".form-group")?.classList.contains("has-error") ? "" : "");
      }
    });

    return isValid;
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let digits = e.target.value.replace(/\D/g, "");

      if (digits.startsWith("370")) {
        digits = digits.slice(3);
      } else if (digits.startsWith("0")) {
        digits = digits.slice(1);
      }

      digits = digits.slice(0, 8);

      const part1 = digits.slice(0, 3);  
      const part2 = digits.slice(3, 7);  

      let formatted = "+370";
      if (part1) formatted += " " + part1;
      if (part2) formatted += " " + part2;

      e.target.value = formatted;
    });

    phoneInput.addEventListener("blur", () => {
      validatePhone(phoneInput);
      updateSubmitState();
    });
  }

  function updateSubmitState() {
    if (!submitBtn) return;
    submitBtn.disabled = !validateForm(false);
  }

  const watchedInputs = [
    firstName,
    lastName,
    emailInput,
    addressInput,
    subjectInput,
    messageInput,
  ];

  watchedInputs.forEach((input) => {
    if (!input) return;
    input.addEventListener("input", () => {
      validateField(input);
      updateSubmitState();
    });
    input.addEventListener("blur", () => {
      validateField(input);
      updateSubmitState();
    });
  });

  updateSubmitState(); 

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const isValid = validateForm(true);
    updateSubmitState();

    if (!isValid) {
      
      return;
    }

    const formData = new FormData(form);

    const data = {
      name: formData.get("name") || "",
      surname: formData.get("surname") || "",
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      address: formData.get("address") || "",
      rating_ai: Number(formData.get("rating_ai") || 0),
      rating_ux: Number(formData.get("rating_ux") || 0),
      rating_support: Number(formData.get("rating_support") || 0),
      message: formData.get("message") || "",
    };

    console.log("Form Data:", data);

    if (output) {
      output.innerHTML = `
        <div class="form-output-box">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Surname:</strong> ${data.surname}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone number:</strong> ${data.phone}</p>
          <p><strong>Address:</strong> ${data.address}</p>
          <p><strong>AI integration:</strong> ${data.rating_ai}/10</p>
          <p><strong>Current UX:</strong> ${data.rating_ux}/10</p>
          <p><strong>Need for support:</strong> ${data.rating_support}/10</p>
          <p><strong>Message:</strong> ${data.message}</p>
        </div>
      `;
    }

    const avg = (
      (data.rating_ai + data.rating_ux + data.rating_support) / 3
    ).toFixed(1);

    let avgColor = "green";
    if (avg < 4) {
      avgColor = "red";
    } else if (avg < 7) {
      avgColor = "orange";
    }

    if (avgOutput) {
      avgOutput.innerHTML = `
        <div class="form-output-box" style="margin-top: 10px;">
          <p><strong>${data.name} ${data.surname}:</strong>
            <span style="color: ${avgColor}; font-weight: 700;">${avg}</span>
          </p>
        </div>
      `;
    }

    if (popup) {
      popup.classList.remove("hidden");
      popup.classList.add("show");

      setTimeout(() => {
        popup.classList.remove("show");
        popup.classList.add("hidden");
      }, 2500);
    }
  });
});


// ===============================
// Memory Game logic + timer + best score
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("memory-board");
  const difficultySelect = document.getElementById("memory-difficulty");
  const startBtn = document.getElementById("memory-start");
  const restartBtn = document.getElementById("memory-restart");
  const movesSpan = document.getElementById("memory-moves");
  const matchesSpan = document.getElementById("memory-matches");
  const messageBox = document.getElementById("memory-message");
  const timerSpan = document.getElementById("memory-timer");

  if (!board) return;

  const icons = [
    "💡", "⚙️", "📊", "📱",
    "💻", "🌐", "🧠", "🔐",
    "📈", "🚀", "🤖", "🛰️"
  ];

  const difficultyConfig = {
    easy:   { pairs: 6,  gridClass: "grid-easy" },
    medium: { pairs: 8,  gridClass: "grid-medium" },
    hard:   { pairs: 12, gridClass: "grid-hard" }
  };

  let firstCard = null;
  let lockBoard = false;
  let moves = 0;
  let matches = 0;
  let totalPairs = 0;

  let timerInterval = null;
  let elapsedSeconds = 0;

  const BEST_KEY_PREFIX = "memoryBest_";
  let currentDifficulty = difficultySelect ? difficultySelect.value : "medium";


  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function updateStats() {
    if (movesSpan) movesSpan.textContent = moves;
    if (matchesSpan) matchesSpan.textContent = `${matches}/${totalPairs}`;
  }

  function resetState() {
    firstCard = null;
    lockBoard = false;
    moves = 0;
    matches = 0;
    if (messageBox) messageBox.textContent = "";
    updateStats();
  }

  function updateTimerDisplay() {
    if (!timerSpan) return;
    const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
    const seconds = String(elapsedSeconds % 60).padStart(2, "0");
    timerSpan.textContent = `${minutes}:${seconds}`;
  }

  function startTimer() {
    stopTimer();
    elapsedSeconds = 0;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      elapsedSeconds++;
      updateTimerDisplay();
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function resetTimer() {
    stopTimer();
    elapsedSeconds = 0;
    updateTimerDisplay();
  }

  function getBestMoves(difficulty) {
    try {
      const raw = localStorage.getItem(BEST_KEY_PREFIX + difficulty);
      return raw ? Number(raw) : null;
    } catch {
      return null;
    }
  }

  function saveBestMoves(difficulty, value) {
    try {
      localStorage.setItem(BEST_KEY_PREFIX + difficulty, String(value));
    } catch {
      
    }
  }

  function updateBestDisplay() {
    const map = {
      easy:   "memory-best-easy",
      medium: "memory-best-medium",
      hard:   "memory-best-hard",
    };

    Object.entries(map).forEach(([diff, spanId]) => {
      const span = document.getElementById(spanId);
      if (!span) return;
      const best = getBestMoves(diff);
      span.textContent = best != null ? best : "–";
    });
  }

  function createCard(symbol) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "memory-card";
    card.setAttribute("data-symbol", symbol);

    card.innerHTML = `
      <div class="memory-card-inner">
        <div class="memory-card-face memory-card-back">?</div>
        <div class="memory-card-face memory-card-front">${symbol}</div>
      </div>
    `;

    card.addEventListener("click", () => handleCardClick(card));
    return card;
  }

  function setupBoard() {
    currentDifficulty = difficultySelect ? difficultySelect.value : "medium";
    const diff = difficultyConfig[currentDifficulty] || difficultyConfig.medium;
    totalPairs = diff.pairs;

    board.innerHTML = "";
    board.className = "memory-board " + diff.gridClass;

    resetState();
    resetTimer();

    const symbols = icons.slice(0, diff.pairs);
    const cardSymbols = shuffle([...symbols, ...symbols]); 

    cardSymbols.forEach((symbol) => {
      board.appendChild(createCard(symbol));
    });
  }


  function checkWin() {
    if (matches === totalPairs) {
      stopTimer();
      if (messageBox) {
        messageBox.textContent = `Nice! You found all pairs in ${moves} moves.`;
      }

      const best = getBestMoves(currentDifficulty);
      if (best === null || moves < best) {
        saveBestMoves(currentDifficulty, moves);
      }
      updateBestDisplay();
    }
  }

  function handleCardClick(card) {
    if (lockBoard) return;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

    card.classList.add("flipped");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    moves++;
    updateStats();

    const isMatch = firstCard.dataset.symbol === card.dataset.symbol;

    if (isMatch) {
      firstCard.classList.add("matched");
      card.classList.add("matched");
      firstCard = null;
      matches++;
      updateStats();
      checkWin();
    } else {
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        card.classList.remove("flipped");
        firstCard = null;
        lockBoard = false;
      }, 700);
    }
  }

    // ===== control keys =====
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      setupBoard();   
      startTimer();   
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      setupBoard();
      startTimer();
    });
  }

  if (difficultySelect) {
    difficultySelect.addEventListener("change", () => {
      setupBoard();  
      // startTimer(); 
    });
  }

  updateBestDisplay(); 
  resetTimer();        
  setupBoard();     
});
