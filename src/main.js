import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import { updatePreset } from '@primevue/themes';

// Import PrimeVue components
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import RadioButton from 'primevue/radiobutton';
import ProgressSpinner from 'primevue/progressspinner';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Menu from 'primevue/menu';
import Toast from 'primevue/toast';
import Chip from 'primevue/chip';
import Card from 'primevue/card';
import ProgressBar from 'primevue/progressbar';
import Avatar from 'primevue/avatar';
import Divider from 'primevue/divider';
import Ripple from 'primevue/ripple';
import StyleClass from 'primevue/styleclass';

import '@/assets/main.css';
import '@/assets/styles.scss';
import '@/assets/styles/metric-cards.css';
import '@/assets/styles/dashboard-header.css';
import '@/assets/styles/responsive.css';
import '@/assets/styles/button-override.css';
import '@/assets/tailwind.css';

// Import auth initialization
import { initializeAuth } from './auth/init';

const app = createApp(App);

// Register PrimeVue components
app.component('Button', Button);
app.component('Dialog', Dialog);
app.component('InputText', InputText);
app.component('Textarea', Textarea);
app.component('RadioButton', RadioButton);
app.component('ProgressSpinner', ProgressSpinner);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Tag', Tag);
app.component('InputNumber', InputNumber);
app.component('Menu', Menu);
app.component('Toast', Toast);
app.component('Chip', Chip);
app.component('Card', Card);
app.component('ProgressBar', ProgressBar);
app.component('Avatar', Avatar);
app.component('Divider', Divider);

// Register directives
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

app.use(router);
// Water theme configuration
const waterTheme = {
    semantic: {
        primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#00a9e0',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
            950: '#082f49'
        },
        green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d'
        },
        orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12'
        },
        red: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{primary.400}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.500}',
                    activeColor: '{primary.600}'
                },
                text: {
                    color: '#002e5d',
                    mutedColor: '#002e5d'
                }
            },
            dark: {
                primary: {
                    color: '{primary.400}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.300}',
                    activeColor: '{primary.200}'
                },
                text: {
                    color: '#ffffff',
                    mutedColor: '#e2e8f0'
                }
            }
        }
    }
};

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '.app-dark',
            cssLayer: false
        }
    },
    ripple: true
});

// Apply Water theme immediately
updatePreset(waterTheme);
app.use(ToastService);
app.use(ConfirmationService);

// Initialize MSAL before mounting the app
initializeAuth().then(() => {
    // Apply Water theme after initialization
    updatePreset(waterTheme);
    // Mount the app after MSAL initialization
    app.mount('#app');
}).catch(error => {
    console.error('Failed to initialize the app:', error);
    // Apply Water theme even on error
    updatePreset(waterTheme);
    // Mount the app anyway to show error messages
    app.mount('#app');
});

// Global error handler
app.config.errorHandler = (err, instance, info) => {
    console.error('Vue Error:', err);
    console.error('Error Info:', info);
};
