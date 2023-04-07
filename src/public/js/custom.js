document.addEventListener('DOMContentLoaded', () => {
    tinymce.init({
        selector: 'textarea#content',
    });
    
    const form = document.getElementById("delete_bestPractice");
    if(form) {
        form.addEventListener("submit", (e) => {
            confirm('You sure you want to delete this post?');
        });
    }

    // Dropdowns
    if (document.querySelectorAll('.dropdown-trigger').length) {
        M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));
    }

    // Tabs
    if (document.querySelectorAll('.tabs').length) {
        M.Tabs.init(document.querySelectorAll('.tabs'));
    }
});
