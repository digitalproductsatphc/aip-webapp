<template>
    <div class="layout-footer">
        <div class="footer-content">
            <span class="footer-text">© {{ currentYear }} AI Platform - All rights reserved.</span>
            <div class="footer-links">
                <a href="#" class="footer-link">Terms of Service</a>
                <a href="#" class="footer-link">Privacy Policy</a>
                <a href="#" class="footer-link">Contact Support</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        currentYear() {
            return new Date().getFullYear();
        }
    }
};
</script>

<style lang="scss" scoped>
.layout-footer {
    padding: 1rem 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid var(--surface-border);
}

.footer-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.footer-text {
    color: var(--text-color-secondary);
    font-size: 0.875rem;
}

.footer-links {
    display: flex;
    gap: 1rem;
}

.footer-link {
    color: var(--text-color-secondary);
    font-size: 0.875rem;
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
        color: var(--primary-color);
    }
}

@media screen and (max-width: 768px) {
    .footer-content {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
}
</style>