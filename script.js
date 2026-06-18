let captchaAnswer;

// --- CAPTCHA & MODAL LOGIC ---
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    captchaAnswer = num1 + num2;
    
    const questionElement = document.getElementById('captcha-question');
    if (questionElement) {
        questionElement.innerText = `Security: ${num1} + ${num2} = `;
    }
    
    const input = document.getElementById('captcha-input');
    if (input) input.value = "";
}

function toggleModal() {
    const modal = document.getElementById('applyModal');
    if (!modal) return;

    if (modal.hasAttribute('hidden')) {
        generateCaptcha();
        modal.removeAttribute('hidden');
        modal.style.display = 'flex'; 
        document.body.style.overflow = 'hidden';
    } else {
        modal.setAttribute('hidden', '');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Event Listeners for Modal Controls
document.getElementById('openModalBtn')?.addEventListener('click', toggleModal);
document.getElementById('closeModalBtn')?.addEventListener('click', toggleModal);

// --- FORM SUBMISSION ---
document.getElementById('hookForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    // Honeypot anti-spam check
    const honeypot = document.getElementById('honeypot');
    if (honeypot && honeypot.value !== "") return;
    
    // Captcha validation
    const userAnswer = parseInt(document.getElementById('captcha-input').value);
    if (userAnswer !== captchaAnswer) {
        alert("Incorrect security answer.");
        generateCaptcha();
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending Securely...";

    const method = document.getElementById('contactMethod').value;
    
    // Construct the Discord embed payload exactly like before
    const payload = {
        embeds: [{
            title: "Incoming Lead: " + method.toUpperCase(),
            color: method === 'f2f' ? 16764160 : method === 'question' ? 3447003 : 4936480,
            fields: [
                { name: "Name", value: document.getElementById('name').value, inline: true },
                { name: "Age", value: document.getElementById('age').value, inline: true },
                { name: "Phone", value: document.getElementById('phone').value, inline: true },
                { name: "Email", value: document.getElementById('email').value, inline: false },
                { name: "Interested Job", value: document.getElementById('jobType').value, inline: true },
                { name: "Notes", value: document.getElementById('note').value || "None" }
            ],
            timestamp: new Date()
        }]
    };

    // YOUR SECURE CLOUDFLARE TUNNEL ENDPOINT
    const PI_BACKEND_URL = 'https://cameron-toll-ourselves-compatibility.trycloudflare.com/api/submit-lead';

    // Post to your Raspberry Pi backend, passing the method and the payload
    fetch(PI_BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: method, payload: payload })
    })
    .then((res) => {
        if (!res.ok) throw new Error("Server error");
        alert('SSG CRUZ will be in touch shortly.');
        toggleModal();
        this.reset();
    })
    .catch(() => alert('System error. Please call the office directly.'))
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Information";
    });
});