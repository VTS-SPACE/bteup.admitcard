// Single Enrollment Link Generator
function openAdmitCard() {
    const enrollment = document.getElementById('enrollmentInput').value.trim();

    if (!enrollment) {
        showNotification('Please enter an enrollment number', 'error');
        return;
    }

    // Validate full enrollment format: must start with 'E' (case-insensitive) followed by digits
    const fullEnrollRegex = /^E\d+$/i;
    if (!fullEnrollRegex.test(enrollment)) {
        showNotification("Please enter the full enrollment (e.g. E12345678)", 'error');
        return;
    }

    // Use the Base URL input to create the full URL (works on GitHub Pages)
    const baseUrl = document.getElementById('baseUrl').value.trim() || 'https://bteup.ac.in/ESeva/Student/AdmitCard.aspx?EnrollNumber=';
    const fullUrl = baseUrl + encodeURIComponent(enrollment);

    // Show generated link
    showGeneratedLink(fullUrl);

    // Open in new tab
    window.open(fullUrl, '_blank');
}

function copyLink() {
    const enrollment = document.getElementById('enrollmentInput').value.trim();

    if (!enrollment) {
        showNotification('Please enter an enrollment number', 'error');
        return;
    }

    const baseUrl = document.getElementById('baseUrl').value.trim() || 'https://bteup.ac.in/ESeva/Student/AdmitCard.aspx?EnrollNumber=';
    const fullUrl = baseUrl + encodeURIComponent(enrollment);

    navigator.clipboard.writeText(fullUrl).then(() => {
        showNotification('Link copied ✓', 'success');
        showGeneratedLink(fullUrl);
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = fullUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Link copied ✓', 'success');
        showGeneratedLink(fullUrl);
    });
}

function showGeneratedLink(url) {
    document.getElementById('generatedLink').textContent = url;
    document.getElementById('resultDiv').style.display = 'block';
}

function copyFromDisplay() {
    const link = document.getElementById('generatedLink').textContent;

    navigator.clipboard.writeText(link).then(() => {
        showNotification('Link copied ✓', 'success');
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = link;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Link copied ✓', 'success');
    });
}

// Bulk Enrollment Links Generator
function generateBulkLinks() {
    const bulkEnrollments = document.getElementById('bulkEnrollments').value.trim();
    if (!bulkEnrollments) {
        showNotification('Please enter at least one enrollment number', 'error');
        return;
    }

    // Parse enrollments
    const enrollments = bulkEnrollments
        .split('\n')
        .map(e => e.trim())
        .filter(e => e.length > 0);

    if (enrollments.length === 0) {
        showNotification('No valid enrollment numbers found', 'error');
        return;
    }

    // Validate each enrollment is full format
    const invalids = enrollments.filter(e => !/^E\d+$/i.test(e));
    if (invalids.length > 0) {
        showNotification(`Invalid enrollment(s): ${invalids.join(', ')}. Use full format like E12345678`, 'error');
        return;
    }

    // Generate links using the base URL so they work as static links (GitHub Pages)
    const baseUrl = document.getElementById('baseUrl').value.trim() || 'https://bteup.ac.in/ESeva/Student/AdmitCard.aspx?EnrollNumber=';
    const links = enrollments.map(enrollment => ({
        enrollment: enrollment,
        url: baseUrl + encodeURIComponent(enrollment)
    }));

    // Display links
    displayBulkLinks(links);
    showNotification(`${links.length} links generated ✓`, 'success');
}

function displayBulkLinks(links) {
    const listDiv = document.getElementById('bulkLinksList');
    listDiv.innerHTML = '';

    links.forEach((link, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'link-item';
        itemDiv.innerHTML = `
            <div class="link-item-text">
                <strong>${index + 1}. ${link.enrollment}</strong><br>
                <code>${link.url}</code>
            </div>
            <div class="link-item-btn">
                <button class="open-btn" onclick="openLink('${link.url}')">
                    Open
                </button>
                <button class="copy-item-btn" onclick="copyItemLink('${link.url}')">
                    Copy
                </button>
            </div>
        `;
        listDiv.appendChild(itemDiv);
    });

    document.getElementById('bulkResultDiv').style.display = 'block';
}

function openLink(url) {
    window.open(url, '_blank');
}

function copyItemLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Link copied ✓', 'success');
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Link copied ✓', 'success');
    });
}

function downloadLinks() {
    const bulkEnrollments = document.getElementById('bulkEnrollments').value.trim();
    // baseUrl removed from client; use server redirect endpoint for CSV links

    const enrollments = bulkEnrollments
        .split('\n')
        .map(e => e.trim())
        .filter(e => e.length > 0);

    // Create CSV content
    let csvContent = 'Enrollment,Link\n';
    const baseUrlCsv = document.getElementById('baseUrl').value.trim() || 'https://bteup.ac.in/ESeva/Student/AdmitCard.aspx?EnrollNumber=';
    enrollments.forEach(enrollment => {
        csvContent += `${enrollment},"${baseUrlCsv}${encodeURIComponent(enrollment)}"\n`;
    });

    // Create download link
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `BTEUP_Links_${new Date().getTime()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showNotification('Links CSV downloaded ✓', 'success');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Enter key support
    document.getElementById('enrollmentInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            openAdmitCard();
        }
    });

    document.getElementById('bulkEnrollments').addEventListener('keydown', function (e) {
        // Allow normal behavior
    });
});

// Utility: Clear all data
function clearAllData() {
    if (confirm('Do you want to clear all data?')) {
        document.getElementById('enrollmentInput').value = '';
        document.getElementById('bulkEnrollments').value = '';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('bulkResultDiv').style.display = 'none';
        showNotification('Data cleared ✓', 'success');
    }
}
