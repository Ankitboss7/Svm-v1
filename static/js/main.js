// SVM Panel - Main JavaScript File
// Auto-hide alerts after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    });
});

// Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    
    // Save preference
    fetch('/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `theme=${newTheme}`
    });
}

// Confirm action
function confirmAction(message) {
    return confirm(message);
}

// Loading state for buttons
function setLoading(button, loading) {
    if (loading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<span class="loading"></span> Processing...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText;
    }
}

// Format bytes
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Real-time validation for forms
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.style.borderColor = 'var(--accent-red)';
            } else {
                this.style.borderColor = 'var(--border-color)';
            }
        });
    });
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
}

// Initialize tooltips (if needed)
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

// AJAX Form Submission
function submitFormAjax(formId, callback) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const button = form.querySelector('button[type="submit"]');
        setLoading(button, true);

        fetch(form.action, {
            method: form.method,
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            setLoading(button, false);
            if (callback) callback(data);
        })
        .catch(error => {
            setLoading(button, false);
            console.error('Error:', error);
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initTooltips();
});
