/**
 * FormVibe Vanilla JS SDK
 * Lightweight wrapper for FormVibe endpoints.
 */
(function (window) {
    const FormVibe = {
        /**
         * Initialize all forms with data-formvibe attribute
         */
        init: function () {
            const forms = document.querySelectorAll('form[data-formvibe]');
            forms.forEach(form => {
                const formId = form.getAttribute('data-formvibe');
                if (!formId) return;

                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    this.handleSubmit(form, formId);
                });
            });
        },

        /**
         * Submit form programmatically
         */
        handleSubmit: async function (form, formId) {
            const submitBtn = form.querySelector('[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerText : 'Submit';

            const setSubmitting = (isSubmitting) => {
                if (submitBtn) {
                    submitBtn.disabled = isSubmitting;
                    submitBtn.innerText = isSubmitting ? 'Submitting...' : originalBtnText;
                }
            };

            setSubmitting(true);

            const formData = new FormData(form);
            const payload = Object.fromEntries(formData.entries());
            const endpoint = `${window.FORMVIBE_URL || 'https://formvibe.com'}/api/f/${formId}`;

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Submission failed');
                }

                // Trigger success event
                form.dispatchEvent(new CustomEvent('formvibe:success', { detail: result }));
                form.reset();

                // Optional: Redirect if URL provided
                if (result.redirectUrl) {
                    window.location.href = result.redirectUrl;
                }

            } catch (error) {
                console.error('FormVibe Error:', error);
                form.dispatchEvent(new CustomEvent('formvibe:error', { detail: error }));
                alert(error.message || 'An error occurred during submission.');
            } finally {
                setSubmitting(false);
            }
        }
    };

    // Auto-init on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => FormVibe.init());
    } else {
        FormVibe.init();
    }

    window.FormVibe = FormVibe;
})(window);
