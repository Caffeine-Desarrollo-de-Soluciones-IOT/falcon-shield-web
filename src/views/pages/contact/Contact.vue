<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toastService = useToast();

const formData = ref({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'Soporte Técnico'
});

const handleSubmit = () => {
    // Simulación de envío de formulario (podrías integrar un servicio real)

    toastService.add({
        severity: 'success',
        summary: 'Mensaje Enviado',
        detail: 'Nos pondremos en contacto contigo pronto.',
        life: 3000
    });

    // Reiniciar formulario
    formData.value = {
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'Soporte Técnico'
    };
};

const teamMembers = [
    {
        name: 'Elvia Guadalupe Arteaga Cruz',
        role: 'Líder de Soporte Técnico',
        email: 'u201616507@upc.edu.pe',
        schedule: 'Lunes a Viernes, 9:00 AM - 5:00 PM',
        description: 'Supervisión de soporte técnico y escalación de problemas críticos.'
    },
    {
        name: 'Dennis Piero Quevedo Yucra',
        role: 'Especialista en Configuración y Dispositivos',
        email: 'u201619823@upc.edu.pe',
        schedule: 'Lunes a Viernes, 10:00 AM - 6:00 PM',
        description: 'Asistencia en la configuración e instalación de dispositivos de seguridad.'
    },
    {
        name: 'Jamutaq Piero Ortega Vélez',
        role: 'Especialista en Plataforma Web y App',
        email: 'u201911703@upc.edu.pe',
        schedule: 'Lunes a Viernes, 9:00 AM - 5:00 PM',
        description: 'Soporte técnico para el uso de la plataforma y la app móvil.'
    },
    {
        name: 'Max Dayson Sabino Arostegui',
        role: 'Asesor de Ventas y Atención al Cliente',
        email: 'u20201a991@upc.edu.pe',
        schedule: 'Lunes a Viernes, 8:00 AM - 4:00 PM',
        description: 'Consulta de planes de suscripción y servicios adicionales.'
    },
    {
        name: 'Gabriela Soledad Nomberto Ramos',
        role: 'Coordinador de Escalación y Calidad',
        email: 'u202113876@upc.edu.pe',
        schedule: 'Lunes a Viernes, 11:00 AM - 7:00 PM',
        description: 'Coordinación y calidad en respuestas de soporte técnico.'
    }
];
</script>

<template>
    <div class="card">
        <Toast ref="toast" />

        <div class="font-semibold text-xl mb-4">Contacto</div>
        <p class="mb-4">Para cualquier consulta, no dudes en ponerte en contacto con nuestro equipo de soporte:</p>

        <!-- Team Members Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div class="border p-4 rounded shadow" v-for="member in teamMembers" :key="member.email">
                <h3 class="font-semibold">{{ member.name }}</h3>
                <p class="text-sm text-gray-600 mb-2">{{ member.role }}</p>
                <p><strong>Email:</strong> {{ member.email }}</p>
                <p><strong>Horario:</strong> {{ member.schedule }}</p>
                <p class="text-sm text-gray-500 mt-2">{{ member.description }}</p>
            </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-gray-100 p-6 rounded shadow">
            <h3 class="font-semibold text-lg mb-4">Formulario de Contacto</h3>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="name" class="block font-semibold">Nombre</label>
                        <input type="text" id="name" v-model="formData.name" class="p-inputtext p-component w-full"
                            required />
                    </div>
                    <div>
                        <label for="email" class="block font-semibold">Correo Electrónico</label>
                        <input type="email" id="email" v-model="formData.email" class="p-inputtext p-component w-full"
                            required />
                    </div>
                </div>

                <div>
                    <label for="type" class="block font-semibold">Tipo de Consulta</label>
                    <select id="type" v-model="formData.type" class="p-dropdown p-component w-full">
                        <option value="Soporte Técnico">Soporte Técnico</option>
                        <option value="Configuración de Dispositivos">Configuración de Dispositivos</option>
                        <option value="Suscripciones">Consultas sobre Suscripciones</option>
                        <option value="Otros">Otros</option>
                    </select>
                </div>

                <div>
                    <label for="subject" class="block font-semibold">Asunto</label>
                    <input type="text" id="subject" v-model="formData.subject" class="p-inputtext p-component w-full"
                        required />
                </div>

                <div>
                    <label for="message" class="block font-semibold">Mensaje</label>
                    <textarea id="message" v-model="formData.message" rows="4" class="p-inputtextarea p-component w-full"
                        required></textarea>
                </div>

                <Button label="Enviar Mensaje" icon="pi pi-send" class="p-button-outlined w-full md:w-auto" type="submit" />
            </form>
        </div>
    </div>
</template>

<style scoped>
/* Personaliza los estilos de la sección de contacto según sea necesario */
</style>
