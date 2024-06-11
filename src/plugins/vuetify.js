import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            primary: '#3f51b5', // Indigo 500
            secondary: '#64748b', // Slate 500
            accent: '#9fa8da', // Indigo 200
            error: '#0f172a', // Slate 900
            info: '#c5cae9', // Indigo 100
            success: '#f8fafc', // Slate 50
            warning: '#1e1b4b', // Indigo 950
            background: '#1e293b', // Slate 800
            footer: '#020617', // Slate 950
            header: '#f1f5f9', // Slate 100
          },
        },
      },
});
