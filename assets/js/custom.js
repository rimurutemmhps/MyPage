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
// Contact form
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".php-email-form");
  const output = document.getElementById("form-output");
  const avgOutput = document.getElementById("rating-average");
  const popup = document.getElementById("form-popup");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault(); 

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

    // ==== data under form ====
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

    // ==== avarage rating ====
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

    // ==== Pop Up sent successfully" ====
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
