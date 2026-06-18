// https://discord.com/api/webhooks/1517021000728973332/3s3JFAf4_Ayk-c8CIY7vxzmZReYo6oRJFDaSwI7DzoPPqMcBOCZ-3dkQgaC5LV6ZG0qQ

document.addEventListener('DOMContentLoaded', () => {
    // Modal toggle elements
    const modal = document.getElementById('applyModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const form = document.getElementById('hookForm');
    
    // Captcha State
    let captchaAnswer = 0;

    // Open Modal and Generate Math Challenge
    openBtn.addEventListener('click', () => {
        generateCaptcha();
        modal.removeAttribute('hidden');
        // Ensure standard CSS block rendering when opened
        modal.style.display = 'flex'; 
    });
    
    // Close Modal
    closeBtn.addEventListener('click', () => {
        modal.setAttribute('hidden', 'true');
        modal.style.display = 'none';
    });

    // Generate Random Addition Captcha
    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1; 
        const num2 = Math.floor(Math.random() * 10) + 1; 
        captchaAnswer = num1 + num2;
        
        const questionElement = document.getElementById('captcha-question');
        if (questionElement) {
            questionElement.textContent = `What is ${num1} + ${num2}?`;
        }
        document.getElementById('captcha-input').value = '';
    }

    // Form Handlers
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // 1. Honeypot Anti-Spam Check
        const honeypot = document.getElementById('honeypot').value;
        if (honeypot) {
            console.warn("Spam execution blocked via honeypot field.");
            return; 
        }

        // 2. Math Captcha Check
        const userAnswer = parseInt(document.getElementById('captcha-input').value, 10);
        if (userAnswer !== captchaAnswer) {
            alert('Incorrect captcha answer. Please try again.');
            generateCaptcha();
            return;
        }

      
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const jobType = document.getElementById('jobType').value;
        const contactMethod = document.getElementById('contactMethod').value;
        const note = document.getElementById('note').value || 'None provided';

    
        const discordPayload = {
            embeds: [
                {
                    title: "New Lead",
                    color: 16104448, 
                    fields: [
                        { name: "Name", value: name, inline: true },
                        { name: "Age", value: age, inline: true },
                        { name: "Phone", value: phone, inline: true },
                        { name: "Email", value: email, inline: false },
                        { name: "Job Interest", value: jobType, inline: true },
                        { name: "Contact Method", value: contactMethod, inline: true },
                        { name: "Message/Notes", value: note, inline: false }
                    ],
                    footer: {
                        text: `Submitted on: ${new Date().toLocaleString()}`
                    }
                }
            ]
        };

        // 4. Fixed Discord Webhook Destination Endpoint
        const webhookUrl = 'https://discord.com/api/webhooks/1517021000728973332/3s3JFAf4_Ayk-c8CIY7vxzmZReYo6oRJFDaSwI7DzoPPqMcBOCZ-3dkQgaC5LV6ZG0qQ';

        // 5. Fire Request
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(discordPayload)
            });

            if (!response.ok) {
                throw new Error(`Server returned HTTP status ${response.status}`);
            }

            alert('Thank You, SSG Cruz will contact you soon.');
            form.reset();
            modal.setAttribute('hidden', 'true');
            modal.style.display = 'none';

        } catch (error) {
            console.error('Webhook execution failed:', error);
            alert('There was an error submitting your form. Please try again.');
            generateCaptcha(); 
        }
    });
});