<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Assistance</div>
    <p class="mb-4">Encuentra las respuestas a tus preguntas o contacta con nuestro equipo de soporte.</p>

    <!-- FAQ Section -->
    <h3 class="font-semibold text-lg mb-3">Preguntas Frecuentes (FAQs)</h3>
    <Accordion v-model="activeIndex">
      <AccordionTab header="¿Cómo instalo los dispositivos de seguridad?">
        <p>Para instalar los dispositivos de seguridad, sigue los pasos descritos en el manual que viene con tu
          dispositivo. Si necesitas ayuda adicional, consulta nuestras guías de instalación o contáctanos.</p>
      </AccordionTab>
      <AccordionTab header="¿Cómo configuro las alertas en tiempo real?">
        <p>Para configurar las alertas, ve a la sección de "Mis dispositivos", selecciona el dispositivo que deseas
          monitorear y ajusta las notificaciones según tus preferencias.</p>
      </AccordionTab>
      <AccordionTab header="¿Cómo conecto mis dispositivos al panel de control?">
        <p>Conectar tus dispositivos es fácil. Solo asegúrate de que estén en la misma red Wi-Fi y sigue las instrucciones
          en la aplicación para vincularlos a tu cuenta.</p>
      </AccordionTab>
    </Accordion>

    <!-- Guides and Tutorials Section -->
    <h3 class="font-semibold text-lg mt-5 mb-3">Guías y Tutoriales</h3>
    <Accordion v-model="activeGuideIndex">
      <AccordionTab header="Guía de Instalación Rápida">
        <!-- PDF Viewer -->
        <h4 class="font-semibold mt-4 mb-2">- Guia de instalacion y manual de Detector de humo para conducto</h4>
        <div class="pdf-viewer">
          <iframe :src="pdfSmokeUrl" width="100%" height="800px" title="Guía de Instalación Rápida">
          </iframe>
        </div>
        <h4 class="font-semibold mt-4 mb-2">- Guia de instalacion y manual de Sensor de Proximidad</h4>
        <div class="pdf-viewer">
          <iframe :src="pdfProximityUrl" width="100%" height="800px" title="Guía de Instalación Rápida">
          </iframe>
        </div>
      </AccordionTab>
      <AccordionTab header="Cómo configurar alertas de movimiento">
        <p>Descripción detallada sobre cómo configurar las alertas de movimiento en los dispositivos...</p>
      </AccordionTab>
      <AccordionTab header="Cómo agregar nuevos dispositivos al sistema">
        <p>Pasos para añadir dispositivos adicionales al sistema de FalconShield...</p>
      </AccordionTab>
    </Accordion>

    <!-- Support Contact Section -->
    <h3 class="font-semibold text-lg mt-5 mb-3">Soporte Técnico</h3>
    <p>Si necesitas asistencia adicional, contacta a nuestro equipo de soporte:</p>
    <Button label="Contactar Soporte" icon="pi pi-envelope" class="p-button-outlined" @click="redirectToContact"></Button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: null, // Para gestionar el acordeón
      activeGuideIndex: null,
      pdfSmokeUrl: new URL('@/assets/pdf-files/smoke-detector.pdf', import.meta.url).href,
      pdfProximityUrl: new URL('@/assets/pdf-files/proximity-sensor.pdf', import.meta.url).href
    };
  },
  methods: {
    redirectToContact() {
      this.$router.push("/contact"); // Redirigir a la página de contacto
    }
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 0;
}

ul li {
  margin-bottom: 0.5rem;
}

ul li a {
  color: #007ad9;
  text-decoration: none;
}

ul li a:hover {
  text-decoration: underline;
}
</style>
