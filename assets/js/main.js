
document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'https://neighbortech-api.onrender.com'; // Production API URL

    const handleFormSubmission = async (form, thanksDiv, formType) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // For Booking Request, check if time is selected
            if (form.id === 'contact-form') {
                const time = document.getElementById('atime').value;
                if (!time) {
                    alert('Please select an available time slot.');
                    return;
                }
            }

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.formType = formType;

            try {
                console.log(`Submitting ${formType}:`, data);
                
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                const response = await fetch(`${API_BASE}/submit-form`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    form.style.display = 'none';
                    thanksDiv.style.display = 'block';
                    
                    // Personalize thanks message for booking
                    if (formType === 'Booking Request') {
                        const dateObj = new Date(data.appointmentDate);
                        const dateStr = dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                        const timeStr = document.querySelector(`.slot-btn[data-time="${data.appointmentTime}"]`).textContent;
                        thanksDiv.innerHTML = `<h3>Booking Requested!</h3><p>We've received your request for <strong>${dateStr} at ${timeStr}</strong>. We'll call you at <strong>${data.phone}</strong> to confirm.</p>`;
                    }
                } else {
                    throw new Error(result.message || 'Server responded with an error');
                }
            } catch (error) {
                console.error('Submission error:', error);
                alert(`Sorry: ${error.message}. Please try again or call us at (555) 123-4567.`);
                
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Retry';
            }
        });
    };

    // --- Booking/Scheduling Logic ---
    const adateInput = document.getElementById('adate');
    const slotContainer = document.getElementById('slot-container');
    const slotsGrid = document.getElementById('slots-grid');
    const atimeInput = document.getElementById('atime');

    if (adateInput) {
        // Set min date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        adateInput.min = tomorrow.toISOString().split('T')[0];

        adateInput.addEventListener('change', async () => {
            const date = adateInput.value;
            if (!date) return;

            slotsGrid.innerHTML = '<p>Loading available slots...</p>';
            slotContainer.style.display = 'block';
            atimeInput.value = '';

            try {
                const response = await fetch(`${API_BASE}/available-slots?date=${date}`);
                const slots = await response.json();

                slotsGrid.innerHTML = '';
                if (slots.length === 0) {
                    slotsGrid.innerHTML = '<p>No slots available for this day. Please try another date.</p>';
                    return;
                }

                slots.forEach(slot => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'slot-btn';
                    btn.textContent = slot.label;
                    btn.dataset.time = slot.time;
                    
                    if (!slot.available) {
                        btn.disabled = true;
                        btn.classList.add('taken');
                    } else {
                        btn.addEventListener('click', () => {
                            document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
                            btn.classList.add('selected');
                            atimeInput.value = slot.time;
                        });
                    }
                    slotsGrid.appendChild(btn);
                });
            } catch (error) {
                console.error('Error fetching slots:', error);
                slotsGrid.innerHTML = '<p>Error loading slots. Please refresh or call us.</p>';
            }
        });
    }

    // --- Initialize Forms ---
    const magnetForm = document.getElementById('magnet-form');
    const magnetThanks = document.getElementById('magnet-thanks');
    if (magnetForm && magnetThanks) {
        handleFormSubmission(magnetForm, magnetThanks, 'Lead Magnet');
    }

    const contactForm = document.getElementById('contact-form');
    const contactThanks = document.getElementById('contact-thanks');
    if (contactForm && contactThanks) {
        handleFormSubmission(contactForm, contactThanks, 'Booking Request');
    }

    const familyForm = document.getElementById('family-form');
    const familyThanks = document.getElementById('family-thanks');
    if (familyForm && familyThanks) {
        handleFormSubmission(familyForm, familyThanks, 'Family Plan Inquiry');
    }

    const workshopForm = document.getElementById('workshop-form');
    const workshopThanks = document.getElementById('workshop-thanks');
    if (workshopForm && workshopThanks) {
        handleFormSubmission(workshopForm, workshopThanks, 'Workshop Inquiry');
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
